import Energy from '../components/Energy';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Rewards from '../components/Rewards';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    energy: 'energy',
    quests: 'quests',
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
        path: routeNames.rewards,
        component: Rewards,
        authenticatedRoute: true,
    },
];
