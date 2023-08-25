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

const ESSENCE_HANDICAP = 1;

const getId = () => ++ID;

export const QUESTS: any[] = [
    // Herbalism
    {
        id: getId(),
        type: 'herbalism',
        name: 'Depths of Menhir ',
        description: (
            <Text layerStyle="questDescription">
                Embark on a daring odyssey into the veiled waters of Menhir's hidden ocean. Your mission: to recover a sacred
                leaf with boundless power. Plunge into the depths, navigate the unknown, and grasp the leaf to shape destiny.
                Will you rise with the leaf and become the harbinger of change?
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
        name: 'Abyssal Resurgence',
        description: (
            <Text layerStyle="questDescription">
                Venture anew into Menhir's oceanic abyss, now for a fabled herb. Delve deeper, battling the unknown, to retrieve
                the herb possessing rejuvenating might. Amidst perilous depths, secure the herb and wield its vitality. Conquer
                the abyss and emerge with the herb to rewrite fate's tapestry!
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
        name: 'Blossoms of Serenity',
        description: (
            <Text layerStyle="questDescription">
                Unearth a revelation: a sacred chest in the ocean's heart, adorned with lost sea-flowers. Embark on a journey
                deeper, facing mysteries untold, to gather these blossoms of serene power. Amidst uncharted currents, secure the
                petals, embracing their tranquil essence. Venture back, a harbinger of newfound calm.
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
        name: 'Echoes of Leviathans',
        description: (
            <Text layerStyle="questDescription">
                Consume the petals, gift from the chest, and awaken visions of ancient whales. These majestic behemoths hold
                secrets that guide your journey. Embrace their spectral guidance, journey onwards through veiled currents, and
                unravel the tapestry of destiny. With each whisper from the past, forge a path toward the unknown future.
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
        name: 'Stellar Convergence',
        description: (
            <Text layerStyle="questDescription">
                Guided by sacred whale echoes, unearth the concealed starfish jewel. Embark on a voyage through hushed tides,
                following their spectral light, to retrieve this hidden artifact of cosmic essence. Amidst veiled depths, secure
                the jewel, connecting with its boundless energy. With starlit wisdom, continue your odyssey, a bearer of the
                universe's secrets.
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
        name: "Jewels' Resonance",
        description: (
            <Text layerStyle="questDescription">
                Empowered by the starfish jewel's resonance, seek its sister: the blossom of the depths jewel. Embark on a
                harmonious journey through the ocean's heart, guided by their ethereal connection, to retrieve this gem of
                submerged splendor. Amidst secret currents, secure the jewel, uniting its aquatic power. With gems ablaze,
                continue your voyage, a harmonizer of elemental treasures.
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
        name: 'Vortex of Ascendance',
        description: (
            <Text layerStyle="questDescription">
                With both sister jewels embraced, converge them in a watery vortex, deep within the ocean's abyss. Venture into
                this magical fusion, guided by their harmonious union, to breach the veils of existence. Amidst swirling
                energies, merge the jewels, transcending to the next plane. With newfound dimensions at hand, journey onwards,
                an interdimensional voyager.
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
        name: 'Ethereal Nexus',
        description: (
            <Text layerStyle="questDescription">
                Having traversed to the next plane, shrouded within Menhir's depths, heed the whispers of the guiding whales.
                Embark on a course aligned with your dream's echo from the Monolith, weaving through this ethereal expanse.
                Amidst cosmic currents, follow the whales' lead, advancing along the path predestined. With astral resonance,
                forge ahead, a pilgrim of the hidden realms.
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
        name: "Kayron's Embrace",
        description: (
            <Text layerStyle="questDescription">
                Navigating this arcane plane, you encounter Kayron - the mighty transporter of travelers. A colossal whale,
                revered as a guardian, awaits to ferry you on your ongoing quest. Amidst luminescent horizons, step onto
                Kayron's back, embarking upon this new chapter. With the guardian's strength, journey onward, a companion of the
                ethereal currents.
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
                value: 1 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
        ],
        layers: [],
        image: Quest_9,
    },
    {
        id: getId(),
        type: 'divination',
        name: "Memory's Mirage",
        description: (
            <Text layerStyle="questDescription">
                Guided by the mighty Kayron, you arrive at an enigmatic surface, veiled within the Monolith's memory. Submerged
                in a meditative trance, reality intertwines with boundless cosmos. Within this seamless fusion, explore the
                depths of consciousness and traverse the realm where memory and possibility converge. Amidst the tapestry of
                existence, continue your exploration, a seeker of infinite horizons.
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
                value: 3 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
        ],
        layers: [],
        image: Quest_10,
    },
    {
        id: getId(),
        type: 'divination',
        name: 'Abyssal Odyssey',
        description: (
            <Text layerStyle="questDescription">
                Once more, descend into the Ocean's abyss with Kayron as your guide, journeying to a distinct realm of Menhir.
                Bound together by destiny's thread, embark on an abyssal odyssey, accompanied by the guardian's steady presence.
                Amidst the shifting currents, explore a new expanse, where mysteries unfold beneath the depths. With Kayron's
                guidance, delve deeper into the unknown, a voyager of uncharted realms.
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
                value: 6 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
        ],
        layers: [],
        image: Quest_11,
    },
    {
        id: getId(),
        type: 'divination',
        name: 'Echoes of Ages',
        description: (
            <Text layerStyle="questDescription">
                Having fulfilled its purpose, Kayron leads you to the Sunken City. Step into its ruins, where time's currents
                have left their mark. Navigate through history's whispers as you search for the sacred artefact - the soul
                divider. Amidst forgotten chambers, explore the relics of eras past, guided by the echoes of ages. With
                determination as your guide, venture deeper, an archaeologist of lost legends.
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
                value: 12 * (BASE_REWARD - ESSENCE_HANDICAP),
            },
        ],
        layers: [],
        image: Quest_12,
    },

    // Alchemy
    {
        id: getId(),
        type: 'alchemy',
        name: 'Soulbound Nexus',
        description: (
            <Text layerStyle="questDescription">
                To unlock the final steps, heed the Monolith's vision. Harvest the souls of wandering whales within the soul
                divider. Embrace the ethereal connection, embarking on a solemn task. Amidst the cosmic weave, gather echoes of
                departed guardians, their essence bound to the quest's crescendo. With reverence and purpose, continue forward,
                a seeker of profound truths.
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
        name: 'The Harvest',
        description: (
            <Text layerStyle="questDescription">
                Initiating the Ritual of Harvest, merge the lost souls of wandering whales. Consume the essence birthed from
                this fusion, transcending both astral and physical realms. As the cosmic dance unfolds, transport to the fabled
                destination of the lost artefacts. Amidst the interplay of energies, bridge the gap between worlds, a conduit of
                boundless convergence. With unity as your guide, journey to the culmination, a bridge between dimensions.
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
                value: 12 * (BASE_REWARD - ESSENCE_HANDICAP),
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
        name: 'Echoes of Destiny',
        description: (
            <Text layerStyle="questDescription">
                Emerging from the completed Ritual of Harvest, find yourself within Menhir's desert, surrounded by the ruins of
                Algermuth - the lost city of saints. Amidst these forsaken remnants, bear witness to the spectral dance of free
                whale souls above the first artefact - the Heart of Tork'ugth, a legendary calamity obscured by time's shroud.
                With purpose coursing through your veins, reach out and retrieve the artefact, intertwining fate's threads with
                your own. Amidst visions and reality united, seize the relic's power, a catalyst for ancient legacies.{' '}
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
        name: 'Praised be Salabathur',
        description: (
            <Text layerStyle="questDescription">
                At your journey's culmination, stand before the ultimate artefact: the prized carving of Salabathur - the
                majestic God of the Abyss, weaver of skies and seas. Reach out and retrieve this sacred masterpiece, a
                culmination of life's intricate dance. With destiny's tapestry unfurled, embark on the final leg, bearing the
                carving to the Monolith, heart of Menhir's capital. Amidst echoes of creation and separation, fulfill your role
                as an architect of ancient harmony.
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
