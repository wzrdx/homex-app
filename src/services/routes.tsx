import Energy from '../components/Energy';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Leaderboard from '../components/Leaderboard';
import Rewards from '../components/Rewards';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    energy: 'energy',
    quests: 'quests',
    leaderboard: 'leaderboard',
    rewards: 'rewards',
};

// Main routes after login
export const routes = [
    {
        path: routeNames.gameplay,
        component: Gameplay,
        authenticatedRoute: true,
    },
    {
        path: routeNames.energy,
        component: Energy,
        authenticatedRoute: true,
    },
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
    },
    {
        path: routeNames.leaderboard,
        component: Leaderboard,
        authenticatedRoute: true,
    },
    {
        path: routeNames.rewards,
        component: Rewards,
        authenticatedRoute: true,
    },
];
