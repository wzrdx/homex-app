import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { BsGem } from 'react-icons/bs';
import { smartContract } from '../../blockchain/auxiliary/smartContract';
import { config } from '../../blockchain/config';
import { SFT } from '../../blockchain/types';
import { getArtRarityName } from '../../services/helpers';
import { StoreContextType, useStoreContext } from '../../services/store';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { ArtTokenNumberInput } from '../../shared/ArtTokenNumberInput';
import TokenCard, { TokenType } from '../../shared/TokenCard';
import { useStaking } from '../Staking';

function Stake() {
    const { height, displayToast } = useStaking();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    const { address } = useGetAccountInfo();

    const { mazeStakingInfo, walletArtTokens, getWalletStakeableAoMSFTs } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);

    const [selectedTokens, setSelectedTokens] = useState<Array<SFT>>([]);
    const [tokenBalances, setTokenBalances] = useState<{
        [nonce: string]: number;
    }>({});

    useEffect(() => {
        getWalletStakeableAoMSFTs();
    }, []);

    useEffect(() => {
        setSelectedTokens([]);
    }, [walletArtTokens]);

    const stake = async () => {
        if (!mazeStakingInfo) {
            return;
        }

        onModalClose();
        setButtonLoading(true);

        const user = new Address(address);

        try {
            const transfers: TokenTransfer[] = _(tokenBalances)
                .map((value, key) => TokenTransfer.semiFungible(config.aomCollectionId, Number.parseInt(key), value))
                .value();

            const tx = smartContract.methods
                .stake()
                .withMultiESDTNFTTransfer(transfers)
                .withSender(user)
                .withExplicitReceiver(user)
                .withChainID(config.chainId)
                .withGasLimit(20000000 + 5000000 * _.size(transfers))
                .buildTransaction();

            await refreshAccount();

            const { sessionId } = await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    processingMessage: 'Processing transaction',
                    errorMessage: 'Error',
                    successMessage: 'Transaction successful',
                },
                redirectAfterSign: false,
            });

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.StakeArt,
                    resolution: TxResolution.UpdateArtStakingAndSFTs,
                    data: _.sum(Object.values(tokenBalances)),
                },
            ]);

            setButtonLoading(false);
        } catch (err) {
            console.error('Error occured while staking', err);
            setButtonLoading(false);
        }
    };

    const selectAll = async () => {
        if (!walletArtTokens) {
            return;
        }

        setSelectedTokens(_(walletArtTokens).take(25).value());
    };

    const openBalancesModal = () => {
        if (!mazeStakingInfo) {
            return;
        }

        if (_.isEmpty(selectedTokens)) {
            displayToast('error', 'Nothing selected', 'Select some SFTs in order to stake', 'redClrs');
            return;
        }

        setTokenBalances({});
        onModalOpen();
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            <Flex pb={6} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={4} alignItems="center">
                    <Button
                        colorScheme="red"
                        onClick={openBalancesModal}
                        isDisabled={!mazeStakingInfo || isTxPending(TransactionType.UnstakeArt)}
                        isLoading={isButtonLoading || isTxPending(TransactionType.StakeArt)}
                    >
                        Stake
                    </Button>

                    <Button
                        colorScheme="orange"
                        onClick={selectAll}
                        isDisabled={
                            !mazeStakingInfo || isTxPending(TransactionType.UnstakeArt) || isTxPending(TransactionType.StakeArt)
                        }
                    >
                        Select all (25 max.)
                    </Button>

                    <Flex ml={4} alignItems="center">
                        <InfoOutlineIcon mr={1.5} color="almostWhite" />
                        <Text color="almostWhite">Select some SFTs in order to stake</Text>
                    </Flex>
                </Stack>

                <Flex ml={4} alignItems="center">
                    <InfoIcon mr={1.5} color="brightWheat" />
                    <Text color="brightWheat">Staking will automatically claim your rewards</Text>
                </Flex>
            </Flex>

            {!walletArtTokens ? (
                <Flex alignItems="center" justifyContent="center" height="100%">
                    <Spinner size="md" />
                </Flex>
            ) : (
                <>
                    {_.isEmpty(walletArtTokens) ? (
                        <Flex py={4}>
                            <Flex backgroundColor="#000000e3">
                                <Alert status="info">
                                    <AlertIcon />
                                    You have no SFTs available for staking. View your staked SFT in the 'Staked' tab.
                                </Alert>
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex
                            className="Scrollbar-Gutter"
                            flexDir="column"
                            alignItems="center"
                            overflowY="auto"
                            pr={4}
                            mr="calc(-1rem - 6px)"
                            height="100%"
                        >
                            <Box
                                display="grid"
                                gridAutoColumns="1fr"
                                gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                                rowGap={4}
                                columnGap={4}
                                pb="1px"
                            >
                                {_.map(walletArtTokens, (token, index) => (
                                    <Box
                                        key={index}
                                        cursor="pointer"
                                        onClick={() => {
                                            if (isButtonLoading || isTxPending(TransactionType.StakeArt)) {
                                                return;
                                            }

                                            setSelectedTokens((tokens) => {
                                                if (
                                                    _.findIndex(
                                                        tokens,
                                                        (t) => t.nonce === token.nonce && t.tokenId === token.tokenId
                                                    ) === -1
                                                ) {
                                                    if (_.size(tokens) === 25) {
                                                        return tokens;
                                                    }

                                                    return [...tokens, token];
                                                } else {
                                                    return _.filter(
                                                        tokens,
                                                        (t) => !(t.nonce === token.nonce && t.tokenId === token.tokenId)
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        <TokenCard
                                            tokenType={TokenType.SFT}
                                            isSelected={
                                                _.findIndex(
                                                    selectedTokens,
                                                    (t) => t.nonce === token.nonce && t.tokenId === token.tokenId
                                                ) > -1
                                            }
                                            token={token}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Flex>
                    )}
                </>
            )}

            {/* Balances modal */}
            <Modal size="xl" onClose={onModalClose} isOpen={isModalOpen} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor="dark" width="446px">
                    <ModalHeader>Select quantities</ModalHeader>

                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ boxShadow: '0 0 transparent' }}
                        borderRadius="3px"
                    />
                    <ModalBody>
                        <Stack spacing={3}>
                            {_.map(selectedTokens, (token, index) => (
                                <Stack direction="row" alignItems="center" justifyContent="space-between" key={index}>
                                    <Stack spacing={3} direction="row" alignItems="center">
                                        <Box color={`blizzard${getArtRarityName((token as SFT).artRarityClass)}`} pt="2px">
                                            <BsGem fontSize="21px" />
                                        </Box>

                                        <Text>{token.name}</Text>
                                    </Stack>

                                    <ArtTokenNumberInput token={token} updateFunction={setTokenBalances} />
                                </Stack>
                            ))}
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" onClick={stake}>
                            Stake
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Stake;
