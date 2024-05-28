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
import { ENERGY_TOKEN_ID, ESSENCE_TOKEN_ID, GEMS_TOKEN_ID, HERBS_TOKEN_ID, TICKETS_TOKEN_ID } from '../blockchain/config';

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
        tokenId: TICKETS_TOKEN_ID,
    },
    xp: {
        name: 'Experience',
        image: XpImage,
    },
};

export const getSFTDetails = (address: string, tokenId: string): { data: { balance: string } } => {
    return { data: { balance: '1' } };
};

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

    const { isOpen: isTicketModalOpen, onOpen: onTicketModalOpen, onClose: onTicketModalClose } = useDisclosure();

    const getEnergy = async () => {
        setResources((state) => ({
            ...state,
            energy: 2500,
        }));
    };

    const getHerbs = async () => {
        setResources((state) => ({
            ...state,
            herbs: 1024,
        }));
    };

    const getGems = async () => {
        setResources((state) => ({
            ...state,
            gems: 420,
        }));
    };

    const getEssence = async () => {
        setResources((state) => ({
            ...state,
            essence: 100,
        }));
    };

    const getTickets = async () => {
        setResources((state) => ({
            ...state,
            tickets: 25,
        }));
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
