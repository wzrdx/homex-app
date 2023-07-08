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

import { createContext, useContext } from 'react';
import { Text } from '@chakra-ui/react';
import { Quest } from '../types';

import SmokeAndClouds from '../assets/quests/videos/1.webm';
import LightRays from '../assets/quests/videos/3-1.webm';
import DesertSmoke from '../assets/quests/videos/8-1.webm';
import Particles from '../assets/quests/videos/particles.webm';

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

const getId = () => ++ID;

export const QUESTS: any[] = [
    // Herbalism
    {
        id: getId(),
        type: 'herbalism',
        name: 'Frozen Summit',
        description: (
            <Text layerStyle="questDescription">
                Scale the treacherous Frozen Peak, where icy winds howl relentlessly. Seek the legendary Frostbite Flower, a
                rare bloom said to possess healing properties. Brave freezing temperatures and overcome icy challenges to
                retrieve the flower.
            </Text>
        ),
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
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_1,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: 'Windswept',
        description: (
            <Text layerStyle="questDescription">
                Ascend the towering rocky hill, perched at great heights where fierce winds reign. Inspired by ancient
                architects, brave citizens constructed wind power plants harnessing the gusts' might. These plants generate
                vital energy, sustaining the entire planet. Your mission is to retrieve the coveted Turbine Sketches, the
                blueprints that reveal the secrets of these ingenious wind turbines.
            </Text>
        ),
        requirements: {
            energy: 6 * BASE_COST,
        },
        duration: 6 * 1.25 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 12 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: SmokeAndClouds,
                mode: 'normal',
            },
        ],
        image: Quest_2,
    },

    // Jewelcrafting
    {
        id: getId(),
        type: 'jewelcrafting',
        name: 'Antrum Region',
        description: (
            <Text layerStyle="questDescription">
                Venture into the vast Antrum Region, a cavernous mountain housing a bustling city. Millions rely on a narcotic
                air, generated from the depths, to survive. Your mission is to secure the elusive Narcotic of the Caves,
                essential for sustaining life underground.
            </Text>
        ),
        requirements: {
            energy: 1 * BASE_COST,
        },
        duration: BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 1 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_3,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: "Avalon's Embrace",
        description: (
            <Text layerStyle="questDescription">
                Journey to the majestic Avalon Range, a realm of towering peaks and breathtaking vistas. Ascend the mythical
                peak known as Mount Celestia, where the fabled Celestial Scepter is said to reside. Conquer perilous trails,
                face elemental trials, and claim the scepter.
            </Text>
        ),
        requirements: {
            energy: 6 * BASE_COST,
        },
        duration: 6 * 1.25 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 6 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_4,
    },

    // Enchanting
    {
        id: getId(),
        type: 'enchanting',
        name: 'Cavesong Orb',
        description: (
            <Text layerStyle="questDescription">
                Explore the enigmatic Singing Cave, where mystical winds create ethereal melodies. A slumbering ancient creature
                dwells within the mountain's depths. Retrieve the Cavesong Orb, said to hold the essence of the cave's
                enchanting melody.
            </Text>
        ),
        requirements: {
            energy: 8 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 8 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 4 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_5,
    },
    {
        id: getId(),
        type: 'enchanting',
        name: 'Crystal Caravan',
        description: (
            <Text layerStyle="questDescription">
                Join the Crystal Caravan on a perilous journey through rugged mountain terrain. Safeguard the precious cargo of
                sparkling crystals and rare items destined for the bustling market of Menhir.
            </Text>
        ),
        requirements: {
            energy: 16 * BASE_COST,
        },
        duration: 16 * 1.25 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 16 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 8 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_6,
    },

    // Divination
    {
        id: getId(),
        type: 'divination',
        name: 'Mountain Harvest',
        description: (
            <Text layerStyle="questDescription">
                Embark on a quest to gather the exotic mountain items. Traverse the steep slopes and hidden valleys to find rare
                treasures. From the revitalizing Evergreen Moss to the soothing Moonshadow stones, collect a diverse assortment.
                Return to the mountain village and trade these valuable artifacts for rare potions, enchanted talismans, or
                other coveted items.
            </Text>
        ),
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
                value: 1.5 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: SmokeAndClouds,
                mode: 'normal',
            },
        ],
        image: Quest_7,
    },
    {
        id: getId(),
        type: 'divination',
        name: "Traveler's Bounty",
        description: (
            <Text layerStyle="questDescription">
                Embark on a quest to recover ancient relics hidden within the majestic mountain range. Explore forgotten
                temples, treacherous caves, and crumbling ruins to find these valuable artifacts. Return to Menhir and engage in
                a lively trade, offering these remarkable relics to collectors, scholars, and adventurers seeking their hidden
                powers.
            </Text>
        ),
        requirements: {
            energy: 12 * BASE_COST,
            herbs: 12 * BASE_COST,
            gems: 6 * BASE_COST,
        },
        duration: 6 * 1.25 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 4.5 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_8,
    },

    // Alchemy
    {
        id: getId(),
        type: 'alchemy',
        name: 'Mountain Sage Smoke',
        description: (
            <Text layerStyle="questDescription">
                Embark on a daring journey up Almur Mount, a majestic peak covered in lush vegetation. Seek out the sacred
                Mountain Sage, a powerful plant that purifies the air. Traverse treacherous trails, conquer rugged terrain, and
                retrieve the herb to bring its cleansing essence to the mountain dwellers.
            </Text>
        ),
        requirements: {
            energy: 30 * BASE_COST,
        },
        duration: 24 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 48 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'overlay',
            },
        ],
        image: Quest_9,
    },
    {
        id: getId(),
        type: 'alchemy',
        name: 'Frost Crystal',
        description: (
            <Text layerStyle="questDescription">
                Explore the hidden realm of Glacial Peaks, where icy wonders await. Your mission is to retrieve the legendary
                Frost Crystal, a rare artifact with the power to freeze and purify water. Journey through icy tunnels, conquer
                frosty challenges, and claim the crystal. Return to Menhir and use its magic to restore purity to frozen
                springs.
            </Text>
        ),
        requirements: {
            energy: 30 * BASE_COST,
        },
        duration: 24 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 24 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_10,
    },
    {
        id: getId(),
        type: 'alchemy',
        name: 'Cherry Pilgrimage',
        description: (
            <Text layerStyle="questDescription">
                Scale the frozen heights of Pilgrims Peak, braving snowstorms on a sacred journey. Reach the summit's temple,
                where a blooming cherry tree stands. Retrieve the cherished Mountain Cherry Ritual, igniting the fragrant wood
                to foster serenity and connection during pilgrims' rituals.
            </Text>
        ),
        requirements: {
            energy: 48 * BASE_COST,
            herbs: 48 * BASE_COST,
            gems: 24 * BASE_COST,
        },
        duration: 18 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 18 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'plus-lighter',
            },
        ],
        image: Quest_11,
    },
    {
        id: getId(),
        type: 'alchemy',
        name: 'Volcanic Ashstone',
        description: (
            <Text layerStyle="questDescription">
                Brave the towering Ramad Volcano, a majestic formation with periodic lava eruptions. Harvesting the lava through
                mechanized grooves provides continuous energy for Menhir. Your mission is to obtain the coveted Ashstone, a
                stone infused with compacted volcanic ash.
            </Text>
        ),
        requirements: {
            energy: 84 * BASE_COST,
        },
        duration: 24 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 32 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 16 * BASE_REWARD,
            },
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 8 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'soft-light',
            },
        ],
        image: Quest_12,
    },

    // Final
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: 'Crystal Blade',
        description: (
            <Text layerStyle="questDescription">
                Retrieve the Crystal Blade artifact guarded by the harsh winds in the treacherous mountain pass. Use your skills
                to navigate the dangerous terrain and overcome obstacles to acquire the powerful weapon and bring it back to the
                city to contribute to its rebirth.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 16 * BASE_COST,
            gems: 8 * BASE_COST,
            essence: 4 * BASE_COST,
        },
        duration: 18 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 1,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_13,
    },
    // {
    //     id: getId(),
    //     type: 'final',
    //     isFinal: true,
    //     name: "Frostfall's Embrace",
    //     description: (
    //         <Text layerStyle="questDescription">
    //             In the unforgiving, icy expanse of Sundsten, a jewel resides deep within the heart of the Frostbound Wyrm.
    //             Venture into this frozen wasteland, slay the sacred beast and retrieve the jewel for the glory of Menhir.
    //         </Text>
    //     ),
    //     requirements: {
    //         energy: 266 * BASE_COST,
    //         herbs: 67 * BASE_COST,
    //         gems: 34 * BASE_COST,
    //         essence: 16 * BASE_COST,
    //     },
    //     duration: 8 * BASE_DURATION,
    //     rewards: [
    //         {
    //             resource: 'tickets',
    //             name: 'Tickets',
    //             value: 1,
    //         },
    //     ],
    //     layers: [
    //         {
    //             source: SmokeAndClouds,
    //             mode: 'normal',
    //         },
    //     ],
    //     image: Quest_14,
    // },
    // {
    //     id: getId(),
    //     type: 'final',
    //     isFinal: true,
    //     name: 'Veil of Visions',
    //     description: (
    //         <Text layerStyle="questDescription">
    //             Uncover the ethereal mysteries of the future by consuming the sacred white dust, Cocaineum Sanctum. This rare
    //             substance grants a temporary surge of stamina and energy, unlocking fleeting visions of the future. Seek out
    //             this divine natural resource within the frozen regions of Sundsten. Use with caution as it can cause addiction.
    //         </Text>
    //     ),
    //     requirements: {
    //         energy: 2 * 266 * BASE_COST,
    //         herbs: 2 * 67 * BASE_COST,
    //         gems: 2 * 34 * BASE_COST,
    //         essence: 2 * 16 * BASE_COST,
    //     },
    //     duration: 4 * BASE_DURATION,
    //     rewards: [
    //         {
    //             resource: 'tickets',
    //             name: 'Tickets',
    //             value: 2,
    //         },
    //     ],
    //     layers: [
    //         {
    //             source: LightRays,
    //             mode: 'normal',
    //         },
    //     ],
    //     image: Quest_15,
    // },
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
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState<Quest>(getQuest());
    const [ongoingQuests, setOngoingQuests] = useState<OngoingQuest[]>([]);

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
        <QuestsContext.Provider value={{ quest, setQuest, ongoingQuests, getOngoingQuests }}>{children}</QuestsContext.Provider>
    );
};
