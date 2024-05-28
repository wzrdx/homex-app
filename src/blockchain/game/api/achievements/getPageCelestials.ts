export const getPageCelestials = async (): Promise<{
    aurora: number;
    verdant: number;
    solara: number;
    emberheart: number;
    aetheris: number;
}> => {
    return {
        aurora: 1,
        verdant: 10,
        solara: 5,
        emberheart: 8,
        aetheris: 5,
    };
};
