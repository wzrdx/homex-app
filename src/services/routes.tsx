import Staking from '../components/Staking';
import Quests from '../components/Quests';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    staking: 'staking',
    quests: 'quests',
};

export const routes = [
    // Staking
    {
        path: routeNames.staking,
        component: Staking,
        authenticatedRoute: true,
        isMainRoute: true,
    },
    // Quests
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
        isMainRoute: true,
    },
];
