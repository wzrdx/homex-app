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

export enum Role {
    OGTravelers,
    FirstTravelers,
    Elders,
}

export interface TicketEarner {
    address: string;
    ticketsEarned: number;
    timestamp: Date;
    time?: string;
    role?: Role;
    username?: string;
}
