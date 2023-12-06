import React, { useState } from 'react';
import Quest_1 from '../assets/quests/1.png';
import Quest_2 from '../assets/quests/2.png';
import Quest_3 from '../assets/quests/3.png';
import Quest_4 from '../assets/quests/4.png';
import Quest_5 from '../assets/quests/5.png';
import Quest_6 from '../assets/quests/6.png';
import Quest_7 from '../assets/quests/7.png';
import Quest_8 from '../assets/quests/8.png';
import Quest_9 from '../assets/quests/9.png';
import Quest_10 from '../assets/quests/10.png';
import Quest_11 from '../assets/quests/11.png';
import Quest_12 from '../assets/quests/12.png';
import Quest_13 from '../assets/quests/13.png';
import Quest_14 from '../assets/quests/14.png';
import Quest_15 from '../assets/quests/15.png';
import Quest_16 from '../assets/quests/16.png';

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

const XP_MULTIPLIER = 20;

const ESSENCE_HANDICAP = 1;

const getId = () => ++ID;

const LORE: {
    title: string;
    description: string;
}[] = [
    {
        title: "Desert's Whisper",
        description:
            'Begin your odyssey in the deserts of Menhir, where whispers in the wind beckon you toward ancient elemental artifacts yet to be unveiled.',
    },
    {
        title: "Mirage's Lure",
        description:
            'Encounter a mirage that conceals elusive artifacts, their nature obscured by the shifting sands that dance with the secrets of the desert.',
    },
    {
        title: "Sands' Elemental Hues",
        description:
            'Witness sands taking on elemental hues, guiding you to artifacts hidden beneath the surface of the ancient desert.',
    },
    {
        title: 'Oasis of Elemental',
        description:
            "Discover an oasis surrounded by elemental trials, where collecting the artifacts becomes a cryptic passage through the secrets of Menhir's sands.",
    },
    {
        title: 'Whispering Sands',
        description:
            'Traverse the Whispering Sands anew, each footstep echoing the ancient resonance of the elemental artifacts waiting to be unveiled.',
    },
    {
        title: 'Elemental Pillars',
        description:
            'Confront towering pillars rising from the sands, elemental artifacts intertwined with the destiny that unfolds in the enigmatic desert.',
    },
    {
        title: 'Mirage of Balance',
        description:
            'Stumble upon a mirage that hints at the delicate balance of ancient elemental artifacts, beckoning you to decipher their obscured purpose.',
    },
    {
        title: 'Mirage Redux',
        description:
            'Uncover an illusion within the mirage, where the elemental artifacts cast veiled shadows, challenging you to discern reality from the ethereal.',
    },
    {
        title: 'Elemental Labyrinth',
        description:
            "Listen to echoes within an elemental labyrinth, whispers guiding you toward the elusive artifacts scattered throughout Menhir's desert expanse.",
    },
    {
        title: "Dunes' Elemental",
        description:
            'Witness the elemental dance of the dunes, where sands reveal hidden artifacts, entwined in the rhythm of an enigmatic choreography.',
    },
    {
        title: 'Fateful Crossroads',
        description:
            'Reach a fateful crossroads where elements converge, each path leading to elemental artifacts that unlock cryptic destinies.',
    },
    {
        title: 'Elemental Compass',
        description:
            'Find an elemental compass pointing toward concealed artifacts, each artifact unlocking gateways to realms steeped in elemental mystery.',
    },
    {
        title: 'Mirage of the Citadel',
        description:
            'Discern a mirage concealing an elemental citadel, guarded by ancient forces and holding secrets of the elemental artifacts.',
    },
    {
        title: 'Shrouded Keepers',
        description:
            'Encounter shrouded keepers of the elements, ethereal guardians challenging your resolve to collect the elemental artifacts scattered through the desert.',
    },
    {
        title: "Whispers' Endings",
        description:
            "Hear elemental whispers foretelling enigmatic endings as you approach the heart of Menhir's desert, where sands conceal secrets of cryptic conclusions.",
    },
    {
        title: "Traveler's Legacy",
        description:
            "Conclude your odyssey as the traveler who gathered the elemental artifacts, leaving behind a legacy intertwined with the mysteries of Menhir's ancient sands.",
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
