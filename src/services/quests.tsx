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
import { Text, useDisclosure } from '@chakra-ui/react';
import { Quest } from '../types';

// import SmokeAndClouds from '../assets/quests/videos/1.webm';
// import LightRays from '../assets/quests/videos/3-1.webm';
// import DesertSmoke from '../assets/quests/videos/8-1.webm';
// import Particles from '../assets/quests/videos/particles.webm';

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
        name: 'The Spaceship',
        description: (
            <Text layerStyle="questDescription">
                Seek scattered starship fragments across the city. Gather vital pieces to mend the vessel's wounded hull. Each
                discovery fuels hope as Travelers venture through Ut wonders in a mission to cross into a parallel dimension.
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
        layers: [],
        image: Quest_1,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: 'Interdimensional',
        description: (
            <Text layerStyle="questDescription">
                Empowered by your restored starship, you transcend the cosmos, embarking on a perilous voyage into a parallel
                dimension. Now, as part of an unified crew, you face a divergent mission, distinct from your prior roles as
                Traveler.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_2,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: 'The Mission',
        description: (
            <Text layerStyle="questDescription">
                The mission was nothing short of audacious—a journey that transcended the boundaries of Earth itself. As the
                starship soared through the infinite abyss of space, your crew of intrepid explorers braced themselves for the
                unprecedented challenge that lay ahead. Their destination: Mars, the enigmatic crimson jewel of the cosmos.
                Their purpose: to pave the way for the imminent dawn of human colonization.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_3,
    },
    {
        id: getId(),
        type: 'herbalism',
        name: 'The Crew',
        description: (
            <Text layerStyle="questDescription">
                The crew stood united, a trio bound by purpose and determination. With only three souls aboard the vessel, each
                role held immense significance. The commander, a beacon of leadership, guided their path through the cosmic
                abyss. The first officer, skilled and resolute, ensured the smooth operation of their interstellar voyage. And
                the science officer, ever curious and analytical, delved into the mysteries of the cosmos, seeking answers that
                would shape their destiny and yourself.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_4,
    },

    // Jewelcrafting
    {
        id: getId(),
        type: 'jewelcrafting',
        name: 'The Monolith',
        description: (
            <Text layerStyle="questDescription">
                Bathed in the eerie glow of the Martian sun, the crew's eyes widened in awe as they stumbled upon an enigma that
                defied all reason. Before them stood a colossal monolith, an otherworldly sentinel that beckoned with silent
                allure. Towering over the desolate landscape, the monolith exuded an ethereal energy, its surface composed of a
                gleaming, unfamiliar alloy that defied earthly comprehension.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_5,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: 'The Martifacts',
        description: (
            <Text layerStyle="questDescription">
                Embark on a trade expedition across the rust-hued terrain of Mars. Unearth valuable Martian relics and exchange
                them with local settlers for vital resources. Unveil the secrets of this ancient planet as you barter your way
                to prosperity.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_6,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: 'The Stellar Harvest',
        description: (
            <Text layerStyle="questDescription">
                Venture into the breathtaking Martian highlands, where the atmosphere holds unique crystalline formations known
                as Atmosphere Gems. These exquisite gems, formed by the interaction of Mars' atmospheric gases, possess
                mesmerizing colors and unparalleled beauty. Brave rugged Martian landscapes, traverse treacherous canyons, and
                overcome atmospheric anomalies to gather these remarkable gems.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_7,
    },
    {
        id: getId(),
        type: 'jewelcrafting',
        name: 'The Red Market',
        description: (
            <Text layerStyle="questDescription">
                Join the Red Planet expedition on a daring mission to explore the mysteries of Mars. Collect samples of Martian
                rocks and soil and search for signs of life. Avoid sandstorms and make it back to the spaceship. Deliver the
                valuable data safely and earn the respect of the crew.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_8,
    },

    // Divination
    {
        id: getId(),
        type: 'divination',
        name: 'The Mining Operation',
        description: (
            <Text layerStyle="questDescription">
                Join the Martian Mining Operation on a lucrative venture to extract rare minerals from the depths of Mars. Drill
                through the hard crust and blast away obstacles. Protect the precious cargo of ores and metals from raiders and
                rival corporations. Deliver the valuable minerals safely and enjoy a hefty profit.
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
                value: 1 * BASE_REWARD,
            },
        ],
        layers: [],
        image: Quest_9,
    },
    {
        id: getId(),
        type: 'divination',
        name: 'The Cave',
        description: (
            <Text layerStyle="questDescription">
                With bated breath, the crew ventured forth, tracing the trail of inky black sludge that oozed from the enigmatic
                monolith. The path led them deep into an underground labyrinth, a hidden realm beneath the Martian surface. Each
                step echoed with a sense of foreboding as they descended further into the unknown, guided by the eerie glow of
                phosphorescent moss clinging to the damp cave walls. The air grew heavy with anticipation, their senses
                heightened by the faint whispers of ancient mysteries lurking just beyond their grasp.
            </Text>
        ),
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
                value: 3 * BASE_REWARD,
            },
        ],
        layers: [],
        image: Quest_10,
    },
    {
        id: getId(),
        type: 'divination',
        name: 'The Creators',
        description: (
            <Text layerStyle="questDescription">
                An enigmatic being emerged from the shadows, a fusion of man and machine. Its form, once human, now intertwined
                with cybernetic enhancements, spoke of a lineage that spanned eons. Time had sculpted this entity into a
                custodian, a sentinel entrusted with a purpose. It revealed that it had been patiently awaiting the day when
                humans would traverse the stars and set foot on Mars. The crew, humbled and awestruck, realized that they stood
                before an emissary of a forgotten epoch, a bridge between worlds that would shape the course of their mission
                and unravel the tapestry of their own existence.
            </Text>
        ),
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
                value: 6 * BASE_REWARD,
            },
        ],
        layers: [],
        image: Quest_11,
    },
    {
        id: getId(),
        type: 'divination',
        name: 'The Origins',
        description: (
            <Text layerStyle="questDescription">
                Their civilization, long gone but immortalized through the monoliths, had been the architects of life on Earth.
                With purposeful intent, they had scattered the seeds of existence across the cosmos, planting the spark of
                vitality on ten thousand other planets. Each monolith held the power to ignite life, fostering the emergence of
                diverse species and shaping the tapestry of the universe. The crew's mission, they realized, was not merely an
                act of exploration but a continuation of a profound legacy, entrusted with the guardianship of life's
                proliferation.
            </Text>
        ),
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
                value: 12 * BASE_REWARD,
            },
        ],
        layers: [],
        image: Quest_12,
    },

    // Alchemy
    {
        id: getId(),
        type: 'alchemy',
        name: 'The Choice',
        description: (
            <Text layerStyle="questDescription">
                Their collective gaze shifted from the desolate expanse of the cosmos to the dormant monoliths before them. It
                was a choice that held the power to reshape the very fabric of existence. Stay alone, isolated in the vastness
                of the universe, or embrace their destiny, becoming the catalysts for life on ten thousand worlds. In that
                pivotal moment, the crew would need to choose not only their own fate, but the destiny of an unfathomable
                multitude of worlds, forever intertwining their legacy with the grand tapestry of the cosmos.
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_13,
    },

    // Missions
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: 'Cosmic Harmony',
        description: (
            <Text layerStyle="questDescription">
                Return from Mars with the Cosmic Resonators. Activate them across Menhir to unleash a symphony of cosmic energy.
                Witness the city's transformation into a beacon of harmony and enlightenment. Embrace your interstellar journey
                and unlock Menhir's cosmic destiny.
            </Text>
        ),
        requirements: {
            energy: 16 * BASE_COST,
            herbs: 32 * BASE_COST,
            gems: 16 * BASE_COST,
            essence: 12 * BASE_COST,
        },
        duration: 8 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 1,
            },
        ],
        layers: [],
        image: Quest_14,
    },
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: 'The Return',
        description: (
            <Text layerStyle="questDescription">
                Embark on a mind-bending cosmic odyssey as you warp through space-time, guided by vivid visions from your
                Martian experiences. Carry the orb, a crystalline artifact infused with the essence of another world, to Menhir.
                Witness the merging of realms as the city awakens to its true destiny. Prepare for a transcendent journey that
                will reshape reality itself.
            </Text>
        ),
        requirements: {
            energy: 2 * 16 * BASE_COST,
            herbs: 2 * 32 * BASE_COST,
            gems: 2 * 16 * BASE_COST,
            essence: 2 * 12 * BASE_COST,
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Tickets',
                value: 2,
            },
        ],
        layers: [],
        image: Quest_15,
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
