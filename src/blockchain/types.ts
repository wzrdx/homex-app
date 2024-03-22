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

export interface Stake {
    tokenId: string;
    nonce: number;
    amount: number;
    timestamp: Date | null;
}

export interface StakingInfo {
    isStaked: boolean;
    rewards: number;
    timestamp: Date;
    tokens: Stake[];
}

export interface MazeStakingInfo extends StakingInfo {
    mazeBalance: number;
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
    tokenId: string;
    rank?: number;
    timestamp?: Date;
}

export interface SFT {
    name: string;
    nonce: number;
    url: string;
    tokenId: string;
    balance: number;
    artRarityClass: ArtRarityClass;
}

export enum MainRarityClass {
    Elder = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Royal = 4,
    OneOfOne = 5,
}

export enum ArtRarityClass {
    Legendary = 1,
    Epic = 2,
    Rare = 3,
    Uncommon = 4,
    Common = 5,
}

export interface Rarity {
    nonce: number;
    rarityClass: number;
}

export interface PlayerInfo {
    address: string;
    xp: number;
    pagesMinted: number;
    energyClaimed: number;
    mazeBalance: number;
}
