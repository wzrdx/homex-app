import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Rewards from '../components/Rewards';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    gameplay: 'gameplay',
    staking: 'staking',
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
    },
];
