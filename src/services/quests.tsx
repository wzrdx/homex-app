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
import { createContext, useContext } from 'react';
import { Text } from '@chakra-ui/react';
import { Quest } from '../shared/types';

const BASE_DURATION = 1;
const BASE_COST = 1;
export const QUEST_DURATION_INTERVAL = 'minute';

const QUEST_IMAGES = [Quest_1, Quest_2, Quest_3, Quest_4, Quest_5, Quest_6, Quest_7, Quest_8, Quest_9];

export const QUESTS: any[] = [
    // Basic
    {
        id: 1,
        type: 'basic',
        name: 'Explore',
        description: (
            <Text layerStyle="questDescription">
                Uncover the city's secrets through a daring expedition, conquering obstacles and discovering hidden
                treasures. Preserve your energy to unearth ancient artifacts and unravel mysteries.
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
        name: 'Stellarforge',
        description: (
            <Text layerStyle="questDescription">
                Illuminate the path ahead by constructing a celestial lantern, harnessing the power of the stars.
                Dedicate your energy and time to this intricate task, for its radiant glow will reveal hidden treasures
                and guide you through the darkness.
            </Text>
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
        id: 3,
        type: 'basic',
        name: 'Beneath the Depths',
        description: (
            <Text layerStyle="questDescription">
                You dare to venture into the labyrinthine underworld beneath the city. Navigate twisting tunnels and
                unravel cryptic puzzles to discover forgotten relics. Your courage and wit shall reveal the ancient
                mysteries concealed in the depths, rewarding those who dare to explore.
            </Text>
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
        id: 4,
        type: 'basic',
        name: 'Taleweaver',
        description: (
            <Text layerStyle="questDescription">
                Embark on a quest to captivate the hearts and minds of the people of Menhir with your exciting stories.
                Gather a crowd, enthralling them with tales of your daring exploits and mesmerizing adventures. In
                return for your storytelling prowess, be rewarded with gleaming gems as a token of their appreciation.
            </Text>
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
        name: 'Whispering Bargain',
        description: (
            <Text layerStyle="questDescription">
                In the city's depths, you chance upon an enigmatic creature, the Whispering Sentinel. It promises hidden
                knowledge if you part with a precious possession. The choice is yours: risk loss for potential gain.
            </Text>
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
        name: 'Marketplace Encounter',
        description: (
            <Text layerStyle="questDescription">
                Within the hidden marketplace, you stumble upon a mystical stall. Bartering your possessions, you
                acquire a potent elixir, invigorating your spirit. The transaction bestows newfound vitality, fueling
                your path ahead.
            </Text>
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
        name: 'Lost Mine',
        description: (
            <Text layerStyle="questDescription">
                You embark on a perilous quest to recover a forgotten artifact hidden in treacherous ruins. Overcoming
                daunting obstacles and displaying unwavering resolve, you'll secure the long-lost relic and attain a
                valuable essence as your reward.
            </Text>
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
        name: 'Enchanted Sanctuary',
        description: (
            <Text layerStyle="questDescription">
                Exploring the uncharted realms of the outside world, you chance upon a forgotten sanctuary veiled in
                mystery. Overcoming perilous trials and deciphering cryptic clues, you unearth an ancient artifact of
                profound significance.
            </Text>
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
        name: 'The Sacred Scarab',
        description: (
            <Text layerStyle="questDescription">
                You discovered the Sacred Scarab, a powerful artifact hidden in a desert temple. It is guarded by a
                powerful sandstorm so use your resources to face it and retrieve the artifact back to the Monolith.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
            essence: (2 * BASE_COST) / 10,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Ticket',
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
    quest: Quest;
    setQuest: React.Dispatch<Quest>;
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState<Quest>(getQuest());
    return <QuestsContext.Provider value={{ quest, setQuest }}>{children}</QuestsContext.Provider>;
};
