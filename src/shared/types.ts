export interface Quest {
    id: number;
    type: string;
    name: string;
    description: JSX.Element;
    requirements: {
        energy: number;
    };
    duration: number;
    rewards: Array<QuestReward>;
}

export interface QuestReward {
    resource: string;
    name: string;
    value: number;
}
