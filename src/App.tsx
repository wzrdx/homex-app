import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesContextType, useResourcesContext } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, find, cloneDeep, remove, forEach, isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useTransactionsContext, TransactionsContextType, Transaction, TxResolution } from './services/transactions';
import { QuestsContextType, useQuestsContext } from './services/quests';
import { useStoreContext, StoreContextType } from './services/store';
import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';

function App() {
    const { pendingTxs, setPendingTxs } = useTransactionsContext() as TransactionsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getOngoingQuests, onQuestsModalClose } = useQuestsContext() as QuestsContextType;
    const { getStakingInfo, getWalletNFTs } = useStoreContext() as StoreContextType;

    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;

    // Init
    useEffect(() => {
        window.localStorage['chakra-ui-color-mode'] = 'dark';
    }, []);

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

            default:
                console.error('getResourceCall(): Unknown resource type');
                return async () => {};
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
