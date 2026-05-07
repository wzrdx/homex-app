import { ColorModeScript } from '@chakra-ui/react';
import { EnvironmentsEnum, initApp } from 'services/dapp';
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

initApp({
    dAppConfig: {
        environment: EnvironmentsEnum.devnet,
        network: {
            name: 'customConfig',
            apiTimeout: String(config.apiTimeout),
            apiAddress: config.apiUrl,
        },
        providers: {
            walletConnect: {
                walletConnectV2ProjectId: config.walletConnectV2ProjectId,
            },
        },
        nativeAuth: true,
    },
}).then(() => {
    root.render(
        <BrowserRouter>
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
        </BrowserRouter>
    );
});
