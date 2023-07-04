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
import { Address, U64Value } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, ELDERS_COLLECTION_ID, ELDERS_PADDING, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT, NFTType } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { getStakedNFTs } from '../../services/authentication';
import { getTravelersPadding, pairwise, toHexNumber } from '../../services/helpers';
import { smartContract } from '../../blockchain/smartContract';
import { Rarity, getRarityClasses } from '../../blockchain/api/getRarityClasses';
import Yield from '../../shared/Yield';

function Unstake() {
    const { height } = useStaking();
    const { address } = useGetAccountInfo();

    const { isOpen: isYieldOpen, onOpen: onYieldOpen, onClose: onYieldClose } = useDisclosure();

    const { stakingInfo, nonces } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);
    const [isClaimButtonLoading, setClaimButtonLoading] = useState(false);

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const [rarities, setRarities] = useState<Rarity[]>();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            type: NFTType;
        }>
    >([]);

    useEffect(() => {
        setSelectedTokens([]);
        getNFTs();
    }, [nonces]);

    useEffect(() => {
        if (!_.isEmpty(travelers)) {
            getRarities();
        }
    }, [travelers, elders]);

    const getRarities = async () => {
        setRarities(await getRarityClasses(_.map(travelers, (traveler) => traveler.nonce)));
    };

    const getNFTs = async () => {
        if (!nonces) {
            return;
        }

        setTravelers(undefined);
        setElders(undefined);

        const travelersCount = _.size(nonces?.travelers);
        const eldersCount = _.size(nonces?.elders);

        const travelerChunks = new Array(Math.floor(travelersCount / 25)).fill(25).concat(travelersCount % 25);
        const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const travelerIds = _.map(
            nonces?.travelers,
            (nonce) => `${TRAVELERS_COLLECTION_ID}-${toHexNumber(nonce, getTravelersPadding(nonce))}`
        );

        pairwise(
            _(travelerChunks)
                .filter(_.identity)
                .map((chunk, index) => {
                    return index * 25 + chunk;
                })
                .unshift(0)
                .value(),
            (from: number, to: number) => {
                const slice = travelerIds.slice(from, to);
                travelersApiCalls.push(getStakedNFTs(TRAVELERS_COLLECTION_ID, slice.join(',')));
            }
        );

        const travelers = _(await Promise.all(travelersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                type: NFTType.Traveler,
            }))
            .orderBy('nonce', 'asc')
            .value();

        const elderChunks = new Array(Math.floor(eldersCount / 25)).fill(25).concat(eldersCount % 25);
        const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const elderIds = _.map(nonces?.elders, (nonce) => `${ELDERS_COLLECTION_ID}-${toHexNumber(nonce, ELDERS_PADDING)}`);

        pairwise(
            _(elderChunks)
                .filter(_.identity)
                .map((chunk, index) => {
                    return index * 25 + chunk;
                })
                .unshift(0)
                .value(),
            (from: number, to: number) => {
                const slice = elderIds.slice(from, to);
                eldersApiCalls.push(getStakedNFTs(ELDERS_COLLECTION_ID, slice.join(',')));
            }
        );

        const elders = _(await Promise.all(eldersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                type: NFTType.Elder,
            }))
            .orderBy('nonce', 'asc')
            .value();

        setTravelers(travelers);
        setElders(elders);
    };

    const unstake = async () => {
        if (!stakingInfo) {
            return;
        }

        setUnstakeButtonLoading(true);

        const user = new Address(address);

        const travelerNonces = _(selectedTokens)
            .filter((token) => token.type === NFTType.Traveler)
            .map((token) => new U64Value(token.nonce))
            .value();

        const elderNonces = _(selectedTokens)
            .filter((token) => token.type === NFTType.Elder)
            .map((token) => new U64Value(token.nonce))
            .value();

        const count = travelerNonces.length + elderNonces.length;

        if (!count) {
            setUnstakeButtonLoading(false);
            return;
        }

        try {
            const tx = smartContract.methods
                .unstake([travelerNonces, elderNonces])
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(26000000 + 2000000 * count)
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
                    type: TransactionType.Unstake,
                    resolution: TxResolution.UpdateStakingAndNFTs,
                    data: count,
                },
            ]);

            setUnstakeButtonLoading(false);
        } catch (err) {
            console.error('Error occured ', err);
        }
    };

    const claim = async () => {
        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(26000000)
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
                    type: TransactionType.Claim,
                    resolution: TxResolution.UpdateStakingInfo,
                },
            ]);

            setClaimButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    const selectAll = async () => {
        if (!elders || !travelers) {
            return;
        }

        setSelectedTokens(
            _([...elders, ...travelers])
                .map((token) => ({
                    nonce: token.nonce,
                    type: token.type as NFTType,
                }))
                .value()
        );
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {elders && travelers ? (
                <>
                    <Flex pb={6} alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <ActionButton
                                disabled={
                                    !stakingInfo || isTxPending(TransactionType.Claim) || isTxPending(TransactionType.Stake)
                                }
                                isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.Unstake)}
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
                                        !stakingInfo ||
                                        isTxPending(TransactionType.Claim) ||
                                        isTxPending(TransactionType.Unstake) ||
                                        isTxPending(TransactionType.Stake)
                                    }
                                >
                                    <Text>Select all</Text>
                                </ActionButton>
                            </Box>

                            {stakingInfo?.isStaked && (
                                <Flex ml={4} alignItems="center">
                                    <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                    <Text color="almostWhite">Select some NFTs in order to unstake</Text>
                                </Flex>
                            )}
                        </Flex>

                        {stakingInfo?.isStaked && (
                            <Flex>
                                <ActionButton
                                    colorScheme="default"
                                    onClick={onYieldOpen}
                                    disabled={
                                        _.isEmpty(rarities) ||
                                        isTxPending(TransactionType.Claim) ||
                                        isTxPending(TransactionType.Unstake) ||
                                        isTxPending(TransactionType.Stake)
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
                                            !stakingInfo ||
                                            isTxPending(TransactionType.Stake) ||
                                            isTxPending(TransactionType.Unstake)
                                        }
                                        isLoading={isClaimButtonLoading || isTxPending(TransactionType.Claim)}
                                        colorScheme="blue"
                                        customStyle={{ width: '144px' }}
                                        onClick={claim}
                                    >
                                        <Text>Claim Energy</Text>
                                    </ActionButton>
                                </Box>
                            </Flex>
                        )}
                    </Flex>

                    {_.isEmpty(travelers) && _.isEmpty(elders) ? (
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
                                {_.map([...elders, ...travelers], (token, index) => (
                                    <Box
                                        key={index}
                                        cursor="pointer"
                                        onClick={() => {
                                            if (isUnstakeButtonLoading || isTxPending(TransactionType.Stake)) {
                                                return;
                                            }

                                            setSelectedTokens((tokens) => {
                                                if (
                                                    _.findIndex(
                                                        tokens,
                                                        (t) => t.nonce === token.nonce && t.type === token.type
                                                    ) === -1
                                                ) {
                                                    if (_.size(tokens) === 25) {
                                                        return tokens;
                                                    }

                                                    return [
                                                        ...tokens,
                                                        {
                                                            nonce: token.nonce,
                                                            type: token.type as NFTType,
                                                        },
                                                    ];
                                                } else {
                                                    return _.filter(
                                                        tokens,
                                                        (t) => !(t.nonce === token.nonce && t.type === token.type)
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        <TokenCard
                                            isSelected={
                                                _.findIndex(
                                                    selectedTokens,
                                                    (t) => t.nonce === token.nonce && t.type === token.type
                                                ) > -1
                                            }
                                            name={token.name}
                                            url={token.url}
                                            type={token?.type}
                                            rarity={
                                                token?.type === NFTType.Traveler &&
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
                            {travelers && elders && <Yield travelers={travelers} elders={elders} rarities={rarities} />}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Unstake;
