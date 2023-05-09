import Energy from '../components/Energy';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Leaderboard from '../components/Leaderboard';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    energy: 'energy',
    quests: 'quests',
    leaderboard: 'leaderboard',
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
];
