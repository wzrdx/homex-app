import { find, findIndex, includes } from 'lodash';
import { createContext, useContext, useState } from 'react';
import { isGamePausedQuery } from '../blockchain/api/isGamePaused';

export enum TransactionType {
    StartQuest,
    StartMultipleQuests,
    CompleteQuest,
    CompleteAllQuests,
    JoinRaffle,
    JoinBattle,
    Stake,
    Unstake,
    ClaimEnergy,
    ClaimReward,
    ClaimUnbondedNFTs,
    Restake,
    Migration,
}

export enum TxResolution {
    UpdateQuestsAndResources = 'UpdateResources',
    UpdateEnergy = 'UpdateEnergy',
    UpdateTicketsAndRewards = 'UpdateTicketsAndRewards',
    UpdateTicketsAndRaffles = 'UpdateTicketsAndRaffles',
    UpdateTicketsAndBattles = 'UpdateTicketsAndBattles',
    UpdateStakingInfo = 'UpdateStakingInfo',
    UpdateStakingAndNFTs = 'UpdateStakingAndNFTs',
}

export interface Transaction {
    sessionId: string;
    type: TransactionType;
    questId?: number;
    resolution?: TxResolution;
    hash?: string;
    data?: any;
}

export interface TransactionsContextType {
    pendingTxs: Array<Transaction>;
    setPendingTxs: React.Dispatch<React.SetStateAction<Transaction[]>>;
    isQuestTxPending: (type: TransactionType, questId: number) => boolean;
    isTxPending: (type: TransactionType) => boolean;
    isRaffleTxPending: (type: TransactionType, raffleId: number) => boolean;
    isClaimRewardTxPending: (type: TransactionType, id: number) => boolean;
    isGamePaused: boolean;
    getGameState: () => Promise<boolean>;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const useTransactionsContext = () => useContext(TransactionsContext);

export const TransactionsProvider = ({ children }) => {
    const [isGamePaused, setGamePaused] = useState<boolean>(false);

    const [pendingTxs, setPendingTxs] = useState<Transaction[]>([]);

    const isQuestTxPending = (type: TransactionType, questId: number): boolean => {
        // StartMultipleQuests
        const multiQuestsTx = find(pendingTxs, (tx) => tx.type === TransactionType.StartMultipleQuests);

        if (multiQuestsTx && includes(multiQuestsTx.data.questIds, questId.toString())) {
            return true;
        }

        // CompleteAllQuests
        const completeAllQuestsTx = find(pendingTxs, (tx) => tx.type === TransactionType.CompleteAllQuests);

        if (completeAllQuestsTx && includes(completeAllQuestsTx.data.completedQuestsIds, questId)) {
            return true;
        }

        return findIndex(pendingTxs, (tx) => tx.type === type && tx.questId === questId) > -1;
    };

    const isRaffleTxPending = (type: TransactionType, raffleId: number): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type && tx.data.id === raffleId) > -1;
    };

    const isClaimRewardTxPending = (type: TransactionType, id: number): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type && tx.data.id === id) > -1;
    };

    const isTxPending = (type: TransactionType): boolean => {
        return findIndex(pendingTxs, (tx) => tx.type === type) > -1;
    };

    const getGameState = async (): Promise<boolean> => {
        const isPaused = await isGamePausedQuery();
        setGamePaused(isPaused);
        return isPaused;
    };

    return (
        <TransactionsContext.Provider
            value={{
                pendingTxs,
                setPendingTxs,
                isQuestTxPending,
                isRaffleTxPending,
                isClaimRewardTxPending,
                isTxPending,
                isGamePaused,
                getGameState,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};
