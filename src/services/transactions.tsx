import { findIndex } from 'lodash';
import { createContext, useContext, useState } from 'react';
import { isGamePausedQuery } from '../blockchain/api/isGamePaused';
import { isSwappingPausedQuery } from '../blockchain/api/isSwappingPaused';

export enum TransactionType {
    StartQuest,
    CompleteQuest,
    JoinRaffle,
    Stake,
    Unstake,
    Claim,
    Swap,
}

export enum TxResolution {
    UpdateResources = 'UpdateResources',
    UpdateEnergy = 'UpdateEnergy',
    UpdateTickets = 'UpdateTickets',
    UpdateStakingInfo = 'UpdateStakingInfo',
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
    isTxPending: (type: TransactionType) => boolean;
    isGamePaused: boolean;
    isSwappingPaused: boolean;
    getGameState: () => Promise<boolean>;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const useTransactionsContext = () => useContext(TransactionsContext);

export const TransactionsProvider = ({ children }) => {
    const [isGamePaused, setGamePaused] = useState<boolean>(false);
    const [isSwappingPaused, setSwappingPaused] = useState<boolean>(false);

    const [pendingTxs, setPendingTxs] = useState<Transaction[]>([]);

    const isQuestTxPending = (type: TransactionType, questId: number): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type && tx.questId === questId) > -1;
    };

    const isTxPending = (type: TransactionType): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type) > -1;
    };

    const getGameState = async (): Promise<boolean> => {
        const isPaused = await isGamePausedQuery();
        setGamePaused(isPaused);
        setSwappingPaused(await isSwappingPausedQuery());
        return isPaused;
    };

    return (
        <TransactionsContext.Provider
            value={{
                pendingTxs,
                setPendingTxs,
                isQuestTxPending,
                isTxPending,
                isGamePaused,
                isSwappingPaused,
                getGameState,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};
