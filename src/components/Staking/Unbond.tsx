import _ from 'lodash';
import { Box, Flex, Text, Spinner, AlertIcon, Alert } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type, U64Value } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, ELDERS_COLLECTION_ID, ELDERS_PADDING, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { getContractNFTs } from '../../services/authentication';
import { getTravelersPadding, hasFinishedUnbonding, pairwise, toHexNumber } from '../../services/helpers';
import { smartContract } from '../../blockchain/smartContract';
import { Rarity, getRarityClasses } from '../../blockchain/api/getRarityClasses';
import { Stake } from '../../blockchain/hooks/useGetStakingInfo';
import { getUnixTime } from 'date-fns';

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
            (token) => token.tokenId === TRAVELERS_COLLECTION_ID && !!token.timestamp
        );

        const unbondedElders: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === ELDERS_COLLECTION_ID && !!token.timestamp
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
                travelersApiCalls.push(getContractNFTs(TRAVELERS_COLLECTION_ID, slice.join(',')));
            }
        );

        const travelers = _(await Promise.all(travelersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                timestamp: _.find(unbondedTravelers, (token) => token.nonce === nft.nonce)?.timestamp as Date,
                tokenId: TRAVELERS_COLLECTION_ID,
            }))
            .orderBy('nonce', 'asc')
            .value();

        const elderChunks = new Array(Math.floor(eldersCount / 25)).fill(25).concat(eldersCount % 25);
        const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        const elderIds = _.map(
            filteredNonces?.elders,
            (nonce) => `${ELDERS_COLLECTION_ID}-${toHexNumber(nonce, ELDERS_PADDING)}`
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
                eldersApiCalls.push(getContractNFTs(ELDERS_COLLECTION_ID, slice.join(',')));
            }
        );

        const elders = _(await Promise.all(eldersApiCalls))
            .flatten()
            .map((result) => result.data)
            .flatten()
            .map((nft) => ({
                ...nft,
                timestamp: _.find(unbondedElders, (token) => token.nonce === nft.nonce)?.timestamp as Date,
                tokenId: ELDERS_COLLECTION_ID,
            }))
            .orderBy('nonce', 'asc')
            .value();

        console.log(_.map(travelers, (traveler) => ({ ...traveler, unix: getUnixTime(traveler.timestamp) })));

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
                .withChainID(CHAIN_ID)
                .withGasLimit(8000000 + 250000 * stakedNFTsCount + 800000 * _.size(args))
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
                    resolution: TxResolution.UpdateStakingAndNFTs,
                    data: _.size(args),
                },
            ]);

            setRestakeButtonLoading(false);
        } catch (err) {
            console.error('Error occured ', err);
        }
    };

    const claim = async () => {
        if (!stakingInfo || !elders || !travelers) {
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
                .withChainID(CHAIN_ID)
                .withGasLimit(10000000 + 500000 * args.length + 750000 * stakedNFTsCount)
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
                            <ActionButton
                                disabled={!stakingInfo || isTxPending(TransactionType.Restake) || !areSelectedNFTsClaimable()}
                                isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimUnbondedNFTs)}
                                colorScheme="blue"
                                customStyle={{ width: '120px' }}
                                onClick={claim}
                            >
                                <Text>Claim</Text>
                            </ActionButton>

                            <Box ml={4}>
                                <ActionButton
                                    colorScheme="default"
                                    customStyle={{ width: '142px' }}
                                    onClick={selectAll}
                                    disabled={
                                        !stakingInfo ||
                                        isTxPending(TransactionType.ClaimUnbondedNFTs) ||
                                        isTxPending(TransactionType.Restake)
                                    }
                                >
                                    <Text>Select all</Text>
                                </ActionButton>
                            </Box>

                            {stakingInfo?.isStaked && (
                                <Flex ml={4} alignItems="center">
                                    <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                    <Text color="almostWhite">Select some NFTs in order to claim or restake them</Text>
                                </Flex>
                            )}
                        </Flex>

                        <ActionButton
                            disabled={!stakingInfo || isTxPending(TransactionType.ClaimUnbondedNFTs)}
                            isLoading={isRestakeButtonLoading || isTxPending(TransactionType.Restake)}
                            colorScheme="red"
                            customStyle={{ width: '120px' }}
                            onClick={restake}
                        >
                            <Text>Restake</Text>
                        </ActionButton>
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
                                            if (isRestakeButtonLoading || isTxPending(TransactionType.Stake)) {
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
        </Flex>
    );
}

export default Unbond;
