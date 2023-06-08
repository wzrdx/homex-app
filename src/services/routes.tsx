import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Rewards from '../components/Rewards';
import Leaderboard from '../components/Rewards/Leaderboard';
import Raffle from '../components/Rewards/Raffle';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
    quests: 'quests',
    rewards: 'rewards',
    leaderboard: 'leaderboard',
    raffle: 'raffle',
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
                path: routeNames.leaderboard,
                component: Leaderboard,
            },
            {
                path: routeNames.raffle,
                component: Raffle,
            },
        ],
    },
];

export const getRoute = (path: string) => routes.find((route) => route.path === path);
