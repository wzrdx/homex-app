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
import Quest_10 from '../assets/quests/10.jpg';
import Quest_11 from '../assets/quests/11.jpg';
import Quest_12 from '../assets/quests/12.jpg';
import Quest_13 from '../assets/quests/13.jpg';
import Quest_14 from '../assets/quests/14.jpg';
import Quest_15 from '../assets/quests/15.jpg';
import Quest_16 from '../assets/quests/16.jpg';

import { createContext, useContext } from 'react';
import { Text, useDisclosure } from '@chakra-ui/react';
import { Quest } from '../types';

import { OngoingQuest } from '../blockchain/types';
import { ResultsParser, ContractFunction, AddressValue, Address } from '@multiversx/sdk-core/out';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { API_URL } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { BigNumber } from 'bignumber.js';

let ID = 0;

const BASE_DURATION = 60; // minutes
const BASE_COST = 15;
const BASE_REWARD = 15;

const XP_MULTIPLIER = 10;

const ESSENCE_HANDICAP = 1;

const getId = () => ++ID;

const LORE: {
    title: string;
    description: string;
}[] = [
    {
        title: 'The Abandoned Base',
        description:
            'Begin your journey by stumbling upon an abandoned base deep within the Forest of Menhir, filled with mysteries and signs of past travelers.',
    },
    {
        title: 'The Enigmatic Map',
        description:
            'Discover an old, tattered map in the abandoned base, hinting at the location of a hidden dungeon. Uncover the secrets it holds.',
    },
    {
        title: 'Trail of Whispers',
        description:
            'Follow the cryptic clues on the map, leading you through the dense forest. Along the way, you receive mysterious buffs that enhance your skills.',
    },
    {
        title: 'Guardian of the Ancient Grove',
        description:
            'Encounter the guardian of the ancient grove, a mystical creature who challenges you to prove your worthiness to continue your quest.',
    },
    {
        title: 'The Whispering Trees',
        description:
            'Navigate through the Whispering Trees, where the forest seems to come alive. Gain new abilities from the ancient spirits that inhabit this mystical place.',
    },
    {
        title: 'The Sylvan Blessing',
        description:
            'Receive the Sylvan Blessing, a powerful enchantment bestowed upon you by the spirits of the forest, enhancing your senses and agility.',
    },
    {
        title: 'The Hidden Pond',
        description:
            'Stumble upon a hidden pond deep within the forest. Its magical waters grant you the ability to breathe underwater and swim freely.',
    },
    {
        title: 'The Ethereal Bridge',
        description:
            'Cross the Ethereal Bridge, a mystical structure that defies gravity, granting you the power to levitate for a limited time.',
    },
    {
        title: "The Guardian's Riddle",
        description:
            'Encounter a guardian who presents you with a riddle. Solve it to gain access to the next stage of your journey.',
    },
    {
        title: "The Whisperer's Call",
        description:
            "Heed the Whisperer's Call, a haunting melody that leads you through a labyrinthine part of the forest, where time flows differently.",
    },
    {
        title: 'The Eclipsed Grove',
        description:
            'Enter the Eclipsed Grove, a place where day and night are in constant flux. Harness the power of both sun and moon.',
    },
    {
        title: 'The Celestial Observatory',
        description:
            'Ascend the Celestial Observatory, where ancient astronomers once studied the stars. Here, you unlock the ability to see hidden constellations.',
    },
    {
        title: 'The Spirit of the Forest',
        description:
            'Commune with the Spirit of the Forest, an ethereal being who imparts the ancient language of the forest, allowing you to communicate with its denizens.',
    },
    {
        title: 'The Luminescent Path',
        description: 'Walk the Luminescent Path, a trail of glowing flora that guides you to the heart of the forest.',
    },
    {
        title: "The Mythical Beast's Lair",
        description:
            'Finally, reach the lair of the Mythical Beast, a formidable creature guarding the dungeon entrance. You must summon all your newfound abilities to face this formidable foe.',
    },
    {
        title: "The Beast's Challenge",
        description:
            "Confront the Mythical Beast and engage in an epic battle. Use the buffs and knowledge you've gained throughout your journey to overcome this legendary adversary and claim the treasures hidden within the dungeon.",
    },
];

const XP = [
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    XP_MULTIPLIER,
    4 * XP_MULTIPLIER,
    4 * XP_MULTIPLIER,
    4 * XP_MULTIPLIER,
    4 * XP_MULTIPLIER,
    8 * XP_MULTIPLIER,
    8 * XP_MULTIPLIER,
    10 * XP_MULTIPLIER,
    20 * XP_MULTIPLIER,
];

export const QUESTS: any[] = [
    // Herbalism
    {
        id: getId(),
        type: 'herbalism',
        name: LORE[0].title,
        description: <Text layerStyle="questDescription">{LORE[0].description}</Text>,
        requirements: {
            energy: 1 * BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 2 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[0],
            },
        ],
        layers: [],
        image: Quest_1,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: LORE[1].title,
        description: <Text layerStyle="questDescription">{LORE[1].description}</Text>,
        requirements: {
            energy: 6 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 12 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[1],
            },
        ],
        layers: [],
        image: Quest_2,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: LORE[2].title,
        description: <Text layerStyle="questDescription">{LORE[2].description}</Text>,
        requirements: {
            energy: 12 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 24 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[2],
            },
        ],
        layers: [],
        image: Quest_3,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: LORE[3].title,
        description: <Text layerStyle="questDescription">{LORE[3].description}</Text>,
        requirements: {
            energy: 24 * BASE_COST,
        },
        duration: 12 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 48 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[3],
            },
        ],
        layers: [],
        image: Quest_4,
    },

    // Jewelcrafting
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[4].title,
        description: <Text layerStyle="questDescription">{LORE[4].description}</Text>,
        requirements: {
            energy: 1 * BASE_COST,
        },
        duration: 1 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 1 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[4],
            },
        ],
        layers: [],
        image: Quest_5,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[5].title,
        description: <Text layerStyle="questDescription">{LORE[5].description}</Text>,
        requirements: {
            energy: 6 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 6 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[5],
            },
        ],
        layers: [],
        image: Quest_6,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[6].title,
        description: <Text layerStyle="questDescription">{LORE[6].description}</Text>,
        requirements: {
            energy: 12 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 12 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[6],
            },
        ],
        layers: [],
        image: Quest_7,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[7].title,
        description: <Text layerStyle="questDescription">{LORE[7].description}</Text>,
        requirements: {
            energy: 24 * BASE_COST,
        },
        duration: 12 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 24 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[7],
            },
        ],
        layers: [],
        image: Quest_8,
    },

    // Divination
    {
        id: getId(),
        type: 'divination',
        name: LORE[8].title,
        description: <Text layerStyle="questDescription">{LORE[8].description}</Text>,
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 4 * BASE_COST,
            gems: 2 * BASE_COST,
        },
        duration: 2 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 1 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[8],
            },
        ],
        layers: [],
        image: Quest_9,
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[9].title,
        description: <Text layerStyle="questDescription">{LORE[9].description}</Text>,
        requirements: {
            energy: 12 * BASE_COST,
            herbs: 12 * BASE_COST,
            gems: 6 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 3 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[9],
            },
        ],
        layers: [],
        image: Quest_10,
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[10].title,
        description: <Text layerStyle="questDescription">{LORE[10].description}</Text>,
        requirements: {
            energy: 24 * BASE_COST,
            herbs: 24 * BASE_COST,
            gems: 12 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 6 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[10],
            },
        ],
        layers: [],
        image: Quest_11,
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[11].title,
        description: <Text layerStyle="questDescription">{LORE[11].description}</Text>,
        requirements: {
            energy: 48 * BASE_COST,
            herbs: 48 * BASE_COST,
            gems: 24 * BASE_COST,
        },
        duration: 12 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 12 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[11],
            },
        ],
        layers: [],
        image: Quest_12,
    },

    // Alchemy
    {
        id: getId(),
        type: 'alchemy',
        name: LORE[12].title,
        description: <Text layerStyle="questDescription">{LORE[12].description}</Text>,
        requirements: {
            energy: 96 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 48 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 24 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[12],
            },
        ],
        layers: [],
        image: Quest_13,
    },
    {
        id: getId(),
        type: 'alchemy',
        name: LORE[13].title,
        description: <Text layerStyle="questDescription">{LORE[13].description}</Text>,
        requirements: {
            energy: 3 * 96 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 48 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 24 * BASE_REWARD,
            },
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 12 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[13],
            },
        ],
        layers: [],
        image: Quest_14,
    },

    // Missions
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: LORE[14].title,
        description: <Text layerStyle="questDescription">{LORE[14].description}</Text>,
        requirements: {
            energy: Math.round(1.2 * 16 * BASE_COST),
            herbs: Math.round(1.2 * 32 * BASE_COST),
            gems: Math.round(1.2 * 16 * BASE_COST),
            essence: Math.round(1.2 * 12 * BASE_COST),
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 1,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[14],
            },
        ],
        layers: [],
        image: Quest_15,
    },
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: LORE[15].title,
        description: <Text layerStyle="questDescription">{LORE[15].description}</Text>,
        requirements: {
            energy: Math.round(1.2 * 2 * 16 * BASE_COST),
            herbs: Math.round(1.2 * 2 * 32 * BASE_COST),
            gems: Math.round(1.2 * 2 * 16 * BASE_COST),
            essence: Math.round(1.2 * 2 * 12 * BASE_COST),
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 2,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[15],
            },
        ],
        layers: [],
        image: Quest_16,
    },
];

export const getQuest = (id = 1): Quest => {
    return QUESTS.find((m) => m.id === id);
};

export const getQuestImage = (id: number) => QUESTS.find((quest) => quest.id === id).image;

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
    ongoingQuests: OngoingQuest[];
    getOngoingQuests: () => Promise<void>;
    isQuestsModalOpen: boolean;
    onQuestsModalOpen: () => void;
    onQuestsModalClose: () => void;
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState<Quest>(getQuest());
    const [ongoingQuests, setOngoingQuests] = useState<OngoingQuest[]>([]);
    const { isOpen: isQuestsModalOpen, onOpen: onQuestsModalOpen, onClose: onQuestsModalClose } = useDisclosure();

    const getOngoingQuests = async () => {
        const resultsParser = new ResultsParser();
        const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });

        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction('getOngoingQuests'),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getOngoingQuests');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const quests: Array<{
                id: BigNumber;
                end_timestamp: BigNumber;
            }> = amount?.valueOf();

            setOngoingQuests(
                map(quests, (quest) => ({
                    id: quest.id.toNumber(),
                    timestamp: new Date(quest.end_timestamp.toNumber() * 1000),
                }))
            );
        } catch (err) {
            console.error('Unable to call getOngoingQuests', err);
        }
    };

    return (
        <QuestsContext.Provider
            value={{
                quest,
                setQuest,
                ongoingQuests,
                getOngoingQuests,
                isQuestsModalOpen,
                onQuestsModalOpen,
                onQuestsModalClose,
            }}
        >
            {children}
        </QuestsContext.Provider>
    );
};
