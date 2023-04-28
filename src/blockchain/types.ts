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
