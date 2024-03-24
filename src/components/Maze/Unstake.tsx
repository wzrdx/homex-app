import _ from 'lodash';
import {
    Box,
    Flex,
    Text,
    Spinner,
    AlertIcon,
    Alert,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    Button,
    Stack,
    ModalFooter,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { SFT } from '../../blockchain/types';
import TokenCard, { TokenType } from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { smartContract } from '../../blockchain/auxiliary/smartContract';
import { BsGem } from 'react-icons/bs';
import { getArtRarityName } from '../../services/helpers';
import { ArtTokenNumberInput } from '../../shared/ArtTokenNumberInput';
import MazeYield from '../../shared/MazeYield';

function Unstake() {
    const { height, displayToast } = useStaking();
    const { address } = useGetAccountInfo();

    const { isOpen: isYieldOpen, onOpen: onYieldOpen, onClose: onYieldClose } = useDisclosure();

    // Token balances modal
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    const { mazeStakingInfo, stakedArtTokens, getStakedAoMSFTs } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);
    const [isClaimButtonLoading, setClaimButtonLoading] = useState(false);

    const [selectedTokens, setSelectedTokens] = useState<SFT[]>([]);
    const [tokenBalances, setTokenBalances] = useState<{
        [nonce: string]: number;
    }>({});

    useEffect(() => {
        setSelectedTokens([]);
        getStakedAoMSFTs();
    }, [mazeStakingInfo]);

    const unstake = async () => {
        if (!mazeStakingInfo || !stakedArtTokens) {
            return;
        }

        onModalClose();
        setUnstakeButtonLoading(true);

        const user = new Address(address);

        const args = _.map(selectedTokens, (token) => ({
            token_id: new TokenIdentifierValue(token.tokenId),
            nonce: new U16Value(token.nonce),
            amount: new U16Value(tokenBalances[token.nonce]),
            timestamp: new OptionValue(new OptionType(new U64Type()), null),
        }));

        if (_.isEmpty(args)) {
            setUnstakeButtonLoading(false);
            return;
        }

        try {
            const tx = smartContract.methods
                .unstake([args])
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(20000000 + 500000 * stakedArtTokens.length + 2000000 * _.size(args))
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
                    type: TransactionType.UnstakeArt,
                    resolution: TxResolution.UpdateArtStakingAndSFTs,
                    data: _.sum(Object.values(tokenBalances)),
                },
            ]);

            setUnstakeButtonLoading(false);
        } catch (err) {
            console.error('Error occured ', err);
            setUnstakeButtonLoading(false);
        }
    };

    const claimStakingRewards = async () => {
        if (!mazeStakingInfo || !stakedArtTokens) {
            return;
        }

        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .claimMaze()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(15000000 + 500000 * stakedArtTokens.length)
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
                    type: TransactionType.ClaimMaze,
                    resolution: TxResolution.UpdateArtStakingAndSFTs,
                },
            ]);

            setClaimButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    const openBalancesModal = () => {
        if (!mazeStakingInfo) {
            return;
        }

        if (_.isEmpty(selectedTokens)) {
            displayToast('error', 'Nothing selected', 'Select some SFTs in order to unstake', 'redClrs');
            return;
        }

        setTokenBalances({});
        onModalOpen();
    };

    const selectAll = async () => {
        if (!stakedArtTokens) {
            return;
        }

        setSelectedTokens(stakedArtTokens);
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {!!stakedArtTokens ? (
                <>
                    <Flex pb={6} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Button
                                colorScheme="red"
                                onClick={openBalancesModal}
                                isDisabled={
                                    !mazeStakingInfo ||
                                    isTxPending(TransactionType.StakeArt) ||
                                    isTxPending(TransactionType.ClaimMaze)
                                }
                                isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.UnstakeArt)}
                            >
                                Unstake
                            </Button>

                            <Button
                                colorScheme="orange"
                                onClick={selectAll}
                                isDisabled={
                                    !mazeStakingInfo ||
                                    isTxPending(TransactionType.StakeArt) ||
                                    isTxPending(TransactionType.UnstakeArt) ||
                                    isTxPending(TransactionType.ClaimMaze)
                                }
                            >
                                Select all
                            </Button>

                            {mazeStakingInfo?.isStaked && (
                                <Flex ml={4} alignItems="center">
                                    <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                    <Text color="almostWhite">Maze can only be claimed in-game</Text>
                                </Flex>
                            )}
                        </Stack>

                        {mazeStakingInfo?.isStaked && (
                            <Stack direction="row" spacing={4}>
                                <Button
                                    colorScheme="orange"
                                    onClick={onYieldOpen}
                                    isDisabled={
                                        isTxPending(TransactionType.UnstakeArt) ||
                                        isTxPending(TransactionType.StakeArt) ||
                                        isTxPending(TransactionType.ClaimMaze)
                                    }
                                >
                                    <Flex alignItems="center">
                                        <InfoOutlineIcon />
                                        <Text ml={1.5}>View Yield</Text>
                                    </Flex>
                                </Button>

                                <Button
                                    isDisabled={
                                        !mazeStakingInfo ||
                                        isTxPending(TransactionType.StakeArt) ||
                                        isTxPending(TransactionType.UnstakeArt)
                                    }
                                    isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimMaze)}
                                    colorScheme="purple"
                                    onClick={claimStakingRewards}
                                >
                                    <Text>Claim Maze</Text>
                                </Button>
                            </Stack>
                        )}
                    </Flex>

                    {_.isEmpty(stakedArtTokens) ? (
                        <Flex py={4}>
                            <Flex backgroundColor="#000000e3">
                                <Alert status="info">
                                    <AlertIcon />
                                    You have no staked SFTs to display
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
                        >
                            <Box
                                display="grid"
                                gridAutoColumns="1fr"
                                gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                                rowGap={4}
                                columnGap={4}
                                pb="1px"
                            >
                                {_.map(stakedArtTokens, (token, index) => (
                                    <Box
                                        key={index}
                                        cursor="pointer"
                                        onClick={() => {
                                            if (isUnstakeButtonLoading || isTxPending(TransactionType.StakeArt)) {
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
            ) : (
                <Flex alignItems="center" justifyContent="center" height="100%">
                    <Spinner size="md" />
                </Flex>
            )}

            {/* Yield */}
            <Modal onClose={onYieldClose} isOpen={isYieldOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Maze per day</ModalHeader>
                    <ModalCloseButton _focusVisible={{ outline: 0 }} />

                    <ModalBody>
                        <Flex pb={3} mt={-1}>
                            {stakedArtTokens && <MazeYield stakedArtTokens={stakedArtTokens} />}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>

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
                        <Button colorScheme="red" onClick={unstake}>
                            Unstake
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Unstake;
