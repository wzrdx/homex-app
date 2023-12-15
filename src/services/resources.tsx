import React, { useState } from 'react';
import { createContext, useContext } from 'react';

import EnergyIcon from '../assets/resources/icons/energy.png';
import HerbsIcon from '../assets/resources/icons/herbs.png';
import GemsIcon from '../assets/resources/icons/gems.png';
import EssenceIcon from '../assets/resources/icons/essence.png';

import EnergyImage from '../assets/resources/images/energy.png';
import HerbsImage from '../assets/resources/images/herbs.png';
import GemsImage from '../assets/resources/images/gems.png';
import EssenceImage from '../assets/resources/images/essence.png';

import TicketsIcon from '../assets/resources/icons/tickets.png';
import TicketsImage from '../assets/resources/images/tickets.png';
import XpImage from '../assets/resources/images/xp.png';

import {
    API_URL,
    ENERGY_TOKEN_ID,
    ESSENCE_TOKEN_ID,
    GEMS_TOKEN_ID,
    HERBS_TOKEN_ID,
    TICKETS_TOKEN_ID,
} from '../blockchain/config';
import axios from 'axios';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useDisclosure } from '@chakra-ui/react';
import _ from 'lodash';

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
        tokenId: ENERGY_TOKEN_ID,
        color: '#287ece',
    },
    herbs: {
        name: 'Herbs',
        icon: HerbsIcon,
        image: HerbsImage,
        tokenId: HERBS_TOKEN_ID,
        color: '#20b361',
    },
    gems: {
        name: 'Gems',
        icon: GemsIcon,
        image: GemsImage,
        tokenId: GEMS_TOKEN_ID,
        color: '#e24e06',
    },
    essence: {
        name: 'Essence',
        icon: EssenceIcon,
        image: EssenceImage,
        tokenId: ESSENCE_TOKEN_ID,
        color: '#cd3b95',
    },
    tickets: {
        name: 'Tickets',
        image: TicketsImage,
        icon: TicketsIcon,
        tokenId: TICKETS_TOKEN_ID,
    },
    xp: {
        name: 'Experience',
        image: XpImage,
    },
};

export const getSFTDetails = (address: string, tokenId: string): Promise<{ data: { balance: string } }> =>
    axios.get(`accounts/${address}/nfts/${tokenId}`, {
        baseURL: API_URL,
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
            const result = await axios.get(`accounts/${address}/tokens/${ENERGY_TOKEN_ID}`, {
                baseURL: API_URL,
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
            const result = await axios.get(`accounts/${address}/tokens/${HERBS_TOKEN_ID}`, {
                baseURL: API_URL,
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
            const result = await axios.get(`accounts/${address}/tokens/${GEMS_TOKEN_ID}`, {
                baseURL: API_URL,
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
            const result = await axios.get(`accounts/${address}/tokens/${ESSENCE_TOKEN_ID}`, {
                baseURL: API_URL,
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
            const result = await getSFTDetails(address, `${TICKETS_TOKEN_ID}-01`);

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
