export interface MazeStakingStats {
    tokens: number;
    wallets: number;
    supply: number;
}

export const getStakingStats = async (): Promise<MazeStakingStats | undefined> => {
    return {
        tokens: 356,
        wallets: 100,
        supply: 2124200000000,
    };
};
