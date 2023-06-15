import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { map, head, includes, first, find, cloneDeep, remove, forEach } from 'lodash';
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

const REFRESH_TIME = 1800000; // 30 minutes

function App() {
    const toast = useToast();
    const navigate = useNavigate();

    const { pendingTxs, setPendingTxs, getGameState } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getOngoingQuests } = useQuestsContext() as QuestsContextType;
    const { getStakingInfo } = useStoreContext() as StoreContextType;

    const { getEnergy, getHerbs, getGems, getEssence, getTickets, onTicketModalOpen } =
        useResourcesContext() as ResourcesContextType;

    useEffect(() => {
        getGameState();

        const timer = setInterval(async () => {
            const isGamePaused = await getGameState();

            if (isGamePaused) {
                navigate('/unlock');
            }
        }, REFRESH_TIME);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        removeTxs(map(failedTransactionsArray, (tx) => head(tx)));
    }, [failedTransactionsArray]);

    useEffect(() => {
        if (hasSuccessfulTransactions) {
            const txs = removeTxs(map(successfulTransactionsArray, (tx) => head(tx)));

            forEach(txs, (tx) => {
                if (tx.resolution) {
                    applyTxResolution(tx);
                }

                switch (tx.type) {
                    case TransactionType.CompleteQuest:
                        const quest: Quest = getQuest(tx.questId);
                        const isMission = quest.type === 'final';

                        displayResourcesToast(`${isMission ? 'Mission' : 'Quest'} complete!`, quest.rewards, 'ticket');

                        if (isMission) {
                            onTicketModalOpen();
                        }

                        break;

                    case TransactionType.StartQuest:
                        playSound('start_quest');
                        break;

                    case TransactionType.Stake:
                        playSound('stake');
                        break;

                    case TransactionType.Unstake:
                        displayResourcesToast('Energy gained!', [{ resource: 'energy', value: tx.data.energyGain }], 'unstake');
                        break;

                    case TransactionType.Claim:
                        displayResourcesToast('Energy gained!', [{ resource: 'energy', value: tx.data.energyGain }], 'unstake');
                        break;

                    case TransactionType.JoinRaffle:
                        displayToast('Ticket/s sent!', 'Successfully joined the raffle', 'green.500');
                        break;

                    case TransactionType.Swap:
                        displayToast(
                            'Swapped ENERGY for EGLD!',
                            `You received ${tx.data.egldValue} in your wallet`,
                            'blue.500'
                        );
                        playSound('swap');

                        break;

                    default:
                        console.error('Unknown TransactionType');
                }
            });
        }
    }, [successfulTransactionsArray]);

    const removeTxs = (victimSessionIds: string[]): Transaction[] => {
        let victims: Transaction[] = [];

        const pendingSessionIds: string[] = map(pendingTxs, (tx) => tx.sessionId);
        const hasTxsToRemove = victimSessionIds.some((id) => includes(pendingSessionIds, id));

        if (hasTxsToRemove) {
            const txs = cloneDeep(pendingTxs);
            victims = remove(txs, (tx) => includes(victimSessionIds, tx.sessionId));

            setPendingTxs(txs);
        }

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

            case TxResolution.UpdateResources:
                const resources: string[] = tx.data.resources;
                getOngoingQuests();

                const calls = map(resources, (resource) => getResourceCall(resource));
                forEach(calls, (call) => call());
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

            default:
                console.error('getResourceCall(): Unknown resource type');
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
                marginTop: '2rem',
                marginRight: '2rem',
            },
            duration: 6000,
            render: () => <ResourcesToast title={title} rewards={gains}></ResourcesToast>,
        });
    };

    const displayToast = (title: string, text: string, color = 'redClrs') => {
        playSound('navigate');

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '2rem',
                marginRight: '2rem',
            },
            duration: 6000,
            render: () => (
                <CustomToast type="success" title={title} color={color}>
                    <Text mt={2}>{text}</Text>
                </CustomToast>
            ),
        });
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

                                {route.children?.map((child, index) => (
                                    <Route path={child.path} key={'child-route-key-' + index} element={<child.component />} />
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
