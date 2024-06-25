export type Config = {
    gameScAddress: string;
    auxiliaryScAddress: string;
    questApi: string;
    chainId: string;
    apiUrl: string;
    gatewayUrl: string;
    explorerUrl: string;
    collectionSize: number;
    travelersCollectionId: string;
    travelersPadding: number;
    eldersPadding: number;
    eldersCollectionId: string;
    ticketsTokenId: string;
    energyTokenId: string;
    herbsTokenId: string;
    gemsTokenId: string;
    essenceTokenId: string;
    aomCollectionId: string;
    walletConnectV2ProjectId: string;
    apiTimeout: number;
    egldDenomination: bigint;
    tokenDenomination: number;
    mazeDenomination: bigint;
    energyQueryingInterval: number;
    mazeQueryingInterval: number;
    team: string[];
};

export const config: Config = {
    gameScAddress: process.env.REACT_APP_GAME_SC_ADDRESS as string,
    auxiliaryScAddress: process.env.REACT_APP_AUXILIARY_SC_ADDRESS as string,
    questApi: 'https://api.homex.quest',
    chainId: process.env.REACT_APP_CHAIN_ID as string,
    apiUrl: (window.localStorage.api as string) || (process.env.REACT_APP_API_URL as string),
    gatewayUrl: 'https://gateway.multiversx.com',
    explorerUrl: process.env.REACT_APP_EXPLORER_URL as string,
    collectionSize: Number(process.env.REACT_APP_COLLECTION_SIZE),
    travelersCollectionId: process.env.REACT_APP_TRAVELERS_COLLECTION_ID as string,
    travelersPadding: Number(process.env.REACT_APP_TRAVELERS_PADDING),
    eldersPadding: 2,
    eldersCollectionId: process.env.REACT_APP_ELDERS_COLLECTION_ID as string,
    ticketsTokenId: process.env.REACT_APP_TICKETS_TOKEN_ID as string,
    energyTokenId: process.env.REACT_APP_ENERGY_TOKEN_ID as string,
    herbsTokenId: process.env.REACT_APP_HERBS_TOKEN_ID as string,
    gemsTokenId: process.env.REACT_APP_GEMS_TOKEN_ID as string,
    essenceTokenId: process.env.REACT_APP_ESSENCE_TOKEN_ID as string,
    aomCollectionId: process.env.REACT_APP_AOM_COLLECTION_ID as string,
    walletConnectV2ProjectId: '323a2ff473ee6b636d89a1a83ec733e2',
    apiTimeout: 60000,
    egldDenomination: 1000000000000000000n,
    tokenDenomination: 1000000,
    mazeDenomination: 1000000000000000000n,
    energyQueryingInterval: 30000,
    mazeQueryingInterval: 60000,
    team: ['erd1za7d0lzgnee39p9sytre0mss76tnht70fem0pcv0zn4undcfukrqqkzcpl'],
};
