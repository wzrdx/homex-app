import _ from 'lodash';
import { Box, Flex, Text, Image, Button, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTicketSFT } from '../../services/assets';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, ELDERS_COLLECTION_ID, TICKETS_TOKEN_ID, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { getNFTsCount, getWalletNonces } from '../../services/authentication';
import { getRandomInt, pairwise } from '../../services/helpers';
import { NFT, NFTType } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';

function Stake() {
    const { height, checkEgldBalance, displayToast } = useStaking();

    const { address } = useGetAccountInfo();

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            type: NFTType;
        }>
    >([]);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        console.log('[Stake] Received updated staking info');
        setSelectedTokens([]);
    }, [stakingInfo]);

    const init = async () => {
        try {
            const { data: travelersCount } = await getNFTsCount(address, TRAVELERS_COLLECTION_ID);
            const { data: elderscount } = await getNFTsCount(address, ELDERS_COLLECTION_ID);

            const travelerchunks = new Array(Math.floor(travelersCount / 25)).fill(25).concat(travelersCount % 25);
            const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(travelerchunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 25 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    travelersApiCalls.push(getWalletNonces(address, TRAVELERS_COLLECTION_ID, from));
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
                    url: `https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/${nft.nonce}.png`,
                }))
                .value();

            const elderchunks = new Array(Math.floor(elderscount / 25)).fill(25).concat(elderscount % 25);
            const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(elderchunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 25 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    eldersApiCalls.push(getWalletNonces(address, ELDERS_COLLECTION_ID, from));
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
                    url: `https://media.elrond.com/nfts/asset/QmWv6En64krZQnvEhL7sEDovcZsgkdLpEfC6UzaVdVHrrJ/${nft.nonce}.png`,
                }))
                .value();

            setTravelers(travelers);
            setElders(elders);

            console.log(travelers);
            console.log(elders);
        } catch (error) {
            console.error(error);
        }
    };

    const stake = async () => {
        if (!stakingInfo) {
            return;
        }

        if (!(await checkEgldBalance())) {
            setButtonLoading(false);
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const transfers: TokenTransfer[] = _(selectedTokens)
                .map((token) =>
                    TokenTransfer.nonFungible(
                        token.type === NFTType.Traveler ? TRAVELERS_COLLECTION_ID : ELDERS_COLLECTION_ID,
                        token.nonce
                    )
                )
                .value();

            if (_.isEmpty(transfers)) {
                displayToast(
                    'error',
                    'Nothing to stake',
                    'No NFT from the Home X collections is currently in your wallet',
                    'redClrs'
                );
                setButtonLoading(false);

                return;
            }

            const tx = smartContract.methods
                .stake()
                .withMultiESDTNFTTransfer(transfers)
                .withSender(user)
                .withExplicitReceiver(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(8000000 + 1100000 * _.size(transfers))
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
                    type: TransactionType.Stake,
                    resolution: TxResolution.UpdateStakingInfo,
                },
            ]);

            setButtonLoading(false);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {elders && travelers ? (
                <>
                    <Flex pb={6}>
                        <ActionButton
                            disabled={
                                _.isEmpty(selectedTokens) ||
                                !stakingInfo ||
                                isTxPending(TransactionType.Claim) ||
                                isTxPending(TransactionType.Unstake)
                            }
                            isLoading={isButtonLoading || isTxPending(TransactionType.Stake)}
                            colorScheme="red"
                            customStyle={{ width: '134px' }}
                            onClick={stake}
                        >
                            <Text>Stake</Text>
                        </ActionButton>

                        <Text>{_.map(selectedTokens, (i) => i.nonce).toString()}</Text>
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
                                    onClick={() =>
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
                                        })
                                    }
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

export default Stake;
