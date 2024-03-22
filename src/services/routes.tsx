// Energy
import Staking from '../components/Staking';
import EnergyStake from '../components/Staking/Stake';
import EnergyUnstake from '../components/Staking/Unstake';
import EnergyUnbond from '../components/Staking/Unbond';
// Maze
import Maze from '../components/Maze';
import Altar from '../components/Maze/Altar';
import MazeStake from '../components/Maze/Stake';
import MazeUnstake from '../components/Maze/Unstake';
// Others
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Section from '../components/Section';
import CompetitionDetails from '../shared/CompetitionDetails';
import Raffles from '../components/Competitions/Raffles';
import Rewards from '../components/Rewards';
import Shop from '../components/Shop';
import Profile from '../components/XP/Profile';
import XPLeaderboard from '../components/XP/XPLeaderboard';
import Inventory from '../components/Maze/Inventory';

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
    maze: 'maze',
    altar: 'altar',
    inventory: 'inventory',
};

export const routes = [
    // Gameplay
    {
        path: routeNames.gameplay,
        component: Gameplay,
        isMainRoute: false,
    },
    // Maze
    {
        path: routeNames.maze,
        component: Maze,
        isMainRoute: true,
        children: [
            {
                path: routeNames.altar,
                title: 'The Altar',
                component: Altar,
                isTabRoute: true,
            },
            {
                path: routeNames.inventory,
                component: Inventory,
                isTabRoute: true,
            },
            {
                path: routeNames.stake,
                component: MazeStake,
                isTabRoute: true,
            },
            {
                path: routeNames.unstake,
                component: MazeUnstake,
                isTabRoute: true,
            },
        ],
        defaultChildRoute: routeNames.altar,
    },
    // Staking
    {
        path: routeNames.staking,
        component: Staking,
        isMainRoute: true,
        children: [
            {
                path: routeNames.stake,
                component: EnergyStake,
                isTabRoute: true,
            },
            {
                path: routeNames.unstake,
                component: EnergyUnstake,
                isTabRoute: true,
            },
            {
                path: routeNames.unbond,
                component: EnergyUnbond,
                isTabRoute: true,
            },
        ],
        defaultChildRoute: routeNames.unstake,
    },
    // Quests
    {
        path: routeNames.quests,
        component: Quests,
        isMainRoute: true,
    },
    // Raffles
    {
        path: routeNames.raffles,
        component: Section,
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
        isMainRoute: true,
    },
    // Shop
    {
        path: routeNames.shop,
        component: Shop,
        isMainRoute: true,
    },
    // XP
    {
        path: routeNames.xp,
        component: Section,
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
