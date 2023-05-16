import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider, useToast } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesContextType, ResourcesProvider, useResourcesContext } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, filter, find, cloneDeep, remove } from 'lodash';
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
import { getQuest } from './services/quests';
import { Quest } from './types';
import { FAUCET_REWARD } from './components/Energy';

function App() {
    const toast = useToast();

    const { pendingTxs, setPendingTxs } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;

    // TODO: Univeral resolution resolver
    // useEffect(() => {
    //     if (hasSuccessfulTransactions) {
    //         successfulTransactionsArray.forEach((tx: [string, any]) => {
    //             const pendingTx = find(pendingTxs, (pTx) => pTx.sessionId === tx[0]);

    //             if (pendingTx) {
    //                 console.log('TxResolution', pendingTx);

    //                 setPendingTxs((array) => filter(array, (pTx) => pTx.sessionId !== pendingTx.sessionId));

    //                 switch (pendingTx.resolution) {
    //                     case TxResolution.UpdateEnergy:
    //                         getEnergy();
    //                         break;

    //                     default:
    //                         console.error('Unknown txResolution type');
    //                 }
    //             }
    //         });
    //     }
    // }, [successfulTransactionsArray]);

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
        const pendingSessionIds: string[] = map(pendingTxs, (tx) => tx.sessionId);
        const hasTxsToRemove = victimSessionIds.some((id) => includes(pendingSessionIds, id));

        if (hasTxsToRemove) {
            const txs = cloneDeep(pendingTxs);
            const victims = remove(txs, (tx) => includes(victimSessionIds, tx.sessionId));

            console.log('Txs', txs, 'Victims', victims);

            // TODO: Split function from this point
            if (resolution === 'successful') {
                // TODO: Iterate over the victims
                // if (tx.type === TransactionType.CompleteQuest) {
                //     const quest: Quest = getQuest(tx.questId);
                //     displayResourcesToast('Quest complete!', quest.rewards);
                // }
                // if (tx.type === TransactionType.StartQuest) {
                //     playSound('start_quest');
                // }
                // if (tx.type === TransactionType.Faucet) {
                //     displayResourcesToast('Energy gained!', [FAUCET_REWARD]);
                // }
            }

            setPendingTxs(txs);
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
        </ChakraBaseProvider>
    );
}

export default App;
