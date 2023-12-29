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
import Quest_17 from '../assets/quests/17.png';
import Quest_18 from '../assets/quests/18.png';
import Quest_19 from '../assets/quests/19.png';
import Quest_20 from '../assets/quests/20.png';
import Quest_21 from '../assets/quests/21.png';
import Quest_22 from '../assets/quests/22.png';
import Quest_23 from '../assets/quests/23.png';
import Quest_24 from '../assets/quests/24.png';

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

const QUEST_IMAGES = [
    Quest_1,
    Quest_2,
    Quest_3,
    Quest_4,
    Quest_5,
    Quest_6,
    Quest_7,
    Quest_8,
    Quest_9,
    Quest_10,
    Quest_11,
    Quest_12,
    Quest_13,
    Quest_14,
    Quest_15,
    Quest_16,
    Quest_17,
    Quest_18,
    Quest_19,
    Quest_20,
    Quest_21,
    Quest_22,
    Quest_23,
    Quest_24,
];

let ID = 0;

const BASE_DURATION = 60; // minutes
const BASE_COST = 16;
const BASE_REWARD = 14;

const XP_MULTIPLIER = 10;

const ESSENCE_HANDICAP = 2;
const MISSIONS_MULTIPLIER = 1.3;

const getId = () => ++ID;

const LORE: {
    title: string;
    description: string;
}[] = [
    {
        title: 'Desert Bloom',
        description:
            "Explore the outskirts of Menhir to discover rare desert herbs. Collect them and deliver to the city's alchemists, who will use their properties to enhance the soil and promote agricultural growth.",
    },
    {
        title: 'Guardian of the Sands',
        description:
            "Investigate reports of a mythical desert creature disrupting herb cultivation. Track and befriend the creature to guard the city's herb gardens, ensuring a bountiful harvest.",
    },
    {
        title: 'Celestial Harvest',
        description:
            'Align with the celestial calendar by gathering herbs under specific planetary alignments. Craft a sacred potion that, when consumed during rituals, enhances the connection between the citizens and their gods.',
    },
    {
        title: 'Mirage Medicine',
        description:
            "Uncover the secrets of elusive mirage herbs said to have extraordinary healing properties. Create potent medicines to treat ailments and bolster the city's health.",
    },
    {
        title: 'Whispering Winds',
        description:
            "Navigate the desert's shifting dunes to find a rare herb affected by the winds. Extract its essence to create incense, used in rituals to commune with the desert spirits and seek their guidance for the city's prosperity.",
    },
    {
        title: 'Gleaming Foundations',
        description:
            "Explore the desert mines to gather rare gems. Use them to enchant the city's foundational stones, enhancing the durability and mystical properties of Menhir's buildings.",
    },
    {
        title: 'Luminous Architectures',
        description:
            "Harness the power of radiant gems to craft enchanting lanterns. Illuminate Menhir's streets with these mystical lights, creating a mesmerizing ambiance and attracting positive energy.",
    },
    {
        title: 'Crystal Spires Rising',
        description:
            "Venture into the depths of the desert to extract precious crystals. Forge towering spires adorned with these crystals, elevating the city's skyline and harnessing their magical energies for prosperity.",
    },
    {
        title: 'Eternal Sands Sanctuary',
        description:
            'Seek out a hidden oasis adorned with rare gems. Collect these gems to construct a serene sanctuary in the heart of Menhir, a place where citizens can find solace and connection with the desert spirits.',
    },
    {
        title: 'Gemstone Guardians',
        description:
            "Craft animated guardians using enchanted gems to protect the city's buildings from harm. Empower these constructs to ward off any threats and maintain the integrity of Menhir's structures.",
    },
    {
        title: 'Whispers of the Oracle',
        description:
            "Tap into the ancient art of divination to unveil hidden truths. Visit the city oracle and assist in conducting a powerful divination ritual, revealing insights that guide the city's leaders in making wise decisions.",
    },
    {
        title: 'Ethereal Infusion',
        description:
            "Enter the mystic chambers within the city's heart and channel ethereal essences into the central energy conduit. Enhance the city's power grid, providing a steady and harmonious flow of energy to every corner of Menhir.",
    },
    {
        title: 'Serenity in the Sanctum',
        description:
            'Visit the Tranquil Sanctum, a sacred space dedicated to divination. Assist the priests in performing a ritual to bring peace and serenity to the city, dispelling negative energies and fostering a sense of unity among the citizens.',
    },
    {
        title: 'Dreamweaver',
        description:
            "Collaborate with the Dreamweaver's Guild to enhance the citizens' dreams through divination. Conduct a ceremonial ritual in the pavilion, amplifying positive visions that inspire creativity and innovation among the populace.",
    },
    {
        title: 'Celestial Clockwork',
        description:
            'Visit the observatory and align the Celestial Clock with the cosmic energies. By attuning the clock to celestial rhythms, ensure that the city benefits from auspicious alignments, bringing prosperity and good fortune to Menhir.',
    },
    {
        title: 'Mystic Mirage Brew',
        description:
            "Source elusive mirage herbs and blend them with crystal-clear spring water. Craft a mystic potion that grants temporary invisibility, aiding the city's covert operations and safeguarding its secrets.",
    },
    {
        title: 'Sandstorm Sustenance',
        description:
            "Venture into the heart of a sandstorm to collect unique ingredients. Brew a specialized potion that shields the city from the adverse effects of sandstorms, ensuring the safety of Menhir's inhabitants.",
    },
    {
        title: 'Celestial Harmony Elixir',
        description:
            'Harness the power of celestial herbs and rare gems to create a harmonizing elixir. Conduct an intricate brewing process, producing a potion that fosters unity and cooperation among the citizens, promoting a harmonious community.',
    },
    {
        title: "Altar's Foundation",
        description:
            "Lay the groundwork for the Altar's construction by gathering sacred stones and rare minerals. Collaborate with skilled builders to ensure the structural integrity, while simultaneously performing an intricate consecration ritual. Channel the desert's energy into the foundation, imbuing the Altar with the blessings of the land.",
    },
    {
        title: 'Aegis of Sanctity',
        description:
            'As the Altar takes shape, embark on a quest to procure enchanted gems and mystical artifacts. Craft protective wards and symbols to adorn the Altar, safeguarding it from malevolent forces. Consecrate each protective element with a series of rituals, invoking the desert spirits to instill a divine shield around the sacred structure.',
    },
    {
        title: 'Celestial Convergence',
        description:
            "Continuously attune the Altar to the celestial energies by regularly visiting the Astral Observatory. Perform recurring rituals during specific celestial alignments to renew and enhance the Altar's connection with the cosmos. This ongoing commitment ensures that the Altar remains a focal point of divine energy, radiating blessings upon Menhir and its inhabitants.",
    },
    {
        title: 'Rituals of the Eternal Sands',
        description:
            "Venture into the heart of the desert to gather the rarest herbs, mine precious gems, and attune yourself to the celestial energies. Collaborate with the city's alchemists, jewelcrafters, diviners, and master the ancient rituals in a grand ceremony at the city's core.",
    },
    {
        title: 'Labyrinth of Mysteries',
        description:
            "A mystical labyrinth has emerged beneath Menhir, and only a true hero can navigate its twists and turns. Combine the powers of alchemy, jewelcrafting, divination, and herbalism to unlock the labyrinth's secrets. Brew potions to reveal hidden passages, use enchanted gems to illuminate the way, and consult oracles to decipher cryptic inscriptions.",
    },
    {
        title: 'Desert Ascendance',
        description:
            "The city is on the brink of a transformation, and it falls upon you to ascend to the highest peak of the desert. Merge the wisdom of herbalism, the mystique of divination, the craftsmanship of jewelcrafting, and the alchemical prowess to reach the summit. Encounter ancient spirits and prove your worthiness by creating an elixir that merges the essence of the desert, celestial energies, and the city's resilience. The climactic finale awaits as you shape the destiny of Menhir through unparalleled trials and triumphs.",
    },
];

const XP = [
    // Herbalism
    XP_MULTIPLIER * 1.1,
    XP_MULTIPLIER * 1.2,
    XP_MULTIPLIER * 1.3,
    XP_MULTIPLIER * 1.4,
    XP_MULTIPLIER * 1.5,
    // Jewelcrafting
    XP_MULTIPLIER * 1.1,
    XP_MULTIPLIER * 1.2,
    XP_MULTIPLIER * 1.3,
    XP_MULTIPLIER * 1.4,
    XP_MULTIPLIER * 1.5,
    // Divination
    4 * XP_MULTIPLIER * 1.1,
    4 * XP_MULTIPLIER * 1.2,
    4 * XP_MULTIPLIER * 1.3,
    4 * XP_MULTIPLIER * 1.4,
    4 * XP_MULTIPLIER * 1.5,
    // Alchemy
    8 * XP_MULTIPLIER * 1.1,
    8 * XP_MULTIPLIER * 1.2,
    8 * XP_MULTIPLIER * 1.3,
    // Consecration
    25 * XP_MULTIPLIER * 1.1,
    25 * XP_MULTIPLIER * 1.2,
    25 * XP_MULTIPLIER * 1.3,
    // Missions
    10 * XP_MULTIPLIER,
    20 * XP_MULTIPLIER,
    30 * XP_MULTIPLIER,
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
        image: QUEST_IMAGES[0],
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
        image: QUEST_IMAGES[1],
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
        image: QUEST_IMAGES[2],
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
        image: QUEST_IMAGES[3],
    },
    {
        id: getId(),
        type: 'herbalism',
        name: LORE[4].title,
        description: <Text layerStyle="questDescription">{LORE[4].description}</Text>,
        requirements: {
            energy: 48 * BASE_COST,
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 96 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[4],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[4],
    },

    // Jewelcrafting
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[5].title,
        description: <Text layerStyle="questDescription">{LORE[5].description}</Text>,
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
                value: XP[5],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[5],
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[6].title,
        description: <Text layerStyle="questDescription">{LORE[6].description}</Text>,
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
                value: XP[6],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[6],
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[7].title,
        description: <Text layerStyle="questDescription">{LORE[7].description}</Text>,
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
                value: XP[7],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[7],
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[8].title,
        description: <Text layerStyle="questDescription">{LORE[8].description}</Text>,
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
                value: XP[8],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[8],
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: LORE[9].title,
        description: <Text layerStyle="questDescription">{LORE[9].description}</Text>,
        requirements: {
            energy: 48 * BASE_COST,
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 48 * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[9],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[9],
    },

    // Divination
    {
        id: getId(),
        type: 'divination',
        name: LORE[10].title,
        description: <Text layerStyle="questDescription">{LORE[10].description}</Text>,
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
                value: XP[10],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[10],
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[11].title,
        description: <Text layerStyle="questDescription">{LORE[11].description}</Text>,
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
                value: XP[11],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[11],
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[12].title,
        description: <Text layerStyle="questDescription">{LORE[12].description}</Text>,
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
                value: XP[12],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[12],
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[13].title,
        description: <Text layerStyle="questDescription">{LORE[13].description}</Text>,
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
                value: XP[13],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[13],
    },
    {
        id: getId(),
        type: 'divination',
        name: LORE[14].title,
        description: <Text layerStyle="questDescription">{LORE[14].description}</Text>,
        requirements: {
            energy: 96 * BASE_COST,
            herbs: 96 * BASE_COST,
            gems: 48 * BASE_COST,
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 24 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[14],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[14],
    },

    // Alchemy
    {
        id: getId(),
        type: 'alchemy',
        name: LORE[15].title,
        description: <Text layerStyle="questDescription">{LORE[15].description}</Text>,
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
                value: XP[15],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[15],
    },
    {
        id: getId(),
        type: 'alchemy',
        name: LORE[16].title,
        description: <Text layerStyle="questDescription">{LORE[16].description}</Text>,
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
                value: XP[16],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[16],
    },
    {
        id: getId(),
        type: 'alchemy',
        name: LORE[17].title,
        description: <Text layerStyle="questDescription">{LORE[17].description}</Text>,
        requirements: {
            energy: 3 * 3 * 96 * BASE_COST,
        },
        duration: 12 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 96 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 48 * BASE_REWARD,
            },
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 24 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[17],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[17],
    },

    // Consecration
    {
        id: getId(),
        type: 'consecration',
        name: LORE[18].title,
        description: <Text layerStyle="questDescription">{LORE[18].description}</Text>,
        requirements: {
            energy: 2 * 6 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: (12 / 2) * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: (6 / 2) * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[18],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[18],
    },
    {
        id: getId(),
        type: 'consecration',
        name: LORE[19].title,
        description: <Text layerStyle="questDescription">{LORE[19].description}</Text>,
        requirements: {
            energy: 2 * 12 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: (24 / 2) * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: (12 / 2) * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[19],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[19],
    },
    {
        id: getId(),
        type: 'consecration',
        name: LORE[20].title,
        description: <Text layerStyle="questDescription">{LORE[20].description}</Text>,
        requirements: {
            energy: 2 * 24 * BASE_COST,
        },
        duration: 12 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: (48 / 2) * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: (24 / 2) * BASE_REWARD,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[20],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[20],
    },

    // Missions
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: LORE[21].title,
        description: <Text layerStyle="questDescription">{LORE[21].description}</Text>,
        requirements: {
            energy: Math.round(MISSIONS_MULTIPLIER * 16 * BASE_COST),
            herbs: Math.round(MISSIONS_MULTIPLIER * 32 * BASE_COST),
            gems: Math.round(MISSIONS_MULTIPLIER * 16 * BASE_COST),
            essence: Math.round(MISSIONS_MULTIPLIER * 12 * BASE_COST),
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
                value: XP[21],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[21],
    },
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: LORE[22].title,
        description: <Text layerStyle="questDescription">{LORE[22].description}</Text>,
        requirements: {
            energy: Math.round(MISSIONS_MULTIPLIER * 2 * 16 * BASE_COST),
            herbs: Math.round(MISSIONS_MULTIPLIER * 2 * 32 * BASE_COST),
            gems: Math.round(MISSIONS_MULTIPLIER * 2 * 16 * BASE_COST),
            essence: Math.round(MISSIONS_MULTIPLIER * 2 * 12 * BASE_COST),
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
                value: XP[22],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[22],
    },
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: LORE[23].title,
        description: <Text layerStyle="questDescription">{LORE[23].description}</Text>,
        requirements: {
            energy: Math.round(MISSIONS_MULTIPLIER * 3 * 16 * BASE_COST),
            herbs: Math.round(MISSIONS_MULTIPLIER * 3 * 32 * BASE_COST),
            gems: Math.round(MISSIONS_MULTIPLIER * 3 * 16 * BASE_COST),
            essence: Math.round(MISSIONS_MULTIPLIER * 3 * 12 * BASE_COST),
        },
        duration: 24 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 3,
            },
            {
                resource: 'xp',
                name: 'XP',
                value: XP[23],
            },
        ],
        layers: [],
        image: QUEST_IMAGES[23],
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
