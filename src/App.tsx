import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { apiTimeout, API_URL, walletConnectV2ProjectId } from './blockchain/config';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect } from 'react';
import { ResourcesProvider } from './services/resources';

function App() {
    const { isLoggedIn } = useGetLoginInfo();

    useEffect(() => {
        console.log('[App.tsx] isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    return (
        <ChakraBaseProvider theme={theme}>
            <ResourcesProvider>
                <TransactionsToastList successfulToastLifetime={10000} transactionToastClassName="Tx-Toast" />
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
