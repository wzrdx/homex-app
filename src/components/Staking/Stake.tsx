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
import { pairwise } from '../../services/helpers';
import { NFT } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';

function Stake() {
    const { height, checkEgldBalance, displayToast } = useStaking();

    const { address } = useGetAccountInfo();

    const { stakingInfo, getStakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isStakingButtonLoading, setStakingButtonLoading] = useState(false);

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    useEffect(() => {
        init();
    }, []);

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

            const travelers = _(await Promise.all(travelersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
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

            const elders = _(await Promise.all(eldersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
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
            setStakingButtonLoading(false);
            return;
        }

        setStakingButtonLoading(true);

        const user = new Address(address);

        try {
            const { data: travelerTokens } = await getWalletNonces(address, TRAVELERS_COLLECTION_ID);
            const { data: elderTokens } = await getWalletNonces(address, ELDERS_COLLECTION_ID);

            const transfers: TokenTransfer[] = [
                ..._(travelerTokens)
                    .map((token) => TokenTransfer.nonFungible(TRAVELERS_COLLECTION_ID, token.nonce))
                    .value(),
                ..._(elderTokens)
                    .map((token) => TokenTransfer.nonFungible(ELDERS_COLLECTION_ID, token.nonce))
                    .value(),
            ];

            if (_.isEmpty(transfers)) {
                displayToast(
                    'error',
                    'Nothing to stake',
                    'No NFT from the Home X collections is currently in your wallet',
                    'redClrs'
                );
                setStakingButtonLoading(false);

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

            setStakingButtonLoading(false);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    return (
        <Flex justifyContent="center" height={`calc(100% - ${height}px)`}>
            <Flex
                className="Scrollbar-Gutter"
                flexDir="column"
                alignItems="center"
                overflowY="auto"
                pr={4}
                mr="calc(-1rem - 6px)"
            >
                {elders && travelers ? (
                    <Box
                        display="grid"
                        gridAutoColumns="1fr"
                        gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 1fr"
                        rowGap={4}
                        columnGap={4}
                    >
                        {_.map([...elders, ...travelers], (token, index) => (
                            <TokenCard key={index} name={token.name} url={token.url} nonce={token.nonce} />
                        ))}
                    </Box>
                ) : (
                    <Spinner />
                )}

                {/* <Button colorScheme="red" onClick={stake}>
                    Stake
                </Button> */}
            </Flex>
        </Flex>
    );
}

export default Stake;
