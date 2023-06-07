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

// TODO: Remove
export enum Role {
    OGTravelers = 'OG',
    FirstTravelers = 'FirstTravelers',
    Elders = 'Elders',
}

export interface TicketEarner {
    address: string;
    ticketsEarned: number;
    timestamp: Date;
    time?: string;
    role?: Role;
    username?: string;
}
