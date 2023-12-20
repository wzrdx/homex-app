import Staking from '../components/Staking';
import Quests from '../components/Quests';
import Shop from '../components/Shop';

export const routeNames = {
    unlock: 'unlock',
    main: '/',
    staking: 'staking',
    quests: 'quests',
    shop: 'shop',
};

export const routes = [
    {
        path: routeNames.staking,
        component: Staking,
        authenticatedRoute: true,
        isMainRoute: true,
    },
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
        isMainRoute: true,
    },
    {
        path: routeNames.shop,
        component: Shop,
        authenticatedRoute: true,
        isMainRoute: true,
    },
];
