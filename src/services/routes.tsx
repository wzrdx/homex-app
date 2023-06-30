import Staking from '../components/Staking';
import Gameplay from '../components/Gameplay';
import Quests from '../components/Quests';
import Rewards from '../components/Raffles';
import Leaderboard from '../components/Rewards/Leaderboard';
import Raffles from '../components/Rewards/RafflesGrid';
import Prizes from '../components/Rewards/Prizes';
import Stake from '../components/Staking/Stake';
import Unstake from '../components/Staking/Unstake';
import RaffleDetails from '../shared/RaffleDetails';
import RafflesGrid from '../components/Rewards/RafflesGrid';

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
};

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
        defaultChildRoute: routeNames.stake,
    },
    {
        path: routeNames.quests,
        component: Quests,
        authenticatedRoute: true,
    },
    {
        path: routeNames.raffles,
        component: Rewards,
        authenticatedRoute: true,
        children: [
            {
                path: routeNames.past,
                component: RafflesGrid,
                isTabRoute: true,
            },
            {
                path: routeNames.current,
                component: RafflesGrid,
                isTabRoute: true,
            },
            {
                path: `:id`,
                component: RaffleDetails,
            },
        ],
        defaultChildRoute: routeNames.current,
    },
];
