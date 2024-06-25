import React, { createContext, useContext, useState } from 'react';

import EnergyIcon from '../assets/resources/icons/energy.png';
import EssenceIcon from '../assets/resources/icons/essence.png';
import GemsIcon from '../assets/resources/icons/gems.png';
import HerbsIcon from '../assets/resources/icons/herbs.png';
import MazeIcon from '../assets/resources/icons/maze.png';

import EnergyImage from '../assets/resources/images/energy.png';
import EssenceImage from '../assets/resources/images/essence.png';
import GemsImage from '../assets/resources/images/gems.png';
import HerbsImage from '../assets/resources/images/herbs.png';

import TicketsIcon from '../assets/resources/icons/tickets.png';
import TicketsImage from '../assets/resources/images/tickets.png';
import XpImage from '../assets/resources/images/xp.png';

import { useDisclosure } from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import axios from 'axios';
import { config } from '../blockchain/config';

export const INITIAL_RESOURCES_STATE = {
    energy: 0,
    herbs: 0,
    gems: 0,
    essence: 0,
    tickets: 0,
};

export const RESOURCE_ELEMENTS: any = {
    energy: {
        name: 'Energy',
        icon: EnergyIcon,
        image: EnergyImage,
        tokenId: config.energyTokenId,
        color: '#287ece',
    },
    herbs: {
        name: 'Herbs',
        icon: HerbsIcon,
        image: HerbsImage,
        tokenId: config.herbsTokenId,
        color: '#20b361',
    },
    gems: {
        name: 'Gems',
        icon: GemsIcon,
        image: GemsImage,
        tokenId: config.gemsTokenId,
        color: '#e24e06',
    },
    essence: {
        name: 'Essence',
        icon: EssenceIcon,
        image: EssenceImage,
        tokenId: config.essenceTokenId,
        color: '#cd3b95',
    },
    maze: {
        name: 'Maze',
        icon: MazeIcon,
        image: null,
        tokenId: '',
        color: 'mirage',
    },
    tickets: {
        name: 'Tickets',
        image: TicketsImage,
        icon: TicketsIcon,
        tokenId: config.ticketsTokenId,
    },
    xp: {
        name: 'Experience',
        image: XpImage,
    },
};

export const getSFTDetails = (address: string, tokenId: string): Promise<{ data: { balance: string } }> =>
    axios.get(`accounts/${address}/nfts/${tokenId}`, {
        baseURL: config.apiUrl,
    });

export const getResourceElements = (key: string) => RESOURCE_ELEMENTS[key];

export interface ResourcesContextType {
    resources: any;
    setResources: React.Dispatch<
        React.SetStateAction<{
            energy: number;
            herbs: number;
            gems: number;
            essence: number;
            tickets: number;
        }>
    >;
    getEnergy: () => Promise<void>;
    getHerbs: () => Promise<void>;
    getGems: () => Promise<void>;
    getEssence: () => Promise<void>;
    getTickets: () => Promise<void>;
    isTicketModalOpen: boolean;
    onTicketModalOpen: () => void;
    onTicketModalClose: () => void;
}

const ResourcesContext = createContext<ResourcesContextType | null>(null);

export const useResourcesContext = () => useContext(ResourcesContext);

export const ResourcesProvider = ({ children }) => {
    const [resources, setResources] = useState(INITIAL_RESOURCES_STATE);

    let { address } = useGetAccountInfo();

    const { isOpen: isTicketModalOpen, onOpen: onTicketModalOpen, onClose: onTicketModalClose } = useDisclosure();

    const getEnergy = async () => {
        try {
            const result = await axios.get(`accounts/${address}/tokens/${config.energyTokenId}`, {
                baseURL: config.apiUrl,
            });

            if (result.data) {
                setResources((state) => ({
                    ...state,
                    energy: Number.parseInt(result.data.balance) / 1000000,
                }));
            }
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setResources((state) => ({
                    ...state,
                    energy: 0,
                }));
            }
            console.error('getEnergy', error.message);
        }
    };

    const getHerbs = async () => {
        try {
            const result = await axios.get(`accounts/${address}/tokens/${config.herbsTokenId}`, {
                baseURL: config.apiUrl,
            });

            if (result.data) {
                setResources((state) => ({
                    ...state,
                    herbs: Number.parseInt(result.data.balance) / 1000000,
                }));
            }
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setResources((state) => ({
                    ...state,
                    herbs: 0,
                }));
            }
            console.error('getHerbs', error.message);
        }
    };

    const getGems = async () => {
        try {
            const result = await axios.get(`accounts/${address}/tokens/${config.gemsTokenId}`, {
                baseURL: config.apiUrl,
            });

            if (result.data) {
                setResources((state) => ({
                    ...state,
                    gems: Number.parseInt(result.data.balance) / 1000000,
                }));
            }
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setResources((state) => ({
                    ...state,
                    gems: 0,
                }));
            }
            console.error('getGems', error.message);
        }
    };

    const getEssence = async () => {
        try {
            const result = await axios.get(`accounts/${address}/tokens/${config.essenceTokenId}`, {
                baseURL: config.apiUrl,
            });

            if (result.data) {
                setResources((state) => ({
                    ...state,
                    essence: Number.parseInt(result.data.balance) / 1000000,
                }));
            }
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setResources((state) => ({
                    ...state,
                    essence: 0,
                }));
            }
            console.error('getEssence', error.message);
        }
    };

    const getTickets = async () => {
        try {
            const result = await getSFTDetails(address, `${config.ticketsTokenId}-01`);

            if (result.data) {
                setResources((state) => ({
                    ...state,
                    tickets: Number.parseInt(result.data.balance),
                }));
            }
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setResources((state) => ({
                    ...state,
                    tickets: 0,
                }));
            }
            console.error('getTickets', error.message);
        }
    };

    return (
        <ResourcesContext.Provider
            value={{
                resources,
                setResources,
                getEnergy,
                getHerbs,
                getGems,
                getEssence,
                getTickets,
                isTicketModalOpen,
                onTicketModalOpen,
                onTicketModalClose,
            }}
        >
            {children}
        </ResourcesContext.Provider>
    );
};
