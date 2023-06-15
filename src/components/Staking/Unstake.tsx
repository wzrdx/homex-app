import _ from 'lodash';
import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { API_URL, CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID, contractAddress } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT, NFTType } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useGetUserTokenNonces } from '../../blockchain/hooks/useGetUserTokenNonces';
import axios from 'axios';

function Unstake() {
    const { height, checkEgldBalance, displayToast } = useStaking();
    const { address } = useGetAccountInfo();

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isUnstakeButtonLoading, setUnstakeButtonLoading] = useState(false);
    const [nfts, setNfts] = useState<Array<NFT>>();

    const { nonces, getUserTokenNonces } = useGetUserTokenNonces();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            type: NFTType;
        }>
    >([]);

    useEffect(() => {
        getUserTokenNonces();
        searchNonces();
    }, []);

    const searchNonces = async () => {
        // TODO: Perform paginated calls based on the number of nonces
        const result = await axios.get(`accounts/${contractAddress}/nfts`, {
            baseURL: API_URL,
            params: {
                identifiers: [`${TRAVELERS_COLLECTION_ID}-32`].join(','),
                collections: TRAVELERS_COLLECTION_ID,
                fields: 'name',
            },
        });

        console.log(result);
    };

    useEffect(() => {
        console.log('nonces', nonces);
        setSelectedTokens([]);
    }, [nonces]);

    const unstake = async () => {};

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            {nonces ? (
                <>
                    <Flex pb={6} alignItems="center">
                        <ActionButton
                            disabled={
                                !stakingInfo || isTxPending(TransactionType.Claim) || isTxPending(TransactionType.Unstake)
                            }
                            isLoading={isUnstakeButtonLoading || isTxPending(TransactionType.Stake)}
                            colorScheme="red"
                            customStyle={{ width: '134px' }}
                            onClick={unstake}
                        >
                            <Text>Unstake</Text>
                        </ActionButton>

                        <Box ml={4}>
                            <ActionButton
                                colorScheme="red"
                                customStyle={{ width: '178px ' }}
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
                            {_.map(nfts, (token, index) => (
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
