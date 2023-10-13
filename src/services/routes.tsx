import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Section from '../components/Section';
import Leaderboard from '../components/Competitions/Leaderboard';
import Stake from '../components/Staking/Stake';
import Unstake from '../components/Staking/Unstake';
import CompetitionDetails from '../shared/CompetitionDetails';
import Raffles from '../components/Competitions/Raffles';
import Battles from '../components/Competitions/Battles';
import Entry from '../components/Competitions/Entry';
import Rewards from '../components/Rewards';
import Unbond from '../components/Staking/Unbond';
import Shop from '../components/Shop';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
    quests: 'quests',
    raffles: 'raffles',
    battles: 'battles',
    stake: 'unstaked',
    unstake: 'staked',
    unbond: 'unbonded',
    current: 'current',
    past: 'past',
    entry: 'entry',
    leaderboard: 'leaderboard',
    rewards: 'rewards',
    shop: 'shop',
};

export const routes = [
    // Gameplay
    {
        path: routeNames.gameplay,
        component: Gameplay,
        authenticatedRoute: true,
        isMainRoute: false,
    },
    // Staking
    {
        path: routeNames.staking,
        component: Staking,
        authenticatedRoute: true,
        isMainRoute: true,
        children: [
            {
                path: routeNames.stake,
                component: Stake,
            },
            {
                path: routeNames.unstake,
                component: Unstake,
            },
            {
                path: routeNames.unbond,
                component: Unbond,
            },
        ],
        defaultChildRoute: routeNames.stake,
    },
    // Quests
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
        isMainRoute: true,
    },
    // Raffles
    {
        path: routeNames.raffles,
        component: Section,
        authenticatedRoute: true,
        isMainRoute: true,
        children: [
            {
                path: routeNames.past,
                component: Raffles,
                isTabRoute: true,
            },
            {
                path: routeNames.current,
                component: Raffles,
                isTabRoute: true,
            },
            {
                path: `:id`,
                component: CompetitionDetails,
            },
        ],
        defaultChildRoute: routeNames.current,
    },
    // Battles
    {
        path: routeNames.battles,
        component: Section,
        authenticatedRoute: true,
        isMainRoute: true,
        children: [
            {
                path: routeNames.past,
                component: Battles,
                isTabRoute: true,
            },
            {
                path: routeNames.leaderboard,
                component: Leaderboard,
                isTabRoute: true,
            },
            {
                path: routeNames.entry,
                component: Entry,
                isTabRoute: true,
            },
            {
                path: `:id`,
                component: CompetitionDetails,
            },
        ],
        defaultChildRoute: routeNames.leaderboard,
    },
    // Rewards
    {
        path: routeNames.rewards,
        component: Rewards,
        authenticatedRoute: true,
        isMainRoute: true,
    },
    // Shop
    {
        path: routeNames.shop,
        component: Shop,
        authenticatedRoute: true,
        isMainRoute: true,
    },
];
