import { ReactNode } from 'react';
import { Transaction } from './sdkCore';
import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
import type { SignedTransactionType, TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/out/types/transactions.types';
import { ExtensionProvider } from '@multiversx/sdk-extension-provider/out/extensionProvider';
import { CrossWindowProvider } from '@multiversx/sdk-web-wallet-cross-window-provider/out/CrossWindowProvider/CrossWindowProvider';
import { WalletConnectV2Provider } from '@multiversx/sdk-wallet-connect-provider/out/walletConnectV2Provider';
import { HWProvider } from '@multiversx/sdk-hw-provider/out/hwProvider';
import { config } from '../blockchain/config';

const { getAccountProvider, setAccountProvider } = require('@multiversx/sdk-dapp/out/providers/helpers/accountProvider.cjs');
const { createTransactionsSession } = require('@multiversx/sdk-dapp/out/store/actions/transactions/transactionsActions.cjs');
const { loginAction, logoutAction } = require('@multiversx/sdk-dapp/out/store/actions/sharedActions/sharedActions.cjs');
const { refreshAccount } = require('@multiversx/sdk-dapp/out/utils/account/refreshAccount.cjs');
const { getAddress } = require('@multiversx/sdk-dapp/out/methods/account/getAddress.cjs');
const { EnvironmentsEnum, TransactionBatchStatusesEnum } = require('@multiversx/sdk-dapp/out/types/enums.types.cjs');
const { initStore } = require('@multiversx/sdk-dapp/out/store/store.cjs');
const { initializeNetwork } = require('@multiversx/sdk-dapp/out/store/actions/network/initializeNetwork.cjs');
const { trackTransactions } = require('@multiversx/sdk-dapp/out/methods/trackTransactions/trackTransactions.cjs');
const { useGetAccountInfo } = require('@multiversx/sdk-dapp/out/react/account/useGetAccountInfo.cjs');
const { useGetFailedTransactions: useGetFailedTransactionsBase } = require(
    '@multiversx/sdk-dapp/out/react/transactions/useGetFailedTransactions.cjs'
);
const { useGetSuccessfulTransactions: useGetSuccessfulTransactionsBase } = require(
    '@multiversx/sdk-dapp/out/react/transactions/useGetSuccessfulTransactions.cjs'
);

export { EnvironmentsEnum, getAddress, refreshAccount, useGetAccountInfo };
export type { SignedTransactionType, TransactionsDisplayInfoType };

export const initApp = async ({ dAppConfig }: any) => {
    initStore();
    await initializeNetwork({
        customNetworkConfig: dAppConfig?.network,
        environment: dAppConfig?.environment,
    });
    await trackTransactions();
};

export type SignedTransactionsBodyType = {
    transactions: SignedTransactionType[];
};

type LegacyTransactionEntry = [string, SignedTransactionsBodyType];

const toLegacyEntries = (transactions: SignedTransactionType[]): LegacyTransactionEntry[] =>
    transactions.map((transaction) => [transaction.hash, { transactions: [transaction] }]);

export const useGetFailedTransactions = () => {
    const transactions = useGetFailedTransactionsBase();
    return { failedTransactionsArray: toLegacyEntries(transactions) };
};

export const useGetSuccessfulTransactions = () => {
    const transactions = useGetSuccessfulTransactionsBase();
    const successfulTransactionsArray = toLegacyEntries(transactions);

    return {
        hasSuccessfulTransactions: successfulTransactionsArray.length > 0,
        successfulTransactionsArray,
    };
};

export const logout = async (callbackUrl?: string, callback?: (callbackUrl?: string) => void) => {
    try {
        await getAccountProvider().logout({ shouldBroadcastLogoutAcrossTabs: true });
    } catch (err) {
        console.warn('Unable to logout active provider', err);
    }

    logoutAction();

    if (callbackUrl) {
        if (callback) {
            callback(callbackUrl);
        } else {
            window.location.href = callbackUrl;
        }
    }
};

export const sendTransactions = async ({
    transactions,
    transactionsDisplayInfo,
}: {
    transactions: Transaction | Promise<Transaction> | Array<Transaction | Promise<Transaction>>;
    transactionsDisplayInfo?: TransactionsDisplayInfoType;
    redirectAfterSign?: boolean;
}) => {
    const txs = await Promise.all(Array.isArray(transactions) ? transactions : [transactions]);
    const provider = getAccountProvider();
    const signedTransactions = await provider.signTransactions(txs);
    const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: config.apiTimeout });
    const [, hashes] = await proxy.sendTransactions(signedTransactions);

    const signedTransactionsWithHashes = signedTransactions.map(
        (transaction, index) =>
            ({
                ...transaction.toPlainObject(),
                hash: hashes[index],
            } as SignedTransactionType)
    );

    const sessionId = createTransactionsSession({
        transactions: signedTransactionsWithHashes,
        transactionsDisplayInfo,
        status: TransactionBatchStatusesEnum.sent,
    });

    return { sessionId };
};

type LoginProvider = {
    init: (...args: any[]) => Promise<boolean>;
    login: (...args: any[]) => Promise<{ address: string; signature?: string } | null>;
    logout: (...args: any[]) => Promise<boolean>;
    signTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
};

const getLoginProvider = (type: string): LoginProvider => {
    switch (type) {
        case 'extension':
            return ExtensionProvider.getInstance();

        case 'crossWindow': {
            const provider = CrossWindowProvider.getInstance();
            provider.setWalletUrl(config.chainId === 'D' ? 'https://devnet-wallet.multiversx.com' : 'https://wallet.multiversx.com');
            return provider;
        }

        case 'walletConnect':
            return new WalletConnectV2Provider(
                {
                    onClientLogin: () => undefined,
                    onClientLogout: () => undefined,
                    onClientEvent: () => undefined,
                },
                config.chainId,
                'wss://relay.walletconnect.com',
                config.walletConnectV2ProjectId
            );

        case 'ledger':
            return new HWProvider() as unknown as LoginProvider;

        default:
            throw new Error(`Unsupported login provider: ${type}`);
    }
};

const LoginButton = ({
    type,
    callbackRoute,
    buttonClassName,
    children,
}: {
    type: string;
    callbackRoute?: string;
    buttonClassName?: string;
    children: ReactNode;
    nativeAuth?: boolean;
    redirectAfterLogin?: boolean;
    isWalletConnectV2?: boolean;
}) => {
    const login = async () => {
        const provider = getLoginProvider(type);
        await provider.init();
        const result = await provider.login(type === 'ledger' ? { addressIndex: 0 } : undefined);

        if (result?.address) {
            setAccountProvider(provider as any);
            loginAction({ address: result.address, providerType: type });
        }
    };

    return (
        <button className={buttonClassName} type="button" onClick={login}>
            {children}
        </button>
    );
};

export const ExtensionLoginButton = (props: any) => <LoginButton {...props} type="extension" />;
export const WebWalletLoginButton = (props: any) => <LoginButton {...props} type="crossWindow" />;
export const WalletConnectLoginButton = (props: any) => <LoginButton {...props} type="walletConnect" />;
export const LedgerLoginButton = (props: any) => <LoginButton {...props} type="ledger" />;

export const NotificationModal = () => null;
export const SignTransactionsModals = (_props: any) => null;
export const TransactionsToastList = (_props: any) => null;
