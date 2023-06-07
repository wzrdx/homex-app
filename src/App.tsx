import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider, useToast } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesContextType, useResourcesContext } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, filter, find, cloneDeep, remove, forEach } from 'lodash';
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
import { FAUCET_REWARD } from './components/Energy';

function App() {
    const toast = useToast();

    const { pendingTxs, setPendingTxs } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getOngoingQuests } = useQuestsContext() as QuestsContextType;

    const { getEnergy, getHerbs, getGems, getEssence, getTickets, onTicketModalOpen } =
        useResourcesContext() as ResourcesContextType;

    useEffect(() => {}, []);

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

                        displayResourcesToast(`${isMission ? 'Mission' : 'Quest'} complete!`, quest.rewards, isMission);

                        if (isMission) {
                            onTicketModalOpen();
                        }

                        break;

                    case TransactionType.StartQuest:
                        playSound('start_quest');
                        break;

                    case TransactionType.Faucet:
                        displayResourcesToast('Energy gained!', [FAUCET_REWARD]);
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

            // console.log('[App.tsx] removeTxs', victims);

            setPendingTxs(txs);
        }

        return victims;
    };

    const applyTxResolution = (tx: Transaction) => {
        // console.log('[App.tsx] applyTxResolution', tx);

        switch (tx.resolution) {
            case TxResolution.UpdateEnergy:
                getEnergy();
                break;

            case TxResolution.UpdateResources:
                const resources: string[] = tx.data.resources;
                getOngoingQuests();

                const calls = map(resources, (resource) => getResourceCall(resource));
                forEach(calls, (call) => call());
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
        isMission: boolean = false
    ) => {
        playSound(isMission ? 'ticket' : 'complete_quest');

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '2rem',
                marginRight: '2rem',
            },
            duration: 5000,
            render: () => <ResourcesToast title={title} rewards={gains}></ResourcesToast>,
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
                            <Route path={route.path} key={'route-key-' + index} element={<route.component />} />
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
