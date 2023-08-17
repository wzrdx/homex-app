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
        name: 'Sands of Tranquility',
        description: (
            <Text layerStyle="questDescription">
                In the desert's heart lies a hidden oasis, guarded by ancient guardians. Collect the petals of the Tranquil
                Lotus, a rare flower with calming properties. Brew a potion to soothe the guardians' spirits, allowing safe
                passage to the heart of the dunes, where an ancient treasure awaits.
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
        name: 'Pyramid Garden',
        description: (
            <Text layerStyle="questDescription">
                Amidst the dunes, discover a hidden garden filled with luminous flora. Retrieve the Celestial Blossom, said to
                hold the wisdom of the desert goddesses. Blend its essence with rare herbs to create a potion that unveils
                secrets long obscured by time.{' '}
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
        name: 'Whispering Winds',
        description: (
            <Text layerStyle="questDescription">
                Inscribe forgotten symbols of the desert on magical Windstones scattered across the dunes. The stones resonate
                with the ancient humanoid figures' wisdom, granting access to their realm. Harness their knowledge to brew an
                elixir that grants clarity in Divination.
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
        name: 'Mirage Mirage',
        description: (
            <Text layerStyle="questDescription">
                Navigate through shifting dunes to the heart of a mirage that houses the Mirage Mirage, a unique plant that only
                manifests in illusions. Infuse its essence into potions that allow travelers to glimpse into the realm of
                elusive treasures hidden beneath the sands.
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
        name: "Goddess' Tears",
        description: (
            <Text layerStyle="questDescription">
                In the ancient temple, retrieve crystal tears, remnants of desert goddesses' blessings. Craft them into
                Tearstone Gems, which resonate with the goddesses' guidance. Use them to enhance jewelry, creating exquisite
                pieces that channel their power.
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
        name: 'Golden Secrets',
        description: (
            <Text layerStyle="questDescription">
                Delve into forgotten pyramids, discovering golden gems with enigmatic symbols. Polish these Sunstone Crystals,
                and combine them with rare metals to craft radiant amulets that amplify Divination abilities.
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
        name: 'Ancient Reflections',
        description: (
            <Text layerStyle="questDescription">
                Amidst desert ruins, locate the Enigmatic Mirror, a legendary artifact said to reflect the inner truths of
                ancient humanoid figures. Cut and shape the mirror's reflections into gemstones, crafting Luminous Facets that
                grant clarity and insight.
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
        name: 'Sands of Time',
        description: (
            <Text layerStyle="questDescription">
                Gather Sands of Eternity from the desert's deepest dunes, where time's essence lingers. Combine these sands with
                rare gems to forge Timebound Lockets that slow time for wearers, allowing them to perceive hidden truths and
                seize fleeting opportunities.
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
        name: "Oracle's Call",
        description: (
            <Text layerStyle="questDescription">
                Seek the Pyramid Oracle, a mystical entity in the shape of an ancient humanoid figure. Answer riddles it poses
                using insights from your Divination skills. Uncover the Lost Glyphs, translating them into powerful enchantments
                to aid your journey.
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
        name: 'Dune Whispers',
        description: (
            <Text layerStyle="questDescription">
                Connect with the desert's hidden energy nodes to unveil ancient messages etched by humanoid figures into crystal
                tablets. Decode their wisdom to learn the secrets of divining the future. Craft Crystal Oracle Stones to amplify
                your Divination prowess.
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
        name: 'Veil of Illusions',
        description: (
            <Text layerStyle="questDescription">
                Traverse through an illusory desert realm crafted by the goddesses. Consult the Mirage Oracle, a sentient mirage
                that imparts cryptic visions. Decipher these visions to reveal hidden paths and gather Mystic Sand, a vital
                ingredient in crafting enchanted scrying mirrors.
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
        name: 'Eternal Sands',
        description: (
            <Text layerStyle="questDescription">
                Retrieve the Eternal Hourglass, a relic hidden within a pyramid. As you turn it, visions of ancient humanoid
                figures intertwining with pyramids' tales emerge. By crafting Ascendant Hourglasses with its sand, enhance your
                Divination skills to access realms beyond time's grasp.
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
        name: 'Pyramid Brews',
        description: (
            <Text layerStyle="questDescription">
                Journey into ancient pyramids to retrieve enigmatic crystals. Infuse them into the Enigmatic Elixir, granting
                the drinker brief visions of humanoid ancient figures. As their insights unfold, craft Pyramid Phials that allow
                the imbiber to perceive hidden truths.
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
    {
        id: getId(),
        type: 'alchemy',
        name: "Serpent's Alchemy",
        description: (
            <Text layerStyle="questDescription">
                Unearth ancient serpent symbols etched into golden tablets deep within pyramids. Combine these symbols with
                serpent scales to craft the Serpent's Elixir. This elixir grants wearers heightened perception, unlocking the
                ability to communicate with serpent deities and glean hidden wisdom.
            </Text>
        ),
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
                value: 12 * BASE_REWARD,
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
        name: 'Quantum Convergence',
        description: (
            <Text layerStyle="questDescription">
                Plunge into the buried archives of an ultra-modern pyramid, illuminated by holographic glyphs. Uncover the
                Quantum Codex, a crystalline data matrix infused with quantum information. By synthesizing its energy with
                advanced alloys, forge the Cosmic Resonator. This device manipulates quantum frequencies, enabling communication
                between futuristic travelers and Menhir's enlightened essence. As you activate the resonator, a new era dawns,
                connecting the boundless potentials of future exploration with Menhir's infinite knowledge.{' '}
            </Text>
        ),
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
        ],
        layers: [],
        image: Quest_15,
    },
    {
        id: getId(),
        type: 'final',
        isFinal: true,
        name: 'Sands of Eternity',
        description: (
            <Text layerStyle="questDescription">
                Unveil the secrets of the humanoid figures, decode the language of the pyramids, and commune with the goddesses
                who shaped the desert's fate. With newfound wisdom, step into the ever-shifting sands once more, infused with
                the Sands of Ascendance. As your journey unfolds, you weave the threads of time and knowledge, bridging ancient
                echoes with the destiny of Menhir's realm.
            </Text>
        ),
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
