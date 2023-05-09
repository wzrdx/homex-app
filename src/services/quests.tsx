import React, { useState } from 'react';
import Quest_1 from '../assets/quests/1.jpg';
import Quest_2 from '../assets/quests/2.jpg';
import Quest_3 from '../assets/quests/3.jpg';
import Quest_4 from '../assets/quests/4.jpg';
import Quest_5 from '../assets/quests/5.jpg';
import Quest_6 from '../assets/quests/6.jpg';
import Quest_7 from '../assets/quests/7.jpg';
import Quest_8 from '../assets/quests/8.jpg';
import Quest_9 from '../assets/quests/9.jpg';
import Ticket from '../assets/ticket.jpg';
import { createContext, useContext } from 'react';
import { Text } from '@chakra-ui/react';

const BASE_DURATION = 30;
const BASE_COST = 10;

const QUEST_IMAGES = [Quest_1, Quest_2, Quest_3, Quest_4, Quest_5, Quest_6, Quest_7, Quest_8, Quest_9];

export const QUESTS: any[] = [
    // Basic
    {
        id: 1,
        type: 'basic',
        name: 'Scout the city',
        description: (
            <Text>
                You have been drawn to explore the city, hoping to uncover its secrets. The journey will take{' '}
                <span className="Weight-700 Time-Color">30 SECONDS</span> and will require{' '}
                <Text layerStyle="energy" as="span">
                    1 ENERGY
                </Text>{' '}
                to keep you focused on your path.
            </Text>
        ),
        requirements: {
            energy: BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 2 * BASE_COST,
            },
        ],
    },
    {
        id: 2,
        type: 'basic',
        name: 'Craft a compass',
        description: (
            <div>
                You have been drawn to explore the city, hoping to uncover its secrets. The journey will take{' '}
                <span className="Weight-700 Time-Color">30 SECONDS</span> and will require{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> to keep you focused on your path.
            </div>
        ),
        requirements: {
            energy: 2 * BASE_COST,
        },
        duration: 2 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 4 * BASE_COST,
            },
        ],
    },
    {
        id: 3,
        type: 'basic',
        name: 'Reach the high point',
        description: (
            <div>
                You feel disoriented after reaching a crossroads and you need to craft a compass to find your way. It
                will take <span className="Weight-700 Time-Color">30 SECONDS</span> and{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> to construct it.
            </div>
        ),
        requirements: {
            energy: BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: BASE_COST,
            },
        ],
    },
    {
        id: 4,
        type: 'basic',
        name: 'Share tales of your travels',
        description: (
            <div>
                You feel disoriented after reaching a crossroads and you need to craft a compass to find your way. It
                will take <span className="Weight-700 Time-Color">30 SECONDS</span> and{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> to construct it.
            </div>
        ),
        requirements: {
            energy: 2 * BASE_COST,
        },
        duration: 2 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 2 * BASE_COST,
            },
        ],
    },

    // Exchange
    {
        id: 5,
        type: 'exchange',
        name: 'Meet the vendor',
        description: (
            <div>
                After <span className="Weight-700 Time-Color">45 SECONDS</span> of exploring the city, you come across
                an old vendor and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> for the blueprints of
                Menhir. In order to decipher the blueprints you use{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> to reveal the location of an ancient artifact.
            </div>
        ),
        requirements: {
            herbs: 2 * BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'energy',
                name: 'Focus',
                value: BASE_COST / 2,
            },
        ],
    },
    {
        id: 6,
        type: 'exchange',
        name: 'Shady silhouette',
        description: (
            <div>
                After <span className="Weight-700 Time-Color">45 SECONDS</span> of exploring the city, you come across
                an old vendor and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> for the blueprints of
                Menhir. In order to decipher the blueprints you use{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> to reveal the location of an ancient artifact.
            </div>
        ),
        requirements: {
            gems: BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'energy',
                name: 'Focus',
                value: BASE_COST / 2,
            },
        ],
    },

    // Essence
    {
        id: 7,
        type: 'essence',
        name: 'Ancient mine diagram',
        description: (
            <div>
                After <span className="Weight-700 Time-Color">45 SECONDS</span> of exploring the city, you come across
                an old vendor and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> for the blueprints of
                Menhir. In order to decipher the blueprints you use{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> to reveal the location of an ancient artifact.
            </div>
        ),
        requirements: {
            energy: 2 * BASE_COST,
            herbs: 4 * BASE_COST,
            gems: 2 * BASE_COST,
        },
        duration: 3 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 1,
            },
        ],
    },
    {
        id: 8,
        type: 'essence',
        name: 'The labyrinth treasure',
        description: (
            <div>
                After <span className="Weight-700 Time-Color">45 SECONDS</span> of exploring the city, you come across
                an old vendor and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> for the blueprints of
                Menhir. In order to decipher the blueprints you use{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> to reveal the location of an ancient artifact.
            </div>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
        },
        duration: 6 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 2,
            },
        ],
    },

    // Final
    {
        id: 9,
        type: 'final',
        isFinal: true,
        name: 'Adraka narcotic',
        description: (
            <div>
                You use up <span className="Weight-700 Energy-Color">1 ENERGY</span> to guide yourself through the
                winding streets for <span className="Weight-700 Time-Color">60 SECONDS</span>. You encounter a secret
                society and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> for a unique item. It takes{' '}
                <span className="Weight-700 Essence-Color">1 ESSENCE OF THE DESERT</span> to safely transport the vessel
                to safety.
            </div>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
            essence: (2 * BASE_COST) / 10,
        },
        duration: 60,
        rewards: [
            {
                resource: 'tickets',
                name: 'Home X Ticket',
                value: 1,
            },
        ],
    },
];

export const getQuest = (id = 1) => {
    return QUESTS.find((m) => m.id === id);
};

export const getQuestImage = (id: number) => QUEST_IMAGES[id - 1];

export const meetsRequirements = (resources: { [x: string]: number }, questId: number | undefined) => {
    const quest = getQuest(questId);

    if (!quest) {
        return false;
    }

    const keys = Object.keys(quest.requirements);

    return keys.every((key) => resources[key] >= quest.requirements[key]);
};

export interface QuestsContextType {
    quest: any;
    setQuest: React.Dispatch<any>;
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState(getQuest());
    return <QuestsContext.Provider value={{ quest, setQuest }}>{children}</QuestsContext.Provider>;
};
