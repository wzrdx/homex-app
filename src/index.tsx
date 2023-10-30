import './global.scss';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { apiTimeout, walletConnectV2ProjectId, API_URL } from './blockchain/config';
import { TransactionsProvider } from './services/transactions';
import { ResourcesProvider } from './services/resources';
import { ColorModeScript } from '@chakra-ui/react';
import { QuestsProvider } from './services/quests';
import { StoreProvider } from './services/store';
import { RewardsProvider } from './services/rewards';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-0ZW6TBSBMG');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter>
        <DappProvider
            environment={EnvironmentsEnum.devnet}
            customNetworkConfig={{
                name: 'customConfig',
                apiTimeout,
                walletConnectV2ProjectId,
                apiAddress: API_URL,
            }}
        >
            <TransactionsProvider>
                <ResourcesProvider>
                    <QuestsProvider>
                        <StoreProvider>
                            <RewardsProvider>
                                <ColorModeScript initialColorMode="dark" />
                                <App />
                            </RewardsProvider>
                        </StoreProvider>
                    </QuestsProvider>
                </ResourcesProvider>
            </TransactionsProvider>
        </DappProvider>
    </BrowserRouter>
);
