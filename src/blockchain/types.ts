export enum TxResolution {
    UpdateStakingInfoAndEnergy,
    UpdateStakingInfo,
    UpdateResources,
    UpdateEnergy,
    UpdateTicketsAndRaffle,
}

export interface PendingTx {
    sessionId: string;
    resolution: TxResolution;
    data?: any;
}

export enum QuestStatus {
    Default,
    Ongoing,
    Complete,
}

export interface QuestInfo {
    status: QuestStatus;
    timestamp: Date | undefined;
}

export interface OngoingQuest {
    id: number;
    timestamp: Date;
}
