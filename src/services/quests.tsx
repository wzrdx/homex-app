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
        name: 'Desert Mirage',
        description: (
            <Text layerStyle="questDescription">
                Amidst the scorching desert, hidden beneath a mirage's veil, lies the enigmatic base launchpad of underground
                exploration. Embark on a journey to decipher ancient clues scattered across the arid dunes. Upon uncovering the
                hidden base, descend to the subterranean realm, where the true essence of the desert is unveiled, and a realm of
                untold wonders awaits discovery.
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
        name: 'Oceanic Depths',
        description: (
            <Text layerStyle="questDescription">
                Deep within the earth's core, a mechanical factory looms before you, ready to propel you into the uncharted
                oceans beneath the planet's surface. As you wait to be equipped for this daring expedition, the air hums with
                anticipation, and the subterranean world beckons with its mysteries. Rare herbs infused with the earth's energy,
                will power your dive suit and grant you the ability to explore the mesmerizing depths of the hidden oceans.
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
        name: "Traveler's Compass",
        description: (
            <Text layerStyle="questDescription">
                Dive into the Abyssal Archipelago, where the ocean's depths conceal treacherous currents and tempestuous winds
                challenge underwater travelers. Unearth the Oceanic Compass, a mystical artifact that bestows mastery over the
                underwater currents, empowering divers to navigate the ocean's depths with precision.
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
        name: 'Glasswrought Discovery',
        description: (
            <Text layerStyle="questDescription">
                In the depths of the ocean, you stumble upon a mysterious glass globe adorned with intricate mechanical
                components. The secrets it holds could prove crucial for your underwater journey. With precision and finesse,
                operate the enigmatic device to unlock its inner workings. As the gears click into place, the globe reveals a
                hidden compartment, containing a luminous Orb of the Corals, an artifact that harnesses the ocean's elemental
                energies.
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
        name: 'Submerged Communique',
        description: (
            <Text layerStyle="questDescription">
                Now your mission is to establish a vital communication link with the surface base, enhancing collaboration with
                fellow travelers. Utilizing the artifacts gathered before, transmit crucial messages encoded in ethereal
                frequencies to the base above. In return, receive vital navigational guidance and updates, ensuring the success
                of your exploration into uncharted waters.
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
        name: "Sundsten's Beacon",
        description: (
            <Text layerStyle="questDescription">
                Dive into the abyss of the Abyssal Trench, seeking the Lost Lantern of Sundsten. Restore the ancient artifact to
                its rightful place, unleashing a radiant beacon that empowers travelers with navigation prowess and grants safe
                passage through treacherous waters.
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
        name: 'Spectral Enigma',
        description: (
            <Text layerStyle="questDescription">
                Unearth the lost ghost city, an enigmatic ruins submerged in the ocean's depths. As you venture through the
                submerged platforms, you discover unusual constructions, unlike any you've seen before. Inspect the holographic
                archives scattered amidst the ruins, revealing echoes of a forgotten civilization and locations of lost
                treasures left behind.
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
        name: 'Subaquatic Nexus',
        description: (
            <Text layerStyle="questDescription">
                Stumble upon an underwater mine concealed within a hidden cave, its construction suspended gracefully by bridges
                connecting to the rocks. The mine harnesses the energy of rare minerals and precious gems found abundantly in
                the ocean's depths. Activate the mine's energy conduits, funneling the collected power upwards through the
                cave's central shaft to the surface base, providing valuable resources to support your ongoing journey beneath
                the waves.
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
        name: 'Surface Respite',
        description: (
            <Text layerStyle="questDescription">
                Return to the launchpad base for a well-deserved rest from your underwater odyssey. Amidst fellow travelers,
                exchange vital data and captivating tales of your submerged journey. Recharge your energy and connect with the
                community to share discoveries from the ocean's depths.
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
        name: 'Moonlit Prophecies',
        description: (
            <Text layerStyle="questDescription">
                Sleeping for some hours, you visit in your dreams the Moonlit Oracle, perched atop the Lunar Cliff. Interpret
                the moonlit runes to retrieve the Tidecaller's Scroll. As the tides respond to the prophecy, Menhir experiences
                a surge of prosperity, with flourishing fishing and bountiful marine life.
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
        name: 'Deep Sea Enigma',
        description: (
            <Text layerStyle="questDescription">
                In another dream you plummet into the Deep Sea Chasm, an abyss shrouded in mystery. Decipher the ancient symbols
                etched on the Abyssal Tablet to retrieve the Leviathan's Eye, an artifact that grants visions of the ocean's
                secrets, guiding sailors through turbulent waters.
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
        name: "Ocean's Embrace",
        description: (
            <Text layerStyle="questDescription">
                In one of your visions, you venture to the Fathomless Fjord, where the water conceals a legendary artifact.
                Retrieve the Ocean's Embrace, a mystical artifact that empowers those touched by the sea, enhancing their
                maritime abilities and fostering a bond with marine creatures. Wake up and use these precious informations. As
                the launchpad prepares to send you back into the aquatic realm, the knowledge shared at the surface base becomes
                your strength, fueling your spirit for the next dive.
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
        name: 'Azure Alchemy',
        description: (
            <Text layerStyle="questDescription">
                Ascend to the Azure Observatory, where sea and sky meet. Harness the power of the Azure Elixir, crafted from
                rare oceanic elements. As the elixir transmutes, it imbues Menhir's waters with healing properties, fostering a
                sanctuary for marine creatures and restoring the balance of ocean life.
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
        name: 'Nautical Nebula',
        description: (
            <Text layerStyle="questDescription">
                Traverse the Nebulous Tides, where the celestial and aquatic realms converge. Alchemize the Stardust Pearl, a
                luminescent gem that illuminates the depths and guides travelers during starless nights, protecting them from
                treacherous currents.
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
        name: 'City of the Heroes',
        description: (
            <Text layerStyle="questDescription">
                Empowered by the gathered energies and wisdom of your underwater odyssey, you now embark on the ultimate quest -
                to plunge deeper into the ocean's heart. As you venture into the mysterious underwater city, a marvel of
                suspended constructions and vibrant marine flora welcomes you. Traverse the intricate pathways that lead to the
                city's central chamber, where untold secrets of another realm lie dormant, waiting to be unlocked.
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
        name: 'The Enchanted Lagoon',
        description: (
            <Text layerStyle="questDescription">
                Descend into the ocean's depths to uncover the hidden realm of the Enchanted Lagoon. Upon accomplishing the
                task, the Enchanted Lagoon comes alive with a luminous glow, and a harmonious connection forms between the realm
                and the ocean. The Lagoon's magic extends to Menhir, enriching the realm with newfound enchantments, fostering
                an everlasting bond between these two extraordinary worlds.
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
