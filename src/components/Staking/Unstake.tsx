import { InfoOutlineIcon } from '@chakra-ui/icons';
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
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { formatDistance } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../../blockchain/config';
import { getRarityClasses } from '../../blockchain/game/api/getRarityClasses';
import { smartContract } from '../../blockchain/game/smartContract';
import { NFT, Rarity, Stake } from '../../blockchain/types';
import { getContractNFTs } from '../../services/authentication';
import { getTravelersPadding, getUnbondingDuration, pairwise, toHexNumber } from '../../services/helpers';
import { StoreContextType, useStoreContext } from '../../services/store';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import EnergyYield from '../../shared/EnergyYield';
import TokenCard from '../../shared/TokenCard';
import { useStaking } from '../Staking';

function Unstake() {
    const { height } = useStaking();
    const { address } = useGetAccountInfo();

    const { isOpen: isYieldOpen, onOpen: onYieldOpen, onClose: onYieldClose } = useDisclosure();

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);
    const [isClaimButtonLoading, setClaimButtonLoading] = useState(false);

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const [rarities, setRarities] = useState<Rarity[]>();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            tokenId: string;
        }>
    >([]);

    useEffect(() => {
        setSelectedTokens([]);
        getNFTs();
    }, [stakingInfo]);

    useEffect(() => {
        if (!_.isEmpty(travelers)) {
            getRarities();
        }
    }, [travelers, elders]);

    const getRarities = async () => {
        setRarities(await getRarityClasses(_.map(travelers, (traveler) => traveler.nonce)));
    };

    const getNFTs = async () => {
        if (!stakingInfo) {
            return;
        }

        const stakedTravelers: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === config.travelersCollectionId && !token.timestamp
        );

        const stakedElders: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === config.eldersCollectionId && !token.timestamp
        );

        const filteredNonces = {
            travelers: _.map(stakedTravelers, (token) => token.nonce),
            elders: _.map(stakedElders, (token) => token.nonce),
        };

        setTravelers(undefined);
        setElders(undefined);

        const travelersCount = _.size(filteredNonces?.travelers);
        const eldersCount = _.size(filteredNonces?.elders);

        const travelerChunks = new Array(Math.floor(travelersCount / 25)).fill(25).concat(travelersCount % 25);
        const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const travelerIds = _.map(
            filteredNonces?.travelers,
            (nonce) => `${config.travelersCollectionId}-${toHexNumber(nonce, getTravelersPadding(nonce))}`
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
                travelersApiCalls.push(getContractNFTs(config.travelersCollectionId, slice.join(',')));
            }
        );

        const travelers = _(await Promise.all(travelersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                timestamp: _.find(stakedTravelers, (token) => token.nonce === nft.nonce)?.timestamp as Date,
                tokenId: config.travelersCollectionId,
            }))
            .orderBy('nonce', 'asc')
            .value();

        const elderChunks = new Array(Math.floor(eldersCount / 25)).fill(25).concat(eldersCount % 25);
        const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const elderIds = _.map(
            filteredNonces?.elders,
            (nonce) => `${config.eldersCollectionId}-${toHexNumber(nonce, config.eldersPadding)}`
        );

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
                eldersApiCalls.push(getContractNFTs(config.eldersCollectionId, slice.join(',')));
            }
        );

        const elders = _(await Promise.all(eldersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                timestamp: _.find(stakedElders, (token) => token.nonce === nft.nonce)?.timestamp as Date,
                tokenId: config.eldersCollectionId,
            }))
            .orderBy('nonce', 'asc')
            .value();

        setTravelers(travelers);
        setElders(elders);
    };

    const unstake = async () => {
        if (!stakingInfo || !elders || !travelers) {
            return;
        }

        setUnstakeButtonLoading(true);

        const user = new Address(address);

        const args = _(stakingInfo.tokens)
            .filter((token) => _.findIndex(selectedTokens, (t) => t.nonce === token.nonce && t.tokenId === token.tokenId) > -1)
            .map((token) => ({
                token_id: new TokenIdentifierValue(token.tokenId),
                nonce: new U16Value(token.nonce),
                amount: new U16Value(token.amount),
                timestamp: new OptionValue(new OptionType(new U64Type()), null),
            }))
            .value();

        const stakedNFTsCount = _.size([...elders, ...travelers]);

        if (_.isEmpty(args)) {
            setUnstakeButtonLoading(false);
            return;
        }

        try {
            const tx = smartContract.methods
                .unstake([args])
                .withSender(user)
                .withChainID(config.chainId)
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
        if (!stakingInfo || !elders || !travelers) {
            return;
        }

        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        const stakedNFTsCount = _.size([...elders, ...travelers]);

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(config.chainId)
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
        if (!elders || !travelers) {
            return;
        }

        setSelectedTokens(
            _([...elders, ...travelers])
                .map((token) => ({
                    nonce: token.nonce,
                    tokenId: token.tokenId,
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
                            <Button
                                isDisabled={
                                    !stakingInfo ||
                                    isTxPending(TransactionType.ClaimEnergy) ||
                                    isTxPending(TransactionType.StakeMain)
                                }
                                isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.UnstakeMain)}
                                colorScheme="red"
                                onClick={unstake}
                            >
                                <Text>Unstake</Text>
                            </Button>

                            <Box ml={4}>
                                <Button
                                    colorScheme="orange"
                                    onClick={selectAll}
                                    isDisabled={
                                        !stakingInfo ||
                                        isTxPending(TransactionType.ClaimEnergy) ||
                                        isTxPending(TransactionType.UnstakeMain) ||
                                        isTxPending(TransactionType.StakeMain)
                                    }
                                >
                                    <Text>Select all</Text>
                                </Button>
                            </Box>

                            {stakingInfo?.isStaked && (
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

                        {stakingInfo?.isStaked && (
                            <Flex>
                                <Button
                                    colorScheme="orange"
                                    onClick={onYieldOpen}
                                    isDisabled={
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
                                </Button>

                                <Box ml={4}>
                                    <Button
                                        isDisabled={
                                            !stakingInfo ||
                                            isTxPending(TransactionType.StakeMain) ||
                                            isTxPending(TransactionType.UnstakeMain)
                                        }
                                        isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimEnergy)}
                                        colorScheme="blue"
                                        onClick={claimStakingRewards}
                                    >
                                        <Text>Claim Energy</Text>
                                    </Button>
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
                            height="100%"
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
                                                token?.tokenId === config.travelersCollectionId &&
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
                            {travelers && elders && <EnergyYield travelers={travelers} elders={elders} rarities={rarities} />}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Unstake;
