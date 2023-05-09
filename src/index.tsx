import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './global.scss';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { apiTimeout, walletConnectV2ProjectId, API_URL } from './blockchain/config';

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
            <App />
        </DappProvider>
    </BrowserRouter>
);
