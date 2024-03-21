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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import {
    AOM_COLLECTION_ID,
    CHAIN_ID,
    ELDERS_COLLECTION_ID,
    ELDERS_PADDING,
    TRAVELERS_COLLECTION_ID,
    isStakingDisabled,
} from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT, Rarity, SFT, Stake } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { getContractNFTs } from '../../services/authentication';
import { getTravelersPadding, getUnbondingDuration, pairwise, toHexNumber } from '../../services/helpers';
import { smartContract } from '../../blockchain/game/smartContract';
import Yield from '../../shared/Yield';
import { formatDistance } from 'date-fns';

function Unstake() {
    const { height } = useStaking();
    const { address } = useGetAccountInfo();

    const { isOpen: isYieldOpen, onOpen: onYieldOpen, onClose: onYieldClose } = useDisclosure();

    const { mazeStakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);

    const [tokens, setTokens] = useState<NFT[]>();

    const [selectedTokens, setSelectedTokens] = useState<Array<SFT>>([]);

    useEffect(() => {
        setSelectedTokens([]);
        getNFTs();
    }, [mazeStakingInfo]);

    const getNFTs = async () => {
        if (!mazeStakingInfo) {
            return;
        }

        const nonces: number[] = _.map(mazeStakingInfo.tokens, (token) => token.nonce);

        setTokens(undefined);

        const chunks = new Array(Math.floor(nonces.length / 25)).fill(25).concat(nonces.length % 25);
        const apiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const ids = _.map(nonces, (nonce) => `${AOM_COLLECTION_ID}-${toHexNumber(nonce, nonce >= 256 ? 4 : 2)}`);

        pairwise(
            _(chunks)
                .filter(_.identity)
                .map((chunk, index) => {
                    return index * 25 + chunk;
                })
                .unshift(0)
                .value(),
            (from: number, to: number) => {
                const slice = ids.slice(from, to);
                apiCalls.push(getContractNFTs(AOM_COLLECTION_ID, slice.join(',')));
            }
        );

        const contractTokens = _(await Promise.all(apiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((sft) => ({
                ...sft,
                tokenId: AOM_COLLECTION_ID,
            }))
            .orderBy('nonce', 'asc')
            .value();

        console.log(contractTokens);

        setTokens(contractTokens);
    };

    const unstake = async () => {
        if (!mazeStakingInfo || !elders || !tokens) {
            return;
        }

        setUnstakeButtonLoading(true);

        const user = new Address(address);

        const args = _(mazeStakingInfo.tokens)
            .filter((token) => _.findIndex(selectedTokens, (t) => t.nonce === token.nonce && t.tokenId === token.tokenId) > -1)
            .map((token) => ({
                token_id: new TokenIdentifierValue(token.tokenId),
                nonce: new U16Value(token.nonce),
                amount: new U16Value(token.amount),
                timestamp: new OptionValue(new OptionType(new U64Type()), null),
            }))
            .value();

        const stakedNFTsCount = _.size([...elders, ...tokens]);

        if (_.isEmpty(args)) {
            setUnstakeButtonLoading(false);
            return;
        }

        try {
            const tx = smartContract.methods
                .unstake([args])
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(80000000 + 500000 * stakedNFTsCount + 2000000 * _.size(args))
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
                    type: TransactionType.UnstakeMain,
                    resolution: TxResolution.UpdateMainStakingAndNFTs,
                    data: _.size(args),
                },
            ]);

            setUnstakeButtonLoading(false);
        } catch (err) {
            console.error('Error occured ', err);
        }
    };

    const claimStakingRewards = async () => {
        if (!mazeStakingInfo || !elders || !tokens) {
            return;
        }

        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        const stakedNFTsCount = _.size([...elders, ...tokens]);

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(75000000 + 750000 * stakedNFTsCount)
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
                    type: TransactionType.ClaimEnergy,
                    resolution: TxResolution.UpdateStakingInfo,
                },
            ]);

            setClaimButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    const selectAll = async () => {
        if (!elders || !tokens) {
            return;
        }

        setSelectedTokens(
            _([...elders, ...tokens])
                .map((token) => ({
                    nonce: token.nonce,
                    tokenId: token.tokenId,
                }))
                .value()
        );
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {elders && tokens ? (
                <>
                    <Flex pb={6} alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <ActionButton
                                disabled={
                                    isStakingDisabled ||
                                    !mazeStakingInfo ||
                                    isTxPending(TransactionType.ClaimEnergy) ||
                                    isTxPending(TransactionType.StakeMain)
                                }
                                isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.UnstakeMain)}
                                colorScheme="blue"
                                customStyle={{ width: '120px' }}
                                onClick={unstake}
                            >
                                <Text>Unstake</Text>
                            </ActionButton>

                            <Box ml={4}>
                                <ActionButton
                                    colorScheme="default"
                                    customStyle={{ width: '142px' }}
                                    onClick={selectAll}
                                    disabled={
                                        !mazeStakingInfo ||
                                        isTxPending(TransactionType.ClaimEnergy) ||
                                        isTxPending(TransactionType.UnstakeMain) ||
                                        isTxPending(TransactionType.StakeMain)
                                    }
                                >
                                    <Text>Select all</Text>
                                </ActionButton>
                            </Box>

                            {mazeStakingInfo?.isStaked && (
                                <Flex ml={4} alignItems="center">
                                    <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                    <Text color="almostWhite">
                                        The unbonding duration is{' '}
                                        <Text as="span" fontWeight={600}>
                                            {formatDistance(new Date(0), new Date(getUnbondingDuration() * 1000), {
                                                addSuffix: false,
                                            })}
                                        </Text>
                                    </Text>
                                </Flex>
                            )}
                        </Flex>

                        {mazeStakingInfo?.isStaked && (
                            <Flex>
                                <ActionButton
                                    colorScheme="default"
                                    onClick={onYieldOpen}
                                    disabled={
                                        _.isEmpty(rarities) ||
                                        isTxPending(TransactionType.ClaimEnergy) ||
                                        isTxPending(TransactionType.UnstakeMain) ||
                                        isTxPending(TransactionType.StakeMain)
                                    }
                                >
                                    <Flex alignItems="center">
                                        <InfoOutlineIcon />
                                        <Text ml={1.5}>View Yield</Text>
                                    </Flex>
                                </ActionButton>

                                <Box ml={4}>
                                    <ActionButton
                                        disabled={
                                            isStakingDisabled ||
                                            !mazeStakingInfo ||
                                            isTxPending(TransactionType.StakeMain) ||
                                            isTxPending(TransactionType.UnstakeMain)
                                        }
                                        isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimEnergy)}
                                        colorScheme="blue"
                                        customStyle={{ width: '144px' }}
                                        onClick={claimStakingRewards}
                                    >
                                        <Text>Claim Energy</Text>
                                    </ActionButton>
                                </Box>
                            </Flex>
                        )}
                    </Flex>

                    {_.isEmpty(tokens) && _.isEmpty(elders) ? (
                        <Flex py={4}>
                            <Flex backgroundColor="#000000e3">
                                <Alert status="info">
                                    <AlertIcon />
                                    You have no staked NFTs to display
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
                            >
                                {_.map([...elders, ...tokens], (token, index) => (
                                    <Box
                                        key={index}
                                        cursor="pointer"
                                        onClick={() => {
                                            if (isUnstakeButtonLoading || isTxPending(TransactionType.StakeMain)) {
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

                                                    return [
                                                        ...tokens,
                                                        {
                                                            nonce: token.nonce,
                                                            tokenId: token.tokenId,
                                                        },
                                                    ];
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
                                            isSelected={
                                                _.findIndex(
                                                    selectedTokens,
                                                    (t) => t.nonce === token.nonce && t.tokenId === token.tokenId
                                                ) > -1
                                            }
                                            token={token}
                                            rarity={
                                                token?.tokenId === TRAVELERS_COLLECTION_ID &&
                                                _.find(rarities, (rarity) => rarity.nonce === token.nonce)
                                            }
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
                    <ModalHeader>Energy per hour</ModalHeader>
                    <ModalCloseButton _focusVisible={{ outline: 0 }} />

                    <ModalBody>
                        <Flex pb={3} mt={-1}>
                            {tokens && elders && <Yield travelers={tokens} elders={elders} rarities={rarities} />}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Unstake;
