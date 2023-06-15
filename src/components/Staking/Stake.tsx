import _ from 'lodash';
import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFTType } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';

function Stake() {
    const { height, checkEgldBalance, displayToast } = useStaking();

    const { address } = useGetAccountInfo();

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const { travelers, elders, getWalletNFTs } = useResourcesContext() as ResourcesContextType;

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            type: NFTType;
        }>
    >([]);

    useEffect(() => {
        getWalletNFTs();
    }, []);

    const stake = async () => {
        if (!stakingInfo) {
            return;
        }

        if (!(await checkEgldBalance())) {
            setButtonLoading(false);
            return;
        }

        if (_.isEmpty(selectedTokens)) {
            displayToast('error', 'Nothing to stake', 'Please select some NFTs first', 'redClrs');

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
                    resolution: TxResolution.UpdateStakingAndNFTs,
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
                                !stakingInfo || isTxPending(TransactionType.Claim) || isTxPending(TransactionType.Unstake)
                            }
                            isLoading={isButtonLoading || isTxPending(TransactionType.Stake)}
                            colorScheme="red"
                            customStyle={{ width: '134px' }}
                            onClick={stake}
                        >
                            <Text>Stake</Text>
                        </ActionButton>
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
                                        if (isButtonLoading || isTxPending(TransactionType.Stake)) {
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

export default Stake;
