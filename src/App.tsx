import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider, useToast } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesProvider } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, filter } from 'lodash';
import { useEffect } from 'react';
import { useTransactionsContext, TransactionsContextType, TransactionType, Transaction } from './services/transactions';
import { useSoundsContext, SoundsContextType } from './services/sounds';
import ResourcesToast from './shared/ResourcesToast';
import { getQuest } from './services/quests';
import { Quest } from './shared/types';

function App() {
    const toast = useToast();

    const { txs, setTxs } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { successfulTransactionsArray } = useGetSuccessfulTransactions();

    // TODO: DEBUG
    // useEffect(() => {
    //     displayResourcesToast('Quest complete!', getQuest(1).rewards);
    // }, []);

    useEffect(() => {
        removeTxs(
            map(failedTransactionsArray, (tx) => head(tx)),
            'failed'
        );
    }, [failedTransactionsArray]);

    useEffect(() => {
        removeTxs(
            map(successfulTransactionsArray, (tx) => head(tx)),
            'successful'
        );
    }, [successfulTransactionsArray]);

    const removeTxs = (victimSessionIds: string[], resolution: string) => {
        const sessionIds: string[] = map(txs, (tx) => tx.sessionId);

        const hasTxsToRemove = victimSessionIds.some((id) => includes(sessionIds, id));

        if (hasTxsToRemove) {
            console.log('Removing', victimSessionIds);

            setTxs((txs: Transaction[]) =>
                filter(txs, (tx: Transaction) => {
                    if (resolution === 'successful') {
                        if (tx.type === TransactionType.CompleteQuest) {
                            console.log('Quest complete!', tx.questId);
                            const quest: Quest = getQuest(tx.questId);
                            displayResourcesToast('Quest complete', quest.rewards);
                        }

                        if (tx.type === TransactionType.StartQuest) {
                            console.log('Quest started', tx.questId);
                            playSound('start_quest');
                        }
                    }

                    return !includes(victimSessionIds, tx.sessionId);
                })
            );
        }
    };

    const displayResourcesToast = (
        title: string,
        gains: {
            resource: string;
            value: number;
        }[]
    ) => {
        playSound('complete_quest');

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '2rem',
                marginRight: '2rem',
            },
            duration: 15000,
            render: () => <ResourcesToast title={title} rewards={gains}></ResourcesToast>,
        });
    };

    return (
        <ChakraBaseProvider theme={theme}>
            <ResourcesProvider>
                <TransactionsToastList successfulToastLifetime={20000} transactionToastClassName="Tx-Toast" />
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
            </ResourcesProvider>
        </ChakraBaseProvider>
    );
}

export default App;
