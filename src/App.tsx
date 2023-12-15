import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider, useToast, Text } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesContextType, useResourcesContext } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, find, cloneDeep, remove, forEach, isEmpty, size } from 'lodash';
import { useEffect } from 'react';
import {
    useTransactionsContext,
    TransactionsContextType,
    TransactionType,
    Transaction,
    TxResolution,
} from './services/transactions';
import { useSoundsContext, SoundsContextType } from './services/sounds';
import ResourcesToast from './shared/ResourcesToast';
import { QuestsContextType, getQuest, useQuestsContext } from './services/quests';
import { Quest } from './types';
import { CustomToast } from './shared/CustomToast';
import { useStoreContext, StoreContextType } from './services/store';
import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';
import { getTx } from './services/helpers';
import { ENERGY_TOKEN_ID, TOKEN_DENOMINATION } from './blockchain/config';
import { useRewardsContext, RewardsContextType } from './services/rewards';

function App() {
    const toast = useToast();

    const { pendingTxs, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getOngoingQuests, onQuestsModalClose } = useQuestsContext() as QuestsContextType;
    const { getStakingInfo, getWalletNFTs } = useStoreContext() as StoreContextType;

    const { getEnergy, getHerbs, getGems, getEssence, getTickets, onTicketModalOpen } =
        useResourcesContext() as ResourcesContextType;

    const { getRaffles, getBattles, getTicketsAmount } = useRewardsContext() as RewardsContextType;

    // Init
    useEffect(() => {
        window.localStorage['chakra-ui-color-mode'] = 'dark';
    }, []);

    useEffect(() => {
        if (isGamePaused) {
            displayPauseToast();
        }
    }, [isGamePaused]);

    useEffect(() => {
        removeTxs(failedTransactionsArray);
    }, [failedTransactionsArray]);

    useEffect(() => {
        if (hasSuccessfulTransactions) {
            const txs: Transaction[] = removeTxs(successfulTransactionsArray);

            forEach(txs, async (tx) => {
                if (tx.resolution) {
                    applyTxResolution(tx);
                }

                switch (tx.type) {
                    case TransactionType.CompleteQuest:
                        const quest: Quest = getQuest(tx.questId);
                        const isMission = quest.type === 'final';

                        displayResourcesToast(`${isMission ? 'Mission' : 'Quest'} complete`, quest.rewards, 'ticket');

                        if (isMission) {
                            onTicketModalOpen();
                        }

                        break;

                    case TransactionType.CompleteAllQuests:
                        displayResourcesToast('Quests complete', tx.data.gains, 'ticket');

                        displayToast(
                            'Success',
                            `Successfully completed ${
                                size(tx.data.completedQuestsIds) > 1 ? size(tx.data.completedQuestsIds) : 'one'
                            } quest${size(tx.data.completedQuestsIds) > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        break;

                    case TransactionType.StartQuest:
                        playSound('start_quest');
                        break;

                    case TransactionType.StartMultipleQuests:
                        displayToast(
                            'Success',
                            `Successfully started ${size(tx.data.questIds) > 1 ? size(tx.data.questIds) : 'one'} quest${
                                size(tx.data.questIds) > 1 ? 's' : ''
                            }`,
                            'green.500',
                            'start_quest'
                        );
                        break;

                    case TransactionType.Stake:
                        displayToast(
                            'Staking succesful',
                            `Successfully staked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500',
                            'stake'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.Unstake:
                        displayToast(
                            'Unstaking succesful',
                            `Successfully unstaked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.ClaimUnbondedNFTs:
                        displayToast(
                            'Claiming succesful',
                            `Successfully claimed ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        break;

                    case TransactionType.Restake:
                        displayToast(
                            'Restaking succesful',
                            `Successfully restaked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.ClaimEnergy:
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.JoinRaffle:
                        displayToast('Tickets sent', 'Successfully joined the raffle', 'green.500');
                        break;

                    case TransactionType.JoinBattle:
                        displayToast('Tickets sent', 'Successfully joined the battle', 'green.500');
                        break;

                    case TransactionType.ClaimReward:
                        displayResourcesToast(
                            'Successfully claimed reward',
                            [{ resource: 'tickets', value: tx.data.ticketsAmount }],
                            'ticket'
                        );
                        break;

                    case TransactionType.MintArtDrop:
                        displayResourcesToast('Experience', [{ resource: 'xp', value: tx.data.xp }], 'ticket');
                        displayToast(
                            'Mint successful',
                            `Successfully minted ${tx.data.amount > 1 ? tx.data.amount : 'one'} art piece${
                                tx.data.amount > 1 ? 's' : ''
                            }`,
                            'green.500'
                        );
                        break;

                    default:
                        console.error('Unknown TransactionType');
                }
            });
        }
    }, [successfulTransactionsArray]);

    const removeTxs = (transactions: [string, SignedTransactionsBodyType][]): Transaction[] => {
        let victims: Transaction[] = [];

        const victimSessionIds: string[] = map(transactions, (tx) => tx[0]);
        const pendingSessionIds: string[] = map(pendingTxs, (tx) => tx.sessionId);
        const hasTxsToRemove = victimSessionIds.some((id) => includes(pendingSessionIds, id));

        if (hasTxsToRemove) {
            const txs = cloneDeep(pendingTxs);
            victims = remove(txs, (tx) => includes(victimSessionIds, tx.sessionId));

            setPendingTxs(txs);
        }

        victims = map(victims, (victimTx) => {
            let hash: string | undefined;

            const tx = find(transactions, (tx) => tx[0] === victimTx.sessionId);

            if (tx && !isEmpty(tx[1].transactions)) {
                hash = head(tx[1].transactions)?.hash;
            }

            return { ...victimTx, hash };
        });

        return victims;
    };

    const applyTxResolution = (tx: Transaction) => {
        switch (tx.resolution) {
            case TxResolution.UpdateEnergy:
                getEnergy();
                break;

            case TxResolution.UpdateTickets:
                getTickets();
                break;

            case TxResolution.UpdateTicketsAndRewards:
                getTickets();
                getTicketsAmount();
                break;

            case TxResolution.UpdateTicketsAndRaffles:
                getTickets();
                getRaffles();
                break;

            case TxResolution.UpdateTicketsAndBattles:
                getTickets();
                getBattles();
                break;

            case TxResolution.UpdateQuestsAndResources:
                const resources: string[] = tx.data.resources;
                getOngoingQuests();
                onQuestsModalClose();

                const calls = map(resources, (resource) => getResourceCall(resource));
                forEach(calls, (call) => call());
                break;

            case TxResolution.UpdateStakingAndNFTs:
                getWalletNFTs();
                getEnergy();
                getStakingInfo();
                break;

            case TxResolution.UpdateStakingInfo:
                getEnergy();
                getStakingInfo();
                break;

            default:
                console.error('Unknown TxResolution');
        }
    };

    const getResourceCall = (resource: string): (() => Promise<void>) => {
        switch (resource) {
            case 'energy':
                return getEnergy;

            case 'herbs':
                return getHerbs;

            case 'gems':
                return getGems;

            case 'essence':
                return getEssence;

            case 'tickets':
                return getTickets;

            case 'xp':
                return async () => {};

            default:
                console.error('getResourceCall(): Unknown resource type', resource);
                return async () => {};
        }
    };

    const displayResourcesToast = (
        title: string,
        gains: {
            resource: string;
            value: number;
        }[],
        sound = 'complete_quest'
    ) => {
        playSound(sound);

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '1rem',
                marginRight: '2rem',
            },
            duration: 6000,
            render: () => <ResourcesToast title={title} rewards={gains}></ResourcesToast>,
        });
    };

    const displayToast = (title: string, text: string, color = 'redClrs', sound = 'navigate') => {
        playSound(sound);

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '1rem',
                marginRight: '2rem',
            },
            duration: 6000,
            render: () => (
                <CustomToast type="success" title={title} color={color}>
                    {text && <Text mt={2}>{text}</Text>}
                </CustomToast>
            ),
        });
    };

    const displayPauseToast = () => {
        toast({
            position: 'bottom-left',
            containerStyle: {
                margin: '3rem',
            },
            duration: 1000000,
            render: () => (
                <CustomToast type={'time'} title={'The game is temporarily paused'} color={'whitesmoke'}></CustomToast>
            ),
        });
    };

    const displayEnergyGain = async (txHash: string | undefined) => {
        if (txHash) {
            const result = await getTx(txHash);

            if (result.data) {
                const operation = find(
                    result.data.operations,
                    (op) => op.action === 'transfer' && op.identifier === ENERGY_TOKEN_ID
                );

                if (!operation) {
                    return;
                }

                const gain: number = operation.value / TOKEN_DENOMINATION;

                if (!gain || Number.isNaN(gain) || gain === 0) {
                    return;
                }

                displayResourcesToast('Energy gained', [{ resource: 'energy', value: gain }], 'unstake');
            }
        }
    };

    return (
        <ChakraBaseProvider theme={theme}>
            <TransactionsToastList successfulToastLifetime={5000} transactionToastClassName="Tx-Toast" />
            <NotificationModal />
            <SignTransactionsModals className="Sign-Tx-Modal" />

            <AuthenticationProvider>
                <Routes>
                    {/* Authentication */}
                    <Route path={routeNames.unlock} element={<Unlock />} />

                    {/* Main routing */}
                    <Route
                        path={routeNames.main}
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Navigate to={routeNames.quests} replace />} />

                        {routes.map((route, index) => (
                            <Route path={route.path} key={'route-key-' + index} element={<route.component />}>
                                {route.children && (
                                    <Route
                                        path={'/' + route.path}
                                        element={<Navigate to={route.defaultChildRoute as string} replace />}
                                    />
                                )}

                                {route.children?.map((childRoute, index) => (
                                    <Route
                                        path={childRoute.path}
                                        key={'child-route-key-' + index}
                                        element={<childRoute.component />}
                                    />
                                ))}
                            </Route>
                        ))}

                        <Route path="*" element={<Navigate to={routeNames.quests} replace />} />
                    </Route>

                    <Route path="*" element={<Navigate to={routeNames.main} replace />} />
                </Routes>
            </AuthenticationProvider>
        </ChakraBaseProvider>
    );
}

export default App;
