import React, { useState } from 'react';
import Quest_1 from '../assets/quests/Q1.jpg';
import Quest_2 from '../assets/quests/Q2.jpg';
import Quest_3 from '../assets/quests/Q3.jpg';
import Quest_4 from '../assets/quests/Q4.jpg';
import Quest_5 from '../assets/quests/Q5.jpg';
import Quest_6 from '../assets/quests/Q6.jpg';
import Quest_7 from '../assets/quests/Q7.jpg';
import Quest_8 from '../assets/quests/Q8.jpg';
import Quest_9 from '../assets/quests/Q9.jpg';
import { createContext, useContext } from 'react';
import { Text } from '@chakra-ui/react';
import { Quest } from '../types';
import Q1 from '../assets/quests/videos/1.webm';
import LightRays from '../assets/quests/videos/3-1.webm';
import Q3 from '../assets/quests/videos/3.webm';
import Q4 from '../assets/quests/videos/4.webm';
import Q5 from '../assets/quests/videos/5.webm';
import Q6 from '../assets/quests/videos/6.webm';
import Mine from '../assets/quests/videos/7-1.webm';
import DesertSmoke from '../assets/quests/videos/8-1.webm';
import Q9 from '../assets/quests/videos/9.webm';

import { OngoingQuest } from '../blockchain/types';
import { ResultsParser, ContractFunction, AddressValue, Address } from '@multiversx/sdk-core/out';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { API_URL } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { BigNumber } from 'bignumber.js';

const BASE_DURATION = 1;
const BASE_COST = 10;
export const QUEST_DURATION_INTERVAL = 'minute';

const QUEST_IMAGES = [Quest_1, Quest_2, Quest_3, Quest_4, Quest_5, Quest_6, Quest_7, Quest_8, Quest_9];

export const QUESTS: any[] = [
    // Basic
    {
        id: 1,
        type: 'basic',
        name: 'City Scouting',
        description: (
            <Text layerStyle="questDescription">
                Embark on a journey to uncover the secrets of the city and earn a reward. This adventure requires some
                energy to keep you focused on your path.
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
        layers: [
            {
                source: Q1,
                mode: 'normal',
            },
        ],
    },
    {
        id: 2,
        type: 'basic',
        name: 'Craft Compass',
        description: (
            <Text layerStyle="questDescription">
                After reaching a crossroads, you find yourself lost and disoriented. To find your way, you must craft a
                compass. This task will require significant energy and time, but the reward awaits those who succeed.
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
        layers: [
            {
                source: LightRays,
                mode: 'normal',
            },
        ],
    },
    {
        id: 3,
        type: 'basic',
        name: 'Menhir Summit',
        description: (
            <Text layerStyle="questDescription">
                You seek to gain a better understanding of the city's layout and its surroundings, and decide to climb
                to its highest point. The journey is treacherous and challenging, but the view from the top is
                breathtaking and awe-inspiring.
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
        layers: [
            {
                source: Q3,
                mode: 'normal',
            },
        ],
    },
    {
        id: 4,
        type: 'basic',
        name: 'Tales Unveiled',
        description: (
            <Text layerStyle="questDescription">
                As a seasoned traveler, you long to share your tales of adventure with the people of Menhir. They are
                eager to hear your stories, and in exchange, offer you a reward of precious gems. But to captivate your
                audience, you must spend time gathering enough listeners to hear your tales.
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
        layers: [
            {
                source: Q4,
                mode: 'normal',
            },
        ],
    },

    // Exchange
    {
        id: 5,
        type: 'exchange',
        name: 'Encounter Merchant',
        description: (
            <Text layerStyle="questDescription">
                While exploring the city, you come across an old vendor and strike a deal. For a small price, you
                acquire a revigorating potion that restores your energy and a diagram leading to a secret location. The
                transaction takes a bit of your time, but it may prove to be worth it.
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
        layers: [
            {
                source: Q5,
                mode: 'hard-light',
            },
        ],
    },
    {
        id: 6,
        type: 'exchange',
        name: 'Shadowy Figure',
        description: (
            <Text layerStyle="questDescription">
                As you explore the city, you come across a mysterious figure who offers you a strange substance and a
                diagram in exchange for some gems. Upon consuming the substance, you feel a surge of energy. Although it
                may take some time, the transaction could potentially be valuable.
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
        layers: [
            {
                source: Q6,
                mode: 'normal',
            },
        ],
    },

    // Essence
    {
        id: 7,
        type: 'essence',
        name: 'Underground Blueprint',
        description: (
            <Text layerStyle="questDescription">
                While exploring the city's outskirts, you stumble upon an ancient mine filled with toxic substances. You
                manage to navigate through the harsh underground environment and discover a hidden diagram, but not
                without using a significant amount of resources. In the process, you obtain a rare essence. The journey
                to complete this task is not an easy one and requires considerable effort.
            </Text>
        ),
        requirements: {
            energy: 2 * BASE_COST,
            herbs: 4 * BASE_COST,
            gems: 2 * BASE_COST,
        },
        duration: 2 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 1,
            },
        ],
        layers: [
            {
                source: Mine,
                mode: 'normal',
            },
        ],
    },
    {
        id: 8,
        type: 'essence',
        name: 'Mystic Labyrinth',
        description: (
            <Text layerStyle="questDescription">
                As you journey through the outside world, you come across an ancient labyrinth filled with mysteries and
                challenges. You successfully navigate through it and uncover a hidden Diagram.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 2,
            },
        ],
        layers: [
            {
                source: DesertSmoke,
                mode: 'normal',
            },
        ],
    },

    // Final
    {
        id: 9,
        type: 'final',
        isFinal: true,
        name: 'Adraka Narcotic',
        description: (
            <Text layerStyle="questDescription">
                Retrieve the Adraka Narcotic hidden in a linen tent palace in the city's marketplace to protect yourself
                from desert mirages. Get the narcotic back to the Dome to receive your Ticket as a reward for your true
                intentions.
            </Text>
        ),
        requirements: {
            energy: 4 * BASE_COST,
            herbs: 8 * BASE_COST,
            gems: 4 * BASE_COST,
            essence: (2 * BASE_COST) / 10,
        },
        duration: 4 * BASE_DURATION,
        rewards: [
            {
                resource: 'tickets',
                name: 'Ticket',
                value: 1,
            },
        ],
        layers: [
            {
                source: Q9,
                mode: 'normal',
            },
        ],
    },
];

export const getQuest = (id = 1): Quest => {
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
        const proxy = new ProxyNetworkProvider(API_URL);

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
        <QuestsContext.Provider value={{ quest, setQuest, ongoingQuests, getOngoingQuests }}>
            {children}
        </QuestsContext.Provider>
    );
};
