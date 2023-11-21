import Background from '../assets/backgrounds/1.jpg';
import Unlock from '../assets/backgrounds/2.jpg';
import Ticket from '../assets/ticket_small.png';
import TicketSFT from '../assets/ticket_sft.jpg';
import Frame from '../assets/frame.png';
import Vision from '../assets/images/vision.png';
import FrameGlow from '../assets/videos/glow.webm';
import SpinningTicket from '../assets/videos/spinning_ticket.webm';
import Logo from '../assets/logo_small.png';
import EldersLogo from '../assets/logo_elders.png';
import MvxImage from '../assets/multiversx.jpg';
import MvxLogo from '../assets/logo_x.png';
import LogoBox from '../assets/logo_box.png';
import EmptyPNG from '../assets/empty.png';

import EXOTicket from '../assets/images/exo.png';

import RaffleGiants from '../assets/images/raffles/2GiantsVillage.jpg';
import RaffleHomeX from '../assets/images/raffles/2HomeX.jpg';
import RaffleRektNerds from '../assets/images/raffles/2RektNerds.jpg';
import RaffleSuperVictor from '../assets/images/raffles/2SuperVictor.jpg';

import ArtDrop from '../assets/images/Verdant.jpg';

import Badge_1 from '../assets/log/1.png';
import Badge_2 from '../assets/log/2.png';
import Badge_3 from '../assets/log/3.png';

// Achievements
export const getBadge = (index: number) => {
    switch (index) {
        case 1:
            return Badge_1;

        case 2:
            return Badge_2;

        case 3:
            return Badge_3;

        default:
            console.error('Unknown badge');
    }
};

export const getLayoutBackground = () => Background;
export const getUnlockBackground = () => Unlock;

export const getFrame = () => Frame;
export const getVisionImage = () => Vision;
export const getFullTicket = () => Ticket;
export const getTicketSFT = () => TicketSFT;
export const getFrameGlow = () => FrameGlow;
export const getSpinningTicket = () => SpinningTicket;

export const getSmallLogo = () => Logo;
export const getLogoBox = () => LogoBox;
export const getEldersLogo = () => EldersLogo;
export const getMvxImage = () => MvxImage;
export const getMvxLogo = () => MvxLogo;

export const getEmptyPNG = () => EmptyPNG;

export const getEXOTicket = () => EXOTicket;

export const getRaffleGiants = () => RaffleGiants;
export const getRaffleHomeX = () => RaffleHomeX;
export const getRaffleRektNerds = () => RaffleRektNerds;
export const getRaffleSuperVictor = () => RaffleSuperVictor;

export const getArtDrop = () => ArtDrop;
