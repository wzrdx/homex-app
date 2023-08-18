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

export interface Participant {
    address: string;
    ticketsCount: number;
    username?: string;
}

export interface BattleParticipant extends Participant {
    quests: number;
}

export interface NFT {
    name: string;
    nonce: number;
    url: string;
    tokenId: string;
    rank?: number;
    timestamp?: Date;
}

export enum RarityClass {
    Elder = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Royal = 4,
    OneOfOne = 5,
}
