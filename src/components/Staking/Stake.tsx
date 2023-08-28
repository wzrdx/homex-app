import _ from 'lodash';
import { Box, Flex, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID, isStakingDisabled } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useStaking } from '../Staking';
import { NFT } from '../../blockchain/types';
import TokenCard from '../../shared/TokenCard';
import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Rarity, getRarityClasses } from '../../blockchain/api/getRarityClasses';

function Stake() {
    const { height, displayToast } = useStaking();

    const { address } = useGetAccountInfo();

    const { stakingInfo, travelers, elders, getWalletNFTs } = useStoreContext() as StoreContextType;
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const [rarities, setRarities] = useState<Rarity[]>();

    const [selectedTokens, setSelectedTokens] = useState<
        Array<{
            nonce: number;
            tokenId: string;
        }>
    >([]);

    useEffect(() => {
        getWalletNFTs();
    }, []);

    useEffect(() => {
        setSelectedTokens([]);

        if (!_.isEmpty(travelers)) {
            getRarities();
        }
    }, [travelers, elders]);

    const getRarities = async () => {
        setRarities(await getRarityClasses(_.map(travelers, (traveler) => traveler.nonce)));
    };

    const stake = async () => {
        if (!stakingInfo) {
            return;
        }

        if (_.isEmpty(selectedTokens)) {
            displayToast('error', 'Nothing to stake', 'Please select some NFTs first', 'redClrs');

            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        const stakedNFTsCount = _.size(stakingInfo.tokens);

        try {
            const transfers: TokenTransfer[] = _(selectedTokens)
                .map((token) => TokenTransfer.nonFungible(token.tokenId, token.nonce))
                .value();

            const tx = smartContract.methods
                .stake()
                .withMultiESDTNFTTransfer(transfers)
                .withSender(user)
                .withExplicitReceiver(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(6500000 + 125000 * stakedNFTsCount + 1500000 * _.size(transfers))
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
                    data: _.size(transfers),
                },
            ]);

            setButtonLoading(false);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    const selectAll = async () => {
        if (!elders || !travelers) {
            return;
        }

        setSelectedTokens(
            _([...elders, ...travelers])
                .take(25)
                .map((token) => ({
                    nonce: token.nonce,
                    tokenId: token.tokenId,
                }))
                .value()
        );
    };

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            <Flex pb={6} alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <ActionButton
                        disabled={
                            isStakingDisabled ||
                            !stakingInfo ||
                            isTxPending(TransactionType.ClaimEnergy) ||
                            isTxPending(TransactionType.Unstake)
                        }
                        isLoading={isButtonLoading || isTxPending(TransactionType.Stake)}
                        colorScheme="red"
                        customStyle={{ width: '120px' }}
                        onClick={stake}
                    >
                        <Text>Stake</Text>
                    </ActionButton>

                    <Box ml={4}>
                        <ActionButton
                            colorScheme="default"
                            customStyle={{ width: '192px' }}
                            onClick={selectAll}
                            disabled={
                                !stakingInfo ||
                                isTxPending(TransactionType.ClaimEnergy) ||
                                isTxPending(TransactionType.Unstake) ||
                                isTxPending(TransactionType.Stake)
                            }
                        >
                            <Text>Select all (25 max.)</Text>
                        </ActionButton>
                    </Box>

                    <Flex ml={4} alignItems="center">
                        <InfoOutlineIcon mr={1.5} color="almostWhite" />
                        <Text color="almostWhite">Select some NFTs in order to stake</Text>
                    </Flex>
                </Flex>

                <Flex ml={4} alignItems="center">
                    <InfoIcon mr={1.5} color="brightWheat" />
                    <Text color="brightWheat">Staking will automatically claim your rewards</Text>
                </Flex>
            </Flex>

            {!(elders && travelers) ? (
                <Flex alignItems="center" justifyContent="center" height="100%">
                    <Spinner size="md" />
                </Flex>
            ) : (
                <>
                    {_.isEmpty(elders) && _.isEmpty(travelers) ? (
                        <Flex py={4}>
                            <Flex backgroundColor="#000000e3">
                                <Alert status="info">
                                    <AlertIcon />
                                    You have no NFTs available for staking. View your staked NFT in the 'Staked' tab.
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
                                {_.map([...(elders as NFT[]), ...(travelers as NFT[])], (token, index) => (
                                    <Box
                                        key={index}
                                        cursor="pointer"
                                        onClick={() => {
                                            if (isButtonLoading || isTxPending(TransactionType.Stake)) {
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
            )}
        </Flex>
    );
}

export default Stake;
