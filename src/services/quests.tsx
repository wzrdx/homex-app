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

import { createContext, useContext } from 'react';
import { Text } from '@chakra-ui/react';
import { Quest } from '../types';

import SmokeAndClouds from '../assets/quests/videos/1.webm';
import LightRays from '../assets/quests/videos/3-1.webm';
// import SmokeAndRays from '../assets/quests/videos/4.webm';
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
const BASE_REWARD = 10;

const getId = () => ++ID;

export const QUESTS: any[] = [
    // Herbalism
    {
        id: 1,
        type: 'herbalism',
        name: 'Botanical Exploration',
        description: (
            <Text layerStyle="questDescription">
                Journey to the botanical rim in the western side of Menhir to gather a rare root that will bring new life to the
                Menhir's gardens. The root is guarded by treacherous vines and thorny bushes.
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
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_1,
    },
    {
        id: 2,
        type: 'herbalism',
        name: 'Waterfall Pilgrimage',
        description: (
            <Text layerStyle="questDescription">
                Embark on a pilgrimage to a hidden temple behind a roaring waterfall, where you will start a ritual to announce
                the arrival of spring by burning eucalyptus in an incense burner.
            </Text>
        ),
        requirements: {
            energy: 3 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 6 * BASE_REWARD,
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
        id: 3,
        type: 'jewelcrafting',
        name: 'Fountain of Youth',
        description: (
            <Text layerStyle="questDescription">
                Discover the hidden fountain from Menhir and retrieve a goblet of its magical water for Menhir's spring
                celebration. The clear water can only be consumed from one of the goblets tied to the fountain.
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
        id: 4,
        type: 'jewelcrafting',
        name: 'Garden of Light',
        description: (
            <Text layerStyle="questDescription">
                Venture into the hidden Garden of Light inside a palace courtyard and retrieve the chlorophyll from a
                transparent crystal flower, symbolizing life and energy from the sun's light.
            </Text>
        ),
        requirements: {
            energy: 3 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 3 * BASE_REWARD,
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
        id: 5,
        type: 'enchanting',
        name: 'Bloom Market',
        description: (
            <Text layerStyle="questDescription">
                Exchange precious gems for rare and exotic flowers to add to the Menhir's gardens. Rumor has it that there's a
                rare bloom being sold by a mysterious vendor that only appears once a year.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
        },
        duration: 6 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 4 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 2 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_5,
    },
    {
        id: 6,
        type: 'enchanting',
        name: 'Seed Hunt',
        description: (
            <Text layerStyle="questDescription">
                Journey deep into the forest to capture and bring back a rare bird to trade for valuable seeds and gems for the
                city's use. Beware of the bird's elusive nature and the treacherous terrain you'll have to navigate to reach it.
            </Text>
        ),
        requirements: {
            energy: 6 * BASE_COST,
        },
        duration: 9 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 6 * BASE_REWARD,
            },
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 3 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_6,
    },

    // Divination
    {
        id: 7,
        type: 'divination',
        name: 'Spring Cleaning',
        description: (
            <Text layerStyle="questDescription">
                Help to purify the polluted water sources around the city. Retrieve special cleansing herbs from the nearby
                swamp to use in the purification process. Beware of the swamp creatures and treacherous terrain along the way.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 4 * BASE_COST,
            gems: 2 * BASE_COST,
        },
        duration: 3 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 1 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: DesertSmoke,
                mode: 'normal',
            },
        ],
        image: Quest_7,
    },
    {
        id: 8,
        type: 'divination',
        name: 'Renewal Ritual',
        description: (
            <Text layerStyle="questDescription">
                Join a sacred ceremony to celebrate the arrival of spring and receive the essence of renewal to prepare the land
                for the butterfly's magic.
            </Text>
        ),
        requirements: {
            energy: 8 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
        },
        duration: 6 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 2 * BASE_REWARD,
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
        id: 10,
        type: 'alchemy',
        name: 'Sunshine Symphony',
        description: (
            <Text layerStyle="questDescription">
                Discover the hidden location of the Sun Harp, a legendary musical instrument that harnesses the power of
                sunlight. Embark on a musical journey through sunlit valleys and ancient ruins, collecting harmonious notes
                along the way.
            </Text>
        ),
        requirements: {
            energy: (1 / 3) * BASE_COST,
        },
        duration: BASE_DURATION / 2,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: BASE_REWARD,
            },
        ],
        layers: [
            {
                source: Particles,
                mode: 'overlay',
            },
        ],
        image: Quest_10,
    },
    {
        id: 11,
        type: 'alchemy',
        name: 'Spring Swap Meet',
        description: (
            <Text layerStyle="questDescription">
                Join the bustling Spring Swap Meet in Menhir, where traders from all corners gather to exchange their unique and
                rare inventory. Navigate through the vibrant marketplace, interacting with merchants and collectors who have an
                array of items, from colorful flower seeds and ornate gardening tools to enchanted springtime accessories.
            </Text>
        ),
        requirements: {
            energy: (1 / 3) * BASE_COST,
        },
        duration: BASE_DURATION / 2,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: (1 / 2) * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: DesertSmoke,
                mode: 'normal',
            },
        ],
        image: Quest_11,
    },
    {
        id: 12,
        type: 'alchemy',
        name: "Blossom's Blessing",
        description: (
            <Text layerStyle="questDescription">
                Venture deep into the Enchanted Forest and seek out the ancient tree known as Blossom's Heart. This tree holds
                the power to rejuvenate and awaken dormant plants. Overcome mystical challenges and cleverly navigate the forest
                to collect petals from the tree's magnificent blooms.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
        },
        duration: 6 * BASE_DURATION,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 12 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'plus-lighter',
            },
        ],
        image: Quest_12,
    },
    {
        id: 13,
        type: 'alchemy',
        name: 'Raindrop Rhapsody',
        description: (
            <Text layerStyle="questDescription">
                Embark on a journey to the Cloud Peaks, where magical raindrops are said to hold the essence of the season.
                Ascend the misty heights and brave the elements to collect these shimmering droplets.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
        },
        duration: 6 * BASE_DURATION,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 6 * BASE_REWARD,
            },
        ],
        layers: [
            {
                source: SmokeAndClouds,
                mode: 'normal',
            },
        ],
        image: Quest_13,
    },

    // Final
    {
        id: 9,
        type: 'final',
        isFinal: true,
        name: 'Enchanted Butterfly',
        description: (
            <Text layerStyle="questDescription">
                To retrieve the colorful butterfly you would have to use all of your skills and wit to capture it. Secure it
                safely for transport back to the city and wait for it to bring new life to the land.
            </Text>
        ),
        requirements: {
            energy: 20 * BASE_COST,
            herbs: 20 * BASE_COST,
            gems: 10 * BASE_COST,
            essence: 10 * BASE_COST,
        },
        duration: 16 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Ticket',
                value: 1,
            },
        ],
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
        image: Quest_9,
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
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState<Quest>(getQuest());
    const [ongoingQuests, setOngoingQuests] = useState<OngoingQuest[]>([]);

    const getOngoingQuests = async () => {
        const resultsParser = new ResultsParser();
        const proxy = new ProxyNetworkProvider(API_URL, { timeout: 12000 });

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
