export interface LogSummary {
    questsCompleted: number;
    herbalism: number;
    jewelcrafting: number;
    divination: number;
    tickets: number;
    energy: number;
}

export const getLogSummary = async (): Promise<LogSummary> => {
    return {
        questsCompleted: 256,
        herbalism: 112,
        jewelcrafting: 86,
        divination: 24,
        tickets: 25,
        energy: 30460,
    };
};
