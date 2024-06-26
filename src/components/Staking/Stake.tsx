import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../../blockchain/config';
import { getRarityClasses } from '../../blockchain/game/api/getRarityClasses';
import { smartContract } from '../../blockchain/game/smartContract';
import { NFT, Rarity } from '../../blockchain/types';
import { StoreContextType, useStoreContext } from '../../services/store';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import TokenCard from '../../shared/TokenCard';
import { useStaking } from '../Staking';

function Stake() {
    const { height, displayToast } = useStaking();

    const { address } = useGetAccountInfo();

    const { stakingInfo, travelers, elders, getWalletMainNFTs } = useStoreContext() as StoreContextType;
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
        getWalletMainNFTs();
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
                .withChainID(config.chainId)
                .withGasLimit(90000000 + 750000 * stakedNFTsCount + 2150000 * _.size(transfers))
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
                    type: TransactionType.StakeMain,
                    resolution: TxResolution.UpdateMainStakingAndNFTs,
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
                    <Button
                        disabled={
                            !stakingInfo || isTxPending(TransactionType.ClaimEnergy) || isTxPending(TransactionType.UnstakeMain)
                        }
                        isLoading={isButtonLoading || isTxPending(TransactionType.StakeMain)}
                        colorScheme="red"
                        onClick={stake}
                    >
                        <Text>Stake</Text>
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
                            <Text>Select all (25 max.)</Text>
                        </Button>
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
                            height="100%"
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
                                            if (isButtonLoading || isTxPending(TransactionType.StakeMain)) {
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
            )}
        </Flex>
    );
}

export default Stake;
