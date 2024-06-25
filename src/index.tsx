import { ColorModeScript } from '@chakra-ui/react';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config } from './blockchain/config';
import './global.scss';
import { QuestsProvider } from './services/quests';
import { ResourcesProvider } from './services/resources';
import { RewardsProvider } from './services/rewards';
import { SoundsProvider } from './services/sounds';
import { StoreProvider } from './services/store';
import { TransactionsProvider } from './services/transactions';

ReactGA.initialize('G-0ZW6TBSBMG');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();

root.render(
    <BrowserRouter>
        <DappProvider
            environment={EnvironmentsEnum.devnet}
            customNetworkConfig={{
                name: 'customConfig',
                apiTimeout: config.apiTimeout,
                walletConnectV2ProjectId: config.walletConnectV2ProjectId,
                apiAddress: config.apiUrl,
            }}
        >
            <TransactionsProvider>
                <SoundsProvider>
                    <ResourcesProvider>
                        <QuestsProvider>
                            <StoreProvider>
                                <RewardsProvider>
                                    <ColorModeScript initialColorMode="dark" />

                                    <QueryClientProvider client={queryClient}>
                                        <App />
                                    </QueryClientProvider>
                                </RewardsProvider>
                            </StoreProvider>
                        </QuestsProvider>
                    </ResourcesProvider>
                </SoundsProvider>
            </TransactionsProvider>
        </DappProvider>
    </BrowserRouter>
);
