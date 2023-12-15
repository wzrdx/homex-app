import { getCelestialsAssets, getCelestialsCollector, getCelestialsHoarder } from './assets';

export interface TravelersLogPage {
    title: string;
    isNew: boolean;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
    limits: number[];
    badges: {
        title: string;
        text: string;
        isUnlocked?: boolean;
        value?: number;
        assets: [string, string];
    }[];
}

export const PAGES: TravelersLogPage[] = [
    {
        title: 'Celestials Custodian',
        isNew: false,
        rarity: 'Epic',
        limits: [1],
        badges: [
            {
                title: "Aurora's Awakening",
                text: 'Minted at least one Aurora from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Aurora'),
            },
            {
                title: 'Verdant Visionary',
                text: 'Minted at least one Verdant from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Verdant'),
            },
            {
                title: "Solara's Spark",
                text: 'Minted at least one Solara from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Solara'),
            },
            {
                title: "Emberheart's Enigma",
                text: 'Minted at least one Emberheart from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Emberheart'),
            },
            {
                title: 'Aetheris Ascendant',
                text: 'Minted at least one Aetheris from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Aetheris'),
            },
            {
                title: 'Celestials Custodian',
                text: 'Minted at least one of each Celestials from Art of Menhir',
                assets: getCelestialsAssets('Custodian', 'Celestials'),
            },
        ],
    },
    {
        title: 'Celestials Curator',
        isNew: false,
        rarity: 'Legendary',
        limits: [5],
        badges: [
            {
                title: 'Aurora Curator',
                text: 'Minted at least 5 Aurora from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Aurora'),
            },
            {
                title: 'Verdant Curator',
                text: 'Minted at least 5 Verdant from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Verdant'),
            },
            {
                title: 'Solara Curator',
                text: 'Minted at least 5 Solara from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Solara'),
            },
            {
                title: 'Emberheart Curator',
                text: 'Minted at least 5 Emberheart from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Emberheart'),
            },
            {
                title: 'Aetheris Curator',
                text: 'Minted at least 5 Aetheris from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Aetheris'),
            },
            {
                title: 'Celestials Curator',
                text: 'Minted at least 5 of each Celestials from Art of Menhir',
                assets: getCelestialsAssets('Curator', 'Celestials'),
            },
        ],
    },
    {
        title: 'Celestials Collector',
        isNew: true,
        rarity: 'Rare',
        limits: [1, 2, 5],
        badges: [
            {
                title: 'Aficionado',
                text: 'Own at least one of each Celestials from Art of Menhir',
                assets: getCelestialsCollector(1),
            },
            {
                title: 'Advocate',
                text: 'Own at least 2 of each Celestials from Art of Menhir',
                assets: getCelestialsCollector(2),
            },
            {
                title: 'Allegiant',
                text: 'Own at least 5 of each Celestials from Art of Menhir',
                assets: getCelestialsCollector(3),
            },
        ],
    },
    {
        title: 'Celestials Hoarder',
        isNew: true,
        rarity: 'Rare',
        limits: [10, 30, 100],
        badges: [
            {
                title: 'Keeper',
                text: 'Own at least 10 Celestials from Art of Menhir',
                assets: getCelestialsHoarder(1),
            },
            {
                title: 'Gatherer',
                text: 'Own at least 30 Celestials from Art of Menhir',
                assets: getCelestialsHoarder(2),
            },
            {
                title: 'Stockpiler',
                text: 'Own at least 100 Celestials from Art of Menhir',
                assets: getCelestialsHoarder(3),
            },
        ],
    },
];
