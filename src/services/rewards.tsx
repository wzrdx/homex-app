import { createContext, useContext, useState } from 'react';
import { getEXOTicket, getFullTicket, getLogoBox, getMvxLogo } from './assets';
import { RESOURCE_ELEMENTS } from './resources';
import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { API_URL } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { getElderRewards } from '../blockchain/api/getElderRewards';

const getNFTPrize = (amount: number, type: 'Elders' | 'Travelers') => ({
    backgroundColor: '#421218',
    imageSrc: getLogoBox(),
    height: { md: '44px', lg: '56px' },
    textColor: 'primaryDark',
    text: `${amount} ${type}`,
});

const getEGLDPrize = (amount: number) => ({
    backgroundColor: '#2b2d31',
    imageSrc: getMvxLogo(),
    height: { md: '30px', lg: '42px' },
    textColor: 'whitesmoke',
    text: `${amount} EGLD`,
});

export const getTicketsPrize = (amount: number) => ({
    backgroundColor: '#8c5816',
    imageSrc: getFullTicket(),
    height: { md: '36px', lg: '50px' },
    textColor: 'brightWheat',
    text: `${amount} Golden Ticket${amount > 1 ? 's' : ''}`,
});

const getEssencePrize = (amount: number) => ({
    backgroundColor: '#3a182d',
    imageSrc: RESOURCE_ELEMENTS.essence.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.essence',
    text: `${amount} ESSENCE`,
});

const getEnergyPrize = (amount: number) => ({
    backgroundColor: '#101e2b',
    imageSrc: RESOURCE_ELEMENTS.energy.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.energy',
    text: `${amount} ENERGY`,
});

let ID = 0;
const getId = () => ++ID;

export const RAFFLES: any[] = [
    {
        id: getId(),
        prizes: [getNFTPrize(2, 'Elders'), getEGLDPrize(25), getTicketsPrize(20)],
        winners: 30,
    },
    {
        id: getId(),
        prizes: [getNFTPrize(6, 'Travelers'), getEGLDPrize(10), getTicketsPrize(32), getEssencePrize(1000)],
        winners: 30,
    },
    {
        id: getId(),
        prizes: [getEGLDPrize(10), getTicketsPrize(26), getEnergyPrize(3400)],
        winners: 20,
    },
    {
        id: getId(),
        prizes: [],
        isSingleImage: true,
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        id: getId(),
        prizes: [],
        isSingleImage: true,
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        id: getId(),
        prizes: [],
        isSingleImage: true,
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        id: getId(),
        prizes: [getEGLDPrize(2)],
        winners: 2,
    },
    {
        id: getId(),
        prizes: [getEGLDPrize(2)],
        winners: 2,
    },
    {
        id: getId(),
        prizes: [getTicketsPrize(50)],
        winners: 5,
    },
];

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });

const RAFFLES_FUNCTION_NAME = 'getRaffles';
const BATTLES_FUNCTION_NAME = 'getBattles';

export interface RewardsContextType {
    raffles: Competition[] | undefined;
    getRaffles: () => Promise<any>;
    battles: Competition[] | undefined;
    getBattles: () => Promise<any>;
    ticketsAmount: number | undefined;
    getTicketsAmount: () => Promise<void>;
}

export interface Competition {
    id: number;
    timestamp: Date;
    tickets: number;
}

const RewardsContext = createContext<RewardsContextType | null>(null);

export const useRewardsContext = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }) => {
    const [raffles, setRaffles] = useState<Competition[]>();
    const [battles, setBattles] = useState<Competition[]>();
    const [ticketsAmount, setTicketsAmount] = useState<number>();

    const getRaffles = async () => {
        setRaffles(await getCompetition(RAFFLES_FUNCTION_NAME));
    };

    const getBattles = async () => {
        setBattles(await getCompetition(BATTLES_FUNCTION_NAME));
    };

    const getCompetition = async (functionName: string): Promise<Competition[]> => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction(functionName),
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(functionName);

            const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const array = firstValue?.valueOf();

            const parsedArray = map(array, (raffle) => ({
                id: raffle?.id?.toNumber() as number,
                timestamp: new Date(raffle?.timestamp?.toNumber() * 1000),
                tickets: raffle?.tickets?.toNumber() as number,
            }));

            return parsedArray;
        } catch (err) {
            console.error(`Unable to call ${functionName}`, err);
            return [];
        }
    };

    const getTicketsAmount = async () => {
        setTicketsAmount(await getElderRewards());
    };

    return (
        <RewardsContext.Provider value={{ raffles, getRaffles, battles, getBattles, ticketsAmount, getTicketsAmount }}>
            {children}
        </RewardsContext.Provider>
    );
};
