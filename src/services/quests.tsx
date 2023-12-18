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

const XP_MULTIPLIER = 10;

const ESSENCE_HANDICAP = 1;

const getId = () => ++ID;

const LORE: {
    title: string;
    description: string;
}[] = [
    {
        title: 'Arctic Echoes',
        description:
            "Commence your journey in the frozen expanse of Menhir's arctic mountains, where echoes in the wind beckon toward ancient artifacts shrouded in mystery.",
    },
    {
        title: "Blizzard's Veil",
        description:
            'Confront a blizzard that veils elusive artifacts, their forms obscured by the swirling snow, dancing with the secrets of the Arctic heights.',
    },
    {
        title: "Frigid Artifacts' Embrace",
        description:
            "Witness the frigid landscape taking on hues of ancient artifacts, guiding your quest beneath the icy surface of Menhir's enigmatic mountains.",
    },
    {
        title: 'Frostbitten Trials',
        description:
            "Discover an icebound realm, a testing ground where collecting artifacts becomes a cryptic passage through the secrets of Menhir's Arctic peaks, overcoming the biting winds.",
    },
    {
        title: 'The Frozen Whispers',
        description:
            'Traverse the frozen wilderness, each step echoing the resonance of ancient artifacts hidden within the snowy expanse, waiting to be unveiled.',
    },
    {
        title: "Summit's Elemental Relics",
        description:
            "Ascend to the mountain's summit, where elemental relics emerge from the snow, intertwined with the destiny that unfolds in the enigmatic Arctic heights.",
    },
    {
        title: "Veiled Storm's Mirage",
        description:
            'Encounter a mirage within the storm, a fleeting vision that hints at the balance of ancient artifacts, challenging you to decipher their obscured purpose.',
    },
    {
        title: "The Storm's Whisper",
        description:
            'Uncover a whisper within the storm, where the elemental artifacts cast veiled shadows, challenging you to discern reality from the ethereal midst of the blizzard.',
    },
    {
        title: 'Icy Labyrinth of Echoes',
        description:
            "Listen to echoes within an icy labyrinth, whispers guiding you toward elusive artifacts scattered amidst Menhir's Arctic peaks, even as the storm rages.",
    },
    {
        title: 'Frosty Dance of Elements',
        description:
            'Witness the frosty dance of the elements, where snow reveals hidden artifacts, entwined in the rhythm of an enigmatic choreography.',
    },
    {
        title: 'Crossroads of Glacial Destiny',
        description:
            'Reach a crossroads where glaciers converge, each path leading to artifacts that unlock cryptic destinies, with snowstorms veiling the way.',
    },
    {
        title: 'The Frostbitten Compass',
        description:
            "Find a frostbitten compass pointing toward concealed artifacts, each revealing gateways to realms steeped in the mysteries of Menhir's Arctic heights.",
    },
    {
        title: 'Icy Citadel',
        description:
            'Discern a mirage concealing an icy citadel, guarded by ancient forces and holding secrets of the elemental artifacts amidst the Arctic storms.',
    },
    {
        title: 'Frostlings',
        description:
            'Encounter shrouded keepers of frost, ethereal guardians challenging your resolve to collect the ancient artifacts scattered amidst the Arctic tempests.',
    },
    {
        title: 'Whispers in the Ice',
        description:
            "Hear whispers of Arctic endings as you approach the heart of Menhir's frozen peaks, where snowstorms conceal secrets of cryptic conclusions.",
    },
    {
        title: 'Frost Legacy',
        description:
            "Finish your odyssey as the traveler who gathered the ancient artifacts, leaving behind a legacy intertwined with the mysteries of Menhir's Arctic heights, forever veiled in the icy winds.",
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
