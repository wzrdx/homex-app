import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Section from '../components/Section';
import Stake from '../components/Staking/Stake';
import Unstake from '../components/Staking/Unstake';
import CompetitionDetails from '../shared/CompetitionDetails';
import Raffles from '../components/Competitions/Raffles';
import Rewards from '../components/Rewards';
import Unbond from '../components/Staking/Unbond';
import Shop from '../components/Shop';
import Profile from '../components/XP/Profile';
import XPLeaderboard from '../components/XP/XPLeaderboard';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
    quests: 'quests',
    raffles: 'raffles',
    stake: 'unstaked',
    unstake: 'staked',
    unbond: 'unbonded',
    current: 'current',
    past: 'past',
    entry: 'entry',
    leaderboard: 'leaderboard',
    rewards: 'rewards',
    shop: 'shop',
    profile: 'profile',
    xp: 'xp',
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
                isTabRoute: true,
            },
            {
                path: routeNames.unstake,
                component: Unstake,
                isTabRoute: true,
            },
            {
                path: routeNames.unbond,
                component: Unbond,
                isTabRoute: true,
            },
        ],
        defaultChildRoute: routeNames.unstake,
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
    // XP
    {
        path: routeNames.xp,
        component: Section,
        authenticatedRoute: true,
        isMainRoute: false,
        children: [
            {
                path: routeNames.profile,
                component: Profile,
                isTabRoute: true,
            },
            {
                path: routeNames.leaderboard,
                component: XPLeaderboard,
                isTabRoute: true,
            },
        ],
        defaultChildRoute: routeNames.profile,
    },
];
