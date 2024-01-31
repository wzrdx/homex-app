import { createContext, useContext, useState } from 'react';
import {
    getBudgetTravelersCommonAssets,
    getBudgetTravelersUncommonAssets,
    getCelestialsAssets,
    getCelestialsCollectorAssets,
    getCelestialsHoarderAssets,
    getEldersAssets,
    getRareTravelersRareAssets,
    getRareTravelersRoyalAssets,
} from './assets';
import { getSFTDetails } from './resources';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { AOM_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../blockchain/config';
import _ from 'lodash';
import { getPageCelestials } from '../blockchain/game/api/achievements/getPageCelestials';
import { zeroPad } from './helpers';
import { useStoreContext, StoreContextType } from './store';
import { Stake } from '../blockchain/game/hooks/useGetStakingInfo';
import { getRarityClasses } from '../blockchain/game/api/getRarityClasses';

enum TravelersLogPageRarity {
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
    },
    {
        index: getIndex(),
        title: 'Celestials Curator',
        dateAdded: new Date('2023-11-01'),
        rarity: TravelersLogPageRarity.Legendary,
    },
    {
        index: getIndex(),
        title: 'Celestials Collector',
        dateAdded: new Date('2023-12-01'),
        rarity: TravelersLogPageRarity.Rare,
    },
    {
        index: getIndex(),
        title: 'Celestials Hoarder',
        dateAdded: new Date('2023-12-01'),
        rarity: TravelersLogPageRarity.Rare,
    },
    {
        index: getIndex(),
        title: 'Budget Travelers',
        dateAdded: new Date('2023-12-29'),
        rarity: TravelersLogPageRarity.Common,
    },
    {
        index: getIndex(),
        title: 'Rare Travelers',
        dateAdded: new Date('2024-01-13'),
        rarity: TravelersLogPageRarity.Uncommon,
    },
    {
        index: getIndex(),
        title: 'Variety Hunter',
        dateAdded: new Date('2024-01-16'),
        rarity: TravelersLogPageRarity.Rare,
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
                Array.from({ length: 5 }, (_, index) => `${AOM_ID}-${zeroPad(index + 1)}`).map(async (id) => {
                    return await getSFTBalance(id);
                })
            ),
        });
    };

    const getRarityCount = async () => {
        if (!stakingInfo) {
            return;
        }

        const stakedTravelers: Stake[] = _.filter(
            stakingInfo.tokens,
            (token) => token.tokenId === TRAVELERS_COLLECTION_ID && !token.timestamp
        );

        const rarities = await getRarityClasses(_.map(stakedTravelers, (token) => token.nonce));
        const rarityCount = _.countBy(rarities, 'rarityClass');

        // Elders
        rarityCount[0] = _(stakingInfo.tokens)
            .filter((token) => token.tokenId === ELDERS_COLLECTION_ID && !token.timestamp)
            .size();

        setData({
            ...data,
            rarityCount,
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
