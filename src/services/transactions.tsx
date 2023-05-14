import { useToast } from '@chakra-ui/react';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, filter, includes, findIndex } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';

export enum TransactionType {
    StartQuest,
    CompleteQuest,
}

export interface Transaction {
    sessionId: string;
    type: TransactionType;
    questId?: number;
}

export interface TransactionsContextType {
    txs: Array<Transaction>;
    setTxs: React.Dispatch<React.SetStateAction<Transaction[]>>;
    isQuestTxPending: (type: TransactionType, questId: number) => boolean;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const useTransactionsContext = () => useContext(TransactionsContext);

export const TransactionsProvider = ({ children }) => {
    const [txs, setTxs] = useState<Array<Transaction>>([]);

    const isQuestTxPending = (type: TransactionType, questId: number): boolean => {
        return findIndex(txs, (tx) => tx.type === type && tx.questId === questId) > -1;
    };

    return (
        <TransactionsContext.Provider value={{ txs, setTxs, isQuestTxPending }}>
            {children}
        </TransactionsContext.Provider>
    );
};
