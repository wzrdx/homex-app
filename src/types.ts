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
    layers: Array<{
        source: string;
        mode: string;
    }>;
}

export interface QuestReward {
    resource: string;
    name: string;
    value: number;
}
