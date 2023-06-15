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
}

export enum NFTType {
    Traveler = 'Traveler',
    Elder = 'Elder',
}
