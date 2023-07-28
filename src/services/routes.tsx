import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Section from '../components/Section';
import Leaderboard from '../components/Competitions/Leaderboard';
import Stake from '../components/Staking/Stake';
import Unstake from '../components/Staking/Unstake';
import RaffleDetails from '../shared/RaffleDetails';
import Raffles from '../components/Competitions/Raffles';
import Battles from '../components/Competitions/Battles';
import Entry from '../components/Competitions/Entry';
import Rewards from '../components/Rewards';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
    quests: 'quests',
    raffles: 'raffles',
    battles: 'battles',
    stake: 'available',
    unstake: 'staked',
    current: 'current',
    past: 'past',
    entry: 'entry',
    leaderboard: 'leaderboard',
    rewards: 'rewards',
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
                component: RaffleDetails,
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
];
