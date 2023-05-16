import { findIndex } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';

export enum TransactionType {
    StartQuest,
    CompleteQuest,
    Faucet,
}

export enum TxResolution {
    UpdateResources,
    UpdateEnergy,
}

export interface Transaction {
    sessionId: string;
    type: TransactionType;
    questId?: number;
    resolution?: TxResolution;
    data?: any;
}

export interface TransactionsContextType {
    pendingTxs: Array<Transaction>;
    setPendingTxs: React.Dispatch<React.SetStateAction<Transaction[]>>;
    isQuestTxPending: (type: TransactionType, questId: number) => boolean;
    isFaucetTxPending: () => boolean;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const useTransactionsContext = () => useContext(TransactionsContext);

export const TransactionsProvider = ({ children }) => {
    const [pendingTxs, setPendingTxs] = useState<Transaction[]>([]);

    const isQuestTxPending = (type: TransactionType, questId: number): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type && tx.questId === questId) > -1;
    };

    const isFaucetTxPending = (): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === TransactionType.Faucet) > -1;
    };

    return (
        <TransactionsContext.Provider value={{ pendingTxs, setPendingTxs, isQuestTxPending, isFaucetTxPending }}>
            {children}
        </TransactionsContext.Provider>
    );
};
