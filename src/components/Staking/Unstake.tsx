import _ from 'lodash';
import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { API_URL, CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT, NFTType } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { getStakedNFTs } from '../../services/authentication';
import { pairwise, toHexNumber } from '../../services/helpers';
import { StakingInfo } from '../../blockchain/hooks/useGetStakingInfo';
import { smartContract } from '../../blockchain/smartContract';

function Unstake() {
    const { height, checkEgldBalance, displayToast } = useStaking();
    const { address } = useGetAccountInfo();

    const { stakingInfo, getStakingInfo, nonces, getUserTokenNonces } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);
    const [isClaimButtonLoading, setClaimButtonLoading] = useState(false);

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            type: NFTType;
        }>
    >([]);

    useEffect(() => {}, []);

    useEffect(() => {
        console.log('[Unstake] nonces', nonces);

        setSelectedTokens([]);
        getNFTs();
    }, [nonces]);

    const getNFTs = async () => {
        if (!nonces || (_.isEmpty(nonces.travelers) && _.isEmpty(nonces.elders))) {
            return;
        }

        console.log('[Unstake] getNFTs', nonces.elders.length + nonces.travelers.length);

        const travelersCount = _.size(nonces?.travelers);
        const eldersCount = _.size(nonces?.elders);

        const travelerChunks = new Array(Math.floor(travelersCount / 25)).fill(25).concat(travelersCount % 25);
        const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

        // TODO: toHexNumber should force to 4 digits for travelers and 2 for elders
        const travelerIds = _.map(nonces?.travelers, (nonce) => `${TRAVELERS_COLLECTION_ID}-${toHexNumber(nonce, 2)}`);

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

        // TODO: Remove URL overwriting
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

        // TODO: toHexNumber should force to 4 digits for travelers and 2 for elders
        const elderIds = _.map(nonces?.elders, (nonce) => `${ELDERS_COLLECTION_ID}-${toHexNumber(nonce, 2)}`);

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

        // TODO: Remove URL overwriting
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

        if (!(await checkEgldBalance())) {
            setUnstakeButtonLoading(false);
            return;
        }

        setUnstakeButtonLoading(true);

        const updatedStakingInfo: StakingInfo | undefined = await getStakingInfo();
        const user = new Address(address);

        if (!updatedStakingInfo) {
            console.error('Unable to unstake');
            setUnstakeButtonLoading(false);
            return;
        }

        const energyGain = _.cloneDeep(updatedStakingInfo.rewards);

        try {
            const tx = smartContract.methods
                .unstake()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(8000000 + 1000000 * selectedTokens.length)
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
                    data: {
                        energyGain,
                    },
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

        if (!(await checkEgldBalance())) {
            setClaimButtonLoading(false);
            return;
        }

        setClaimButtonLoading(true);

        const updatedStakingInfo: StakingInfo | undefined = await getStakingInfo();
        const user = new Address(address);

        if (!updatedStakingInfo) {
            console.error('Unable to claim');
            setClaimButtonLoading(false);
            return;
        }

        const energyGain = _.cloneDeep(updatedStakingInfo.rewards);

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(6000000)
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
                    data: {
                        energyGain,
                    },
                },
            ]);

            setClaimButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {elders && travelers ? (
                <>
                    <Flex pb={6} alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <ActionButton
                                disabled={
                                    !stakingInfo || isTxPending(TransactionType.Claim) || isTxPending(TransactionType.Unstake)
                                }
                                isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.Stake)}
                                colorScheme="blue"
                                customStyle={{ width: '134px' }}
                                onClick={unstake}
                            >
                                <Text>Unstake</Text>
                            </ActionButton>

                            <Box ml={4}>
                                <ActionButton
                                    colorScheme="default"
                                    customStyle={{ width: '186px' }}
                                    onClick={() => console.log('select_all')}
                                >
                                    <Text>Select all (25 max.)</Text>
                                </ActionButton>
                            </Box>

                            <Flex ml={4} alignItems="center">
                                <InfoOutlineIcon mr={1.5} color="almostWhite" />
                                <Text color="almostWhite">Select some NFTs in order to unstake</Text>
                            </Flex>
                        </Flex>

                        {stakingInfo?.isStaked && (
                            <ActionButton
                                disabled={
                                    !stakingInfo || isTxPending(TransactionType.Stake) || isTxPending(TransactionType.Unstake)
                                }
                                isLoading={isClaimButtonLoading || isTxPending(TransactionType.Claim)}
                                colorScheme="blue"
                                customStyle={{ width: '154px' }}
                                onClick={claim}
                            >
                                <Text>Claim Energy</Text>
                            </ActionButton>
                        )}
                    </Flex>

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
                            gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 1fr"
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
                                                _.findIndex(tokens, (t) => t.nonce === token.nonce && t.type === token.type) ===
                                                -1
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
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Flex>
                </>
            ) : (
                <Flex alignItems="center" justifyContent="center" height="100%">
                    <Spinner size="md" />
                </Flex>
            )}
        </Flex>
    );
}

export default Unstake;
