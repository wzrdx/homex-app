import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import _ from 'lodash';
import { createContext, useContext, useState } from 'react';
import { AOM_COLLECTION_ID } from '../blockchain/config';
import { getPageCelestials } from '../blockchain/game/api/achievements/getPageCelestials';
import {
    getBudgetTravelersCommonAssets,
    getBudgetTravelersUncommonAssets,
    getCelestialsAssets,
    getCelestialsCollectorAssets,
    getCelestialsHoarderAssets,
    getEldersAssets,
    getRareTravelersRareAssets,
    getRareTravelersRoyalAssets,
    getSummaryAssets,
} from './assets';
import { zeroPad } from './helpers';
import { getSFTDetails } from './resources';
import { StoreContextType, useStoreContext } from './store';

import EsotericExpedition from '../assets/log/pages/Esoteric_Expedition.png';
import MagicalJourney from '../assets/log/pages/Magical_Journey.png';
import OccultOdyssey from '../assets/log/pages/Occult_Odyssey.png';
import BudgetTravelers from '../assets/log/pages/budget_travelers.png';
import CelestialsCollector from '../assets/log/pages/celestials_collector.png';
import CelestialsCurator from '../assets/log/pages/celestials_curator.png';
import CelestialsCustodian from '../assets/log/pages/celestials_custodian.png';
import CelestialsHoarder from '../assets/log/pages/celestials_hoarder.png';
import RareTravelers from '../assets/log/pages/rare_travelers.png';
import VarietyHunter from '../assets/log/pages/variety_hunter.png';
import { LogSummary, getLogSummary } from '../blockchain/game/api/achievements/getLogSummary';

export enum TravelersLogPageRarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
    Epic = 'Epic',
    Legendary = 'Legendary',
}

/**
 * Page identity information which needs to be displayed
 */
export interface TravelersLogPageHeader {
    index: number;
    title: string;
    dateAdded: Date;
    rarity: TravelersLogPageRarity;
    image: string;
    requiresVerification?: boolean;
    type: string;
}

/**
 * Page metadata information which needs to be fetched
 */
export interface TravelersLogPageMetadata {
    getBadges: (_?: any) => Promise<TravelersLogBadge[]>;
    getData: () => Promise<void>;
    dataKey: string;
}

export interface TravelersLogBadge {
    title: string;
    text: string;
    assets: [string, string];
    isUnlocked?: boolean;
    value?: number;
}

let index = -1;
const getIndex = () => ++index;

export const PAGE_HEADERS: TravelersLogPageHeader[] = [
    {
        index: getIndex(),
        title: 'Celestials Custodian',
        dateAdded: new Date('2023-11-01'),
        rarity: TravelersLogPageRarity.Epic,
        image: CelestialsCustodian,
        type: 'celestials_minters',
    },
    {
        index: getIndex(),
        title: 'Celestials Curator',
        dateAdded: new Date('2023-11-01'),
        rarity: TravelersLogPageRarity.Legendary,
        image: CelestialsCurator,
        type: 'celestials_minters',
    },
    {
        index: getIndex(),
        title: 'Celestials Collector',
        dateAdded: new Date('2023-12-01'),
        rarity: TravelersLogPageRarity.Rare,
        image: CelestialsCollector,
        requiresVerification: true,
        type: 'celestials_owners',
    },
    {
        index: getIndex(),
        title: 'Celestials Hoarder',
        dateAdded: new Date('2023-12-01'),
        rarity: TravelersLogPageRarity.Rare,
        image: CelestialsHoarder,
        requiresVerification: true,
        type: 'celestials_owners',
    },
    {
        index: getIndex(),
        title: 'Budget Travelers',
        dateAdded: new Date('2023-12-29'),
        rarity: TravelersLogPageRarity.Common,
        image: BudgetTravelers,
        type: 'main_staking',
    },
    {
        index: getIndex(),
        title: 'Rare Travelers',
        dateAdded: new Date('2024-01-13'),
        rarity: TravelersLogPageRarity.Uncommon,
        image: RareTravelers,
        type: 'main_staking',
    },
    {
        index: getIndex(),
        title: 'Variety Hunter',
        dateAdded: new Date('2024-01-16'),
        rarity: TravelersLogPageRarity.Rare,
        image: VarietyHunter,
        type: 'main_staking',
    },
    {
        index: getIndex(),
        title: 'Occult Odyssey',
        dateAdded: new Date('2024-03-18'),
        rarity: TravelersLogPageRarity.Epic,
        image: OccultOdyssey,
        type: 'summary_full',
    },
    {
        index: getIndex(),
        title: 'Esoteric Expedition',
        dateAdded: new Date('2024-03-18'),
        rarity: TravelersLogPageRarity.Rare,
        image: EsotericExpedition,
        type: 'summary_full',
    },
    {
        index: getIndex(),
        title: 'Magical Journey',
        dateAdded: new Date('2024-03-18'),
        rarity: TravelersLogPageRarity.Uncommon,
        image: MagicalJourney,
        type: 'summary_full',
    },
];

export interface AchievementsSharedData {
    celestialsPage?: {
        aurora: number;
        verdant: number;
        solara: number;
        emberheart: number;
        aetheris: number;
    };
    celestialsBalance?: number[];
    rarityCount?: _.Dictionary<number>;
    summary?: LogSummary;
}

export interface AchievementsContextType {
    data: AchievementsSharedData;
    pages: TravelersLogPageMetadata[];
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export const useAchievementsContext = () => useContext(AchievementsContext);

export const AchievementsProvider = ({ children }) => {
    const [data, setData] = useState<AchievementsSharedData>({});

    let { address } = useGetAccountInfo();
    const { stakingInfo } = useStoreContext() as StoreContextType;

    // Metadata functions
    const getCelestialsCustodian = (): TravelersLogPageMetadata => {
        const type = 'Custodian';

        const badges = [
            {
                title: "Aurora's Awakening",
                text: 'Minted at least one Aurora from Art of Menhir',
                assets: getCelestialsAssets(type, 'Aurora'),
            },
            {
                title: 'Verdant Visionary',
                text: 'Minted at least one Verdant from Art of Menhir',
                assets: getCelestialsAssets(type, 'Verdant'),
            },
            {
                title: "Solara's Spark",
                text: 'Minted at least one Solara from Art of Menhir',
                assets: getCelestialsAssets(type, 'Solara'),
            },
            {
                title: "Emberheart's Enigma",
                text: 'Minted at least one Emberheart from Art of Menhir',
                assets: getCelestialsAssets(type, 'Emberheart'),
            },
            {
                title: 'Aetheris Ascendant',
                text: 'Minted at least one Aetheris from Art of Menhir',
                assets: getCelestialsAssets(type, 'Aetheris'),
            },
            {
                title: 'Celestials Custodian',
                text: 'Minted at least one of each Celestials from Art of Menhir',
                assets: getCelestialsAssets(type, 'Celestials'),
            },
        ];

        const getBadges = async (page: {
            aurora: number;
            verdant: number;
            solara: number;
            emberheart: number;
            aetheris: number;
        }): Promise<TravelersLogBadge[]> => {
            const baseValues = [page?.aurora, page?.verdant, page?.solara, page?.emberheart, page?.aetheris];
            const celestialsCustodian = [...baseValues, baseValues.every((amount) => amount > 0) ? 1 : 0];

            return _.map(badges, (badge, index) => ({
                ...badge,
                isUnlocked: celestialsCustodian[index] >= 1,
                value: index === badges.length - 1 ? 0 : celestialsCustodian[index],
            }));
        };

        return {
            getBadges,
            getData: getCelestialsPage,
            dataKey: 'celestialsPage',
        };
    };

    const getCelestialsCurator = (): TravelersLogPageMetadata => {
        const type = 'Curator';

        const badges = [
            {
                title: 'Aurora Curator',
                text: 'Minted at least 5 Aurora from Art of Menhir',
                assets: getCelestialsAssets(type, 'Aurora'),
            },
            {
                title: 'Verdant Curator',
                text: 'Minted at least 5 Verdant from Art of Menhir',
                assets: getCelestialsAssets(type, 'Verdant'),
            },
            {
                title: 'Solara Curator',
                text: 'Minted at least 5 Solara from Art of Menhir',
                assets: getCelestialsAssets(type, 'Solara'),
            },
            {
                title: 'Emberheart Curator',
                text: 'Minted at least 5 Emberheart from Art of Menhir',
                assets: getCelestialsAssets(type, 'Emberheart'),
            },
            {
                title: 'Aetheris Curator',
                text: 'Minted at least 5 Aetheris from Art of Menhir',
                assets: getCelestialsAssets(type, 'Aetheris'),
            },
            {
                title: 'Celestials Curator',
                text: 'Minted at least 5 of each Celestials from Art of Menhir',
                assets: getCelestialsAssets(type, 'Celestials'),
            },
        ];

        const getBadges = async (page: {
            aurora: number;
            verdant: number;
            solara: number;
            emberheart: number;
            aetheris: number;
        }): Promise<TravelersLogBadge[]> => {
            const baseValues = [page?.aurora, page?.verdant, page?.solara, page?.emberheart, page?.aetheris];
            const celestialsCurator = [...baseValues, baseValues.every((amount) => amount >= 5) ? 1 : 0];

            return _.map(badges, (badge, index) => ({
                ...badge,
                isUnlocked:
                    index === badges.length - 1 ? (_.last(celestialsCurator) as number) > 0 : celestialsCurator[index] >= 5,
                value: index === badges.length - 1 ? 0 : celestialsCurator[index],
            }));
        };

        return {
            getBadges,
            getData: getCelestialsPage,
            dataKey: 'celestialsPage',
        };
    };

    const getCelestialsCollector = (): TravelersLogPageMetadata => {
        const badges = [
            {
                title: 'Aficionado',
                text: 'Own at least one of each of the 5 Celestials from Art of Menhir',
                assets: getCelestialsCollectorAssets(1),
            },
            {
                title: 'Advocate',
                text: 'Own at least 2 of each of the 5 Celestials from Art of Menhir',
                assets: getCelestialsCollectorAssets(2),
            },
            {
                title: 'Allegiant',
                text: 'Own at least 5 of each of the 5 Celestials from Art of Menhir',
                assets: getCelestialsCollectorAssets(3),
            },
        ];

        const getBadges = async (balance: number[]): Promise<TravelersLogBadge[]> => {
            const limits = [1, 2, 5];

            return _.map(badges, (badge, index) => ({
                ...badge,
                isUnlocked: balance.every((balance) => balance >= limits[index]),
            }));
        };

        return {
            getBadges,
            getData: getCelestialsBalance,
            dataKey: 'celestialsBalance',
        };
    };

    const getCelestialsHoarder = (): TravelersLogPageMetadata => {
        const badges = [
            {
                title: 'Keeper',
                text: 'Own at least 10 Celestials from Art of Menhir',
                assets: getCelestialsHoarderAssets(1),
            },
            {
                title: 'Gatherer',
                text: 'Own at least 30 Celestials from Art of Menhir',
                assets: getCelestialsHoarderAssets(2),
            },
            {
                title: 'Stockpiler',
                text: 'Own at least 100 Celestials from Art of Menhir',
                assets: getCelestialsHoarderAssets(3),
            },
        ];

        const getBadges = async (balance: number[]): Promise<TravelersLogBadge[]> => {
            const limits = [10, 30, 100];

            return _.map(badges, (badge, index) => ({
                ...badge,
                isUnlocked: _.sum(balance) >= limits[index],
                value: _.sum(balance),
            }));
        };

        return {
            getBadges,
            getData: getCelestialsBalance,
            dataKey: 'celestialsBalance',
        };
    };

    const getBudgetTravelers = (): TravelersLogPageMetadata => {
        const badges = [
            {
                title: 'Common Holder',
                text: 'Have at least one Common Traveler staked',
                assets: getBudgetTravelersCommonAssets(1),
            },
            {
                title: 'Commons Patron',
                text: 'Have at least 2 Common Travelers staked',
                assets: getBudgetTravelersCommonAssets(2),
            },
            {
                title: 'Commons Whale',
                text: 'Have at least 3 Common Travelers staked',
                assets: getBudgetTravelersCommonAssets(3),
            },
            {
                title: 'Uncommon Holder',
                text: 'Have at least one Uncommon Traveler staked',
                assets: getBudgetTravelersUncommonAssets(1),
            },
            {
                title: 'Uncommons Patron',
                text: 'Have at least 2 Uncommon Travelers staked',
                assets: getBudgetTravelersUncommonAssets(2),
            },
            {
                title: 'Uncommons Whale',
                text: 'Have at least 3 Uncommon Travelers staked',
                assets: getBudgetTravelersUncommonAssets(3),
            },
        ];

        const getBadges = async (rarityCount: _.Dictionary<number>): Promise<TravelersLogBadge[]> => {
            const limits = [1, 2, 3];

            return _.map(badges, (badge, index) => {
                const rarityClass = index >= 3 ? '2' : '1';

                return {
                    ...badge,
                    isUnlocked: rarityCount[rarityClass] >= limits[index % 3],
                    value: rarityCount[rarityClass],
                };
            });
        };

        return {
            getBadges,
            getData: getRarityCount,
            dataKey: 'rarityCount',
        };
    };

    const getRareTravelers = (): TravelersLogPageMetadata => {
        const badges = [
            {
                title: 'Rare Holder',
                text: 'Have at least one Rare Traveler staked',
                assets: getRareTravelersRareAssets(1),
            },
            {
                title: 'Rares Patron',
                text: 'Have at least 2 Rare Travelers staked',
                assets: getRareTravelersRareAssets(2),
            },
            {
                title: 'Rares Whale',
                text: 'Have at least 3 Rare Travelers staked',
                assets: getRareTravelersRareAssets(3),
            },
            {
                title: 'Royal Holder',
                text: 'Have at least one Royal Traveler staked',
                assets: getRareTravelersRoyalAssets(1),
            },
            {
                title: 'Royals Patron',
                text: 'Have at least 2 Royal Travelers staked',
                assets: getRareTravelersRoyalAssets(2),
            },
            {
                title: 'Royals Whale',
                text: 'Have at least 3 Royal Travelers staked',
                assets: getRareTravelersRoyalAssets(3),
            },
        ];

        const getBadges = async (rarityCount: _.Dictionary<number>): Promise<TravelersLogBadge[]> => {
            const limits = [1, 2, 3];

            return _.map(badges, (badge, index) => {
                const rarityClass = index >= 3 ? '4' : '3';

                return {
                    ...badge,
                    isUnlocked: rarityCount[rarityClass] >= limits[index % 3],
                    value: rarityCount[rarityClass],
                };
            });
        };

        return {
            getBadges,
            getData: getRarityCount,
            dataKey: 'rarityCount',
        };
    };

    const getVarietyHunter = (): TravelersLogPageMetadata => {
        const badges = [
            {
                title: 'Common Hunter',
                text: 'Have at least one Common Traveler staked',
                assets: getBudgetTravelersCommonAssets(1),
            },
            {
                title: 'Uncommon Hunter',
                text: 'Have at least one Uncommon Traveler staked',
                assets: getBudgetTravelersUncommonAssets(1),
            },
            {
                title: 'Rare Hunter',
                text: 'Have at least one Rare Traveler staked',
                assets: getRareTravelersRareAssets(1),
            },
            {
                title: 'Royal Hunter',
                text: 'Have at least one Royal Traveler staked',
                assets: getRareTravelersRoyalAssets(1),
            },
            {
                title: 'Elder Hunter',
                text: 'Have at least one Elder staked',
                assets: getEldersAssets(),
            },
        ];

        const getBadges = async (rarityCount: _.Dictionary<number>): Promise<TravelersLogBadge[]> => {
            const classes = [1, 2, 3, 4, 0];

            return _.map(badges, (badge, index) => {
                const rarityClass = classes[index];

                return {
                    ...badge,
                    isUnlocked: rarityCount[rarityClass] > 0,
                    value: rarityCount[rarityClass],
                };
            });
        };

        return {
            getBadges,
            getData: getRarityCount,
            dataKey: 'rarityCount',
        };
    };

    const getOccultOdyssey = (): TravelersLogPageMetadata => {
        const keyword = 'Occult';
        const limits = [200, 60, 60, 50, 18, 40000];

        const badges = [
            {
                title: `${keyword} Mastery`,
                text: `Complete ${limits[0]} total quests`,
                assets: getSummaryAssets(0, keyword),
            },
            {
                title: `${keyword} Herbalist`,
                text: `Complete ${limits[1]} Herbalism quests`,
                assets: getSummaryAssets(1, keyword),
            },
            {
                title: `${keyword} Craftsman`,
                text: `Complete ${limits[2]} Jewelcrafting quests`,
                assets: getSummaryAssets(2, keyword),
            },
            {
                title: `${keyword} Divinator`,
                text: `Complete ${limits[3]} Divination quests`,
                assets: getSummaryAssets(3, keyword),
            },
            {
                title: `${keyword} Performer`,
                text: `Earn ${limits[4]} Golden Tickets`,
                assets: getSummaryAssets(4, keyword),
            },
            {
                title: `${keyword} Industrialist`,
                text: `Earn ${limits[5]} Energy`,
                assets: getSummaryAssets(5, keyword),
            },
        ];

        const getBadges = async (summary: LogSummary): Promise<TravelersLogBadge[]> => {
            return _.map(badges, (badge, index) => {
                const keys: string[] = Object.keys(summary);

                return {
                    ...badge,
                    isUnlocked: summary[keys[index]] >= limits[index],
                    value: summary[keys[index]],
                };
            });
        };

        return {
            getBadges,
            getData: getSummary,
            dataKey: 'summary',
        };
    };

    const getEsotericExpedition = (): TravelersLogPageMetadata => {
        const keyword = 'Esoteric';
        const limits = [100, 40, 40, 30, 12, 20000];

        const badges = [
            {
                title: `${keyword} Mastery`,
                text: `Complete ${limits[0]} total quests`,
                assets: getSummaryAssets(0, keyword),
            },
            {
                title: `${keyword} Herbalist`,
                text: `Complete ${limits[1]} Herbalism quests`,
                assets: getSummaryAssets(1, keyword),
            },
            {
                title: `${keyword} Craftsman`,
                text: `Complete ${limits[2]} Jewelcrafting quests`,
                assets: getSummaryAssets(2, keyword),
            },
            {
                title: `${keyword} Divinator`,
                text: `Complete ${limits[3]} Divination quests`,
                assets: getSummaryAssets(3, keyword),
            },
            {
                title: `${keyword} Performer`,
                text: `Earn ${limits[4]} Golden Tickets`,
                assets: getSummaryAssets(4, keyword),
            },
            {
                title: `${keyword} Industrialist`,
                text: `Earn ${limits[5]} Energy`,
                assets: getSummaryAssets(5, keyword),
            },
        ];

        const getBadges = async (summary: LogSummary): Promise<TravelersLogBadge[]> => {
            return _.map(badges, (badge, index) => {
                const keys: string[] = Object.keys(summary);

                return {
                    ...badge,
                    isUnlocked: summary[keys[index]] >= limits[index],
                    value: summary[keys[index]],
                };
            });
        };

        return {
            getBadges,
            getData: getSummary,
            dataKey: 'summary',
        };
    };

    const getMagicalJourney = (): TravelersLogPageMetadata => {
        const keyword = 'Magical';
        const limits = [50, 20, 20, 12, 6, 8000];

        const badges = [
            {
                title: `${keyword} Mastery`,
                text: `Complete ${limits[0]} total quests`,
                assets: getSummaryAssets(0, keyword),
            },
            {
                title: `${keyword} Herbalist`,
                text: `Complete ${limits[1]} Herbalism quests`,
                assets: getSummaryAssets(1, keyword),
            },
            {
                title: `${keyword} Craftsman`,
                text: `Complete ${limits[2]} Jewelcrafting quests`,
                assets: getSummaryAssets(2, keyword),
            },
            {
                title: `${keyword} Divinator`,
                text: `Complete ${limits[3]} Divination quests`,
                assets: getSummaryAssets(3, keyword),
            },
            {
                title: `${keyword} Performer`,
                text: `Earn ${limits[4]} Golden Tickets`,
                assets: getSummaryAssets(4, keyword),
            },
            {
                title: `${keyword} Industrialist`,
                text: `Earn ${limits[5]} Energy`,
                assets: getSummaryAssets(5, keyword),
            },
        ];

        const getBadges = async (summary: LogSummary): Promise<TravelersLogBadge[]> => {
            return _.map(badges, (badge, index) => {
                const keys: string[] = Object.keys(summary);

                return {
                    ...badge,
                    isUnlocked: summary[keys[index]] >= limits[index],
                    value: summary[keys[index]],
                };
            });
        };

        return {
            getBadges,
            getData: getSummary,
            dataKey: 'summary',
        };
    };

    // Data functions
    const getCelestialsPage = async () => {
        setData({
            ...data,
            celestialsPage: await getPageCelestials(),
        });
    };

    const getCelestialsBalance = async () => {
        setData({
            ...data,
            celestialsBalance: await Promise.all(
                Array.from({ length: 5 }, (_, index) => `${AOM_COLLECTION_ID}-${zeroPad(index + 1)}`).map(async (id) => {
                    return await getSFTBalance(id);
                })
            ),
        });
    };

    const getRarityCount = async () => {
        const rarityCount = {
            0: 5,
            1: 5,
            2: 2,
            3: 4,
            4: 1,
        };

        setData({
            ...data,
            rarityCount,
        });
    };

    const getSummary = async () => {
        setData({
            ...data,
            summary: await getLogSummary(),
        });
    };

    // Helpers
    const getSFTBalance = async (id: string): Promise<number> => {
        try {
            const { data } = await getSFTDetails(address, id);
            return !data ? 0 : Number.parseInt(data.balance);
        } catch (error: any) {
            return 0;
        }
    };

    const [pages] = useState<TravelersLogPageMetadata[]>([
        getCelestialsCustodian(),
        getCelestialsCurator(),
        getCelestialsCollector(),
        getCelestialsHoarder(),
        getBudgetTravelers(),
        getRareTravelers(),
        getVarietyHunter(),
        getOccultOdyssey(),
        getEsotericExpedition(),
        getMagicalJourney(),
    ]);

    return (
        <AchievementsContext.Provider
            value={{
                data,
                pages,
            }}
        >
            {children}
        </AchievementsContext.Provider>
    );
};
