import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Rewards from '../components/Rewards';
import Leaderboard from '../components/Rewards/Leaderboard';
import Raffle from '../components/Rewards/Raffle';
import Prizes from '../components/Rewards/Prizes';
import Stake from '../components/Staking/Stake';
import Unstake from '../components/Staking/Unstake';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
    quests: 'quests',
    rewards: 'rewards',
    leaderboard: 'leaderboard',
    raffle: 'raffle',
    prizes: 'prizes',
    stake: 'stake',
    unstake: 'unstake',
};

// Main routes after login
export const routes = [
    {
        path: routeNames.gameplay,
        component: Gameplay,
        authenticatedRoute: true,
    },
    {
        path: routeNames.staking,
        component: Staking,
        authenticatedRoute: true,
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
    },
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
    },
    {
        path: routeNames.rewards,
        component: Rewards,
        authenticatedRoute: true,
        children: [
            {
                path: routeNames.raffle,
                component: Raffle,
            },
            {
                path: routeNames.leaderboard,
                component: Leaderboard,
            },
            {
                path: routeNames.prizes,
                component: Prizes,
            },
        ],
    },
];
