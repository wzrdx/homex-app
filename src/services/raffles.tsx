import { getEmptyPNG, getFullTicket, getLogoBox, getMvxLogo } from './assets';
import { RESOURCE_ELEMENTS } from './resources';

const getNFTPrize = (amount: number, type: 'Elders' | 'Travelers') => ({
    backgroundColor: '#421218',
    imageSrc: getLogoBox(),
    height: { md: '44px', lg: '56px' },
    textColor: 'primaryDark',
    text: `${amount} ${type}`,
});

const getEGLDPrize = (amount: number) => ({
    backgroundColor: '#2b2d31',
    imageSrc: getMvxLogo(),
    height: { md: '30px', lg: '42px' },
    textColor: 'whitesmoke',
    text: `${amount} EGLD`,
});

const getTicketsPrize = (amount: number) => ({
    backgroundColor: '#8c5816',
    imageSrc: getFullTicket(),
    height: { md: '36px', lg: '50px' },
    textColor: 'brightWheat',
    text: `${amount} Golden Tickets`,
});

const getEssencePrize = (amount: number) => ({
    backgroundColor: '#3a182d',
    imageSrc: RESOURCE_ELEMENTS.essence.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.essence',
    text: `${amount} ESSENCE`,
});

const getEnergyPrize = (amount: number) => ({
    backgroundColor: '#101e2b',
    imageSrc: RESOURCE_ELEMENTS.energy.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.energy',
    text: `${amount} ENERGY`,
});

export const RAFFLES: any[] = [
    {
        id: 1,
        prizes: [getNFTPrize(2, 'Elders'), getEGLDPrize(25), getTicketsPrize(20)],
    },
    {
        id: 2,
        prizes: [getNFTPrize(6, 'Travelers'), getEGLDPrize(10), getTicketsPrize(32), getEssencePrize(600)],
    },
    {
        id: 3,
        prizes: [
            getNFTPrize(6, 'Travelers'),
            getEGLDPrize(8),
            getTicketsPrize(46),
            getEnergyPrize(2400),
            getEssencePrize(1200),
        ],
    },
];
