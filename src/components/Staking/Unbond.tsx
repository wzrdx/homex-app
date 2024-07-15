import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type, U64Value } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { getUnixTime } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../../blockchain/config';
import { getRarityClasses } from '../../blockchain/game/api/getRarityClasses';
import { smartContract } from '../../blockchain/game/smartContract';
import { NFT, Rarity, Stake } from '../../blockchain/types';
import { getContractNFTs } from '../../services/authentication';
import { getTravelersPadding, hasFinishedUnbonding, pairwise, toHexNumber } from '../../services/helpers';
import { StoreContextType, useStoreContext } from '../../services/store';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import TokenCard from '../../shared/TokenCard';
import { useStaking } from '../Staking';

function Unbond() {
    const { height } = useStaking();
    const { address } = useGetAccountInfo();

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isRestakeButtonLoading, setRestakeButtonLoading] = useState(false);
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

        const unbondedTravelers: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === config.travelersCollectionId && !!token.timestamp
        );

        const unbondedElders: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === config.eldersCollectionId && !!token.timestamp
        );

        const filteredNonces = {
            travelers: _.map(unbondedTravelers, (token) => token.nonce),
            elders: _.map(unbondedElders, (token) => token.nonce),
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
                timestamp: _.find(unbondedTravelers, (token) => token.nonce === nft.nonce)?.timestamp as Date,
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
                timestamp: _.find(unbondedElders, (token) => token.nonce === nft.nonce)?.timestamp as Date,
                tokenId: config.eldersCollectionId,
            }))
            .orderBy('nonce', 'asc')
            .value();

        // console.log(_.map(travelers, (traveler) => ({ ...traveler, unix: getUnixTime(traveler.timestamp) })));

        setTravelers(travelers);
        setElders(elders);
    };

    const restake = async () => {
        if (!stakingInfo || !elders || !travelers) {
            return;
        }

        setRestakeButtonLoading(true);

        const user = new Address(address);

        const args = _(stakingInfo.tokens)
            .filter((token) => _.findIndex(selectedTokens, (t) => t.nonce === token.nonce && t.tokenId === token.tokenId) > -1)
            .map((token) => ({
                token_id: new TokenIdentifierValue(token.tokenId),
                nonce: new U16Value(token.nonce),
                amount: new U16Value(token.amount),
                timestamp: new OptionValue(new OptionType(new U64Type()), new U64Value(getUnixTime(token.timestamp as Date))),
            }))
            .value();

        const stakedNFTsCount = _.size([...elders, ...travelers]);

        if (_.isEmpty(args)) {
            setRestakeButtonLoading(false);
            return;
        }

        try {
            const tx = smartContract.methods
                .restake([args])
                .withSender(user)
                .withChainID(config.chainId)
                .withGasLimit(28000000 + 450000 * stakedNFTsCount + 2000000 * _.size(args))
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
                    type: TransactionType.Restake,
                    resolution: TxResolution.UpdateMainStakingAndNFTs,
                    data: _.size(args),
                },
            ]);

            setRestakeButtonLoading(false);
        } catch (err) {
            console.error('Error occured ', err);
        }
    };

    const claim = async () => {
        if (_.isEmpty(selectedTokens) || !stakingInfo || !elders || !travelers) {
            return;
        }

        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        const args = _(stakingInfo.tokens)
            .filter((token) => _.findIndex(selectedTokens, (t) => t.nonce === token.nonce && t.tokenId === token.tokenId) > -1)
            .map((token) => ({
                token_id: new TokenIdentifierValue(token.tokenId),
                nonce: new U16Value(token.nonce),
                amount: new U16Value(token.amount),
                timestamp: new OptionValue(new OptionType(new U64Type()), new U64Value(getUnixTime(token.timestamp as Date))),
            }))
            .value();

        const stakedNFTsCount = _.size([...elders, ...travelers]);

        try {
            const tx = smartContract.methods
                .claim([args])
                .withSender(user)
                .withChainID(config.chainId)
                .withGasLimit(8000000 + 500000 * stakedNFTsCount + 1000000 * args.length)
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
                    type: TransactionType.ClaimUnbondedNFTs,
                    resolution: TxResolution.UpdateStakingInfo,
                    data: _.size(args),
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

    const areSelectedNFTsClaimable = (): boolean => {
        if (!elders || !travelers) {
            return false;
        }

        const unbondingStates = _([...elders, ...travelers])
            .filter((token) => _.findIndex(selectedTokens, (t) => t.nonce === token.nonce && t.tokenId === token.tokenId) > -1)
            .map((token) => hasFinishedUnbonding(token))
            .value();

        return unbondingStates.every((token) => !!token);
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {elders && travelers ? (
                <>
                    <Flex pb={6} alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <Button
                                isDisabled={!stakingInfo || isTxPending(TransactionType.Restake) || !areSelectedNFTsClaimable()}
                                isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimUnbondedNFTs)}
                                colorScheme="red"
                                onClick={claim}
                            >
                                <Text>Claim</Text>
                            </Button>

                            <Box ml={4}>
                                <Button
                                    colorScheme="orange"
                                    onClick={selectAll}
                                    isDisabled={
                                        !stakingInfo ||
                                        isTxPending(TransactionType.ClaimUnbondedNFTs) ||
                                        isTxPending(TransactionType.Restake)
                                    }
                                >
                                    <Text>Select all</Text>
                                </Button>
                            </Box>

                            {stakingInfo?.isStaked && (
                                <Flex ml={4} alignItems="center">
                                    <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                    <Text color="almostWhite">Select some NFTs in order to claim or restake them</Text>
                                </Flex>
                            )}
                        </Flex>

                        <Button
                            isDisabled={!stakingInfo || isTxPending(TransactionType.ClaimUnbondedNFTs)}
                            isLoading={isRestakeButtonLoading || isTxPending(TransactionType.Restake)}
                            colorScheme="blue"
                            onClick={restake}
                        >
                            <Text>Restake</Text>
                        </Button>
                    </Flex>

                    {_.isEmpty(travelers) && _.isEmpty(elders) ? (
                        <Flex py={4}>
                            <Flex backgroundColor="#000000e3">
                                <Alert status="info">
                                    <AlertIcon />
                                    You have no unstaked NFTs to display
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
                                            if (isRestakeButtonLoading || isTxPending(TransactionType.StakeMain)) {
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
        </Flex>
    );
}

export default Unbond;
