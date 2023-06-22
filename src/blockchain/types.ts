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

export interface NFT {
    name: string;
    nonce: number;
    url: string;
    type?: NFTType;
    rank?: number;
}

export enum NFTType {
    Traveler = 'Traveler',
    Elder = 'Elder',
}

export enum RarityClass {
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Royal = 4,
    OneOfOne = 5,
}
