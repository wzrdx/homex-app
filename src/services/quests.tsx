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
        name: 'Sunlit Haven',
        description: (
            <Text layerStyle="questDescription">
                Journey to Wood Village next to Menhir, cursed by eternal clouds. Retrieve the Warmth Crystal from the heart of
                the Sunlit Haven, a sacred glade hidden in the forest. As the crystal radiates its vibrant glow, the clouds
                disperse, and the wood stacks bask in the sun, ready for construction.
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
        name: 'Eternal Sunrise',
        description: (
            <Text layerStyle="questDescription">
                Venture into the Sunflower Field, where time stands still for the flowers. Solve the Celestial Sundial puzzle to
                unlock their connection with the sun. Retrieve the Sunflower Scent from the central flower, and as its aroma
                fills the air, the field bursts into life, following the sun's path once more.
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
        name: 'Winds of Grain',
        description: (
            <Text layerStyle="questDescription">
                Embark on a journey to the Windmill Farm, a realm of mechanized wheat harvesting. Unravel the ancient
                machineries' secrets to operate them. Retrieve the golden Wheat Harvest, and as the windmills whirl, a bountiful
                wheat harvest blesses the fields.
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
        name: 'Everlasting Bloom',
        description: (
            <Text layerStyle="questDescription">
                Seek the Altar of Bloom nestled among the mountains, where couples once wed. Perform a sacred ritual and
                retrieve the Ring of Bloom, an eternal symbol of summer's maturity. As you return it to the altar, the land
                flourishes with vibrant flora, celebrating the essence of summer's growth.
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
        name: 'Enigmatic Glyphs',
        description: (
            <Text layerStyle="questDescription">
                Explore the Zabedia Temple, surrounded by agricole wonders. Decode the ancient runes etched in stone and
                retrieve the Sun Bowl. As the bowl's magic activates, the temple is infused with summer's essence, and the land
                flourishes with abundant crops.
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
        name: 'Temporal Convergence',
        description: (
            <Text layerStyle="questDescription">
                Enter the Chrono Maze, a labyrinth where time intertwines. Overcome challenges and retrieve the Hourglass of
                Summer. As you turn the sands, the maze transforms into a magical Chronospace, where you can borrow extra
                daylight hours to savor the splendors of summer.
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
        name: "Emberheart's Embrace",
        description: (
            <Text layerStyle="questDescription">
                Venture into the frozen Alaiy Forest, perpetually shrouded in darkness. Unearth the secret of igniting eternal
                flames and retrieve the Everburn Ember. As warmth spreads, the forest blooms, and its creatures awaken, turning
                the once-frigid forest into a sanctuary of life.
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
        name: 'Sands of Memory',
        description: (
            <Text layerStyle="questDescription">
                Brave the depths of Tam Ocean to retrieve the Sand of Summers Past. Embrace its nostalgic magic, transporting
                you to cherished memories of summer days gone by. As the sand's light touches Menhir's shores, the city is
                filled with a sense of joy and nostalgia, honoring the spirit of summertime.
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
        name: 'Starlight Prophecy',
        description: (
            <Text layerStyle="questDescription">
                Ascend the celestial observatory to decipher the Summer Constellation. Retrieve the Guiding Star Crystal, an
                ethereal gem reflecting summer's secrets. As its light illuminates the night sky, the stars reveal insights into
                the realm's destiny.
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
        name: 'Radiant Riddles',
        description: (
            <Text layerStyle="questDescription">
                Enter the Garden of Oracle Blossoms, where enchanted flowers offer enigmatic wisdom. Solve the puzzles of the
                Blooming Enigma to retrieve the Oracle Petals. As their mystical essence spreads, Menhir's inhabitants gain
                newfound clarity and purpose.
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
        name: 'Solstice Serenade',
        description: (
            <Text layerStyle="questDescription">
                Venture to the ancient Solstice Standing Stones, a sacred place of divine revelation. Harmonize the stones to
                reveal the Sun Song Scroll. As the scroll is played, celestial melodies resonate, guiding Menhir towards its
                destined summer prosperity.
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
        name: 'Eclipsed Visions',
        description: (
            <Text layerStyle="questDescription">
                Seek the ethereal Eclipse Nexus, where light and shadow dance. Retrieve the Solar Lens, a crystalline tool for
                seeing beyond veiled truths. As you peer through its magical lens, mysteries of the cosmos and Menhir's future
                unfold.
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
        name: 'Luminous Elixir',
        description: (
            <Text layerStyle="questDescription">
                Brave the luminous Albedo Abyss, where daylight eludes. Retrieve the Elixir of Eternal Glow. As it touches the
                land, night transforms into day, filling Menhir with radiant light, enhancing growth, and invoking eternal
                summertime splendor.
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
        name: 'Celestial Tincture',
        description: (
            <Text layerStyle="questDescription">
                Ascend to the Cosmic Apex, where celestial energies converge. Extract the Celestial Tincture, a potent essence
                of astral harmony. As the tincture is infused into the city's fountains, Menhir resonates with cosmic
                equilibrium, bringing prosperity and balance throughout the realm.
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
        name: 'Flames of Solstice',
        description: (
            <Text layerStyle="questDescription">
                As the first rays of dawn grace Menhir, embark on a perilous journey through the scorching Desert Dunes. Amid
                shifting sands, retrieve the Flames of Solstice, a blazing relic with the power to harness the sun's eternal
                radiance. Master the elemental trials, withstand the blazing heat, and harness the Flames' energy to ignite a
                celestial beacon that illuminates Menhir throughout eternity.
            </Text>
        ),
        requirements: {
            energy: Math.round(1.1 * 16 * BASE_COST),
            herbs: Math.round(1.1 * 32 * BASE_COST),
            gems: Math.round(1.1 * 16 * BASE_COST),
            essence: Math.round(1.1 * 12 * BASE_COST),
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
        name: 'Celestial Rebirth',
        description: (
            <Text layerStyle="questDescription">
                Prepare for the ultimate trial at the Celestial Peak, the realm's highest summit, where summer's energy
                converges. Scale treacherous cliffs, traverse celestial paths, and face formidable challenges to reach the
                mystical Astral Altar. Invoke the Starfire Sigil, an ancient artifact that channels the celestial energies of
                the cosmos into the realm, bestowing Menhir with eternal summer and ushering in a new era of prosperity and
                growth.
            </Text>
        ),
        requirements: {
            energy: Math.round(1.1 * 2 * 16 * BASE_COST),
            herbs: Math.round(1.1 * 2 * 32 * BASE_COST),
            gems: Math.round(1.1 * 2 * 16 * BASE_COST),
            essence: Math.round(1.1 * 2 * 12 * BASE_COST),
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
