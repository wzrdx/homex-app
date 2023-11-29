import Background from '../assets/backgrounds/1.jpg';
import Unlock from '../assets/backgrounds/2.jpg';
import EcoBg from '../assets/backgrounds/eco_bg.jpg';

import AlternateBackground from '../assets/backgrounds/alternate.jpg';
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

import AuroraLocked from '../assets/log/celestials_minters/aurora_locked.png';
import AuroraCustodian from '../assets/log/celestials_minters/aurora_custodian.png';
import AuroraCurator from '../assets/log/celestials_minters/aurora_curator.png';

import VerdantLocked from '../assets/log/celestials_minters/verdant_locked.png';
import VerdantCustodian from '../assets/log/celestials_minters/verdant_custodian.png';
import VerdantCurator from '../assets/log/celestials_minters/verdant_curator.png';

import SolaraLocked from '../assets/log/celestials_minters/solara_locked.png';
import SolaraCustodian from '../assets/log/celestials_minters/solara_custodian.png';
import SolaraCurator from '../assets/log/celestials_minters/solara_curator.png';

import EmberheartLocked from '../assets/log/celestials_minters/emberheart_locked.png';
import EmberheartCustodian from '../assets/log/celestials_minters/emberheart_custodian.png';
import EmberheartCurator from '../assets/log/celestials_minters/emberheart_curator.png';

import AetherisLocked from '../assets/log/celestials_minters/aetheris_locked.png';
import AetherisCustodian from '../assets/log/celestials_minters/aetheris_custodian.png';
import AetherisCurator from '../assets/log/celestials_minters/aetheris_curator.png';

import CelestialsLocked from '../assets/log/celestials_minters/celestials_locked.png';
import CelestialsCustodian from '../assets/log/celestials_minters/celestials_custodian.png';
import CelestialsCurator from '../assets/log/celestials_minters/celestials_curator.png';

import CelestialsCollector1Locked from '../assets/log/celestials_collector/celestials_collector_1_locked.png';
import CelestialsCollector1Unlocked from '../assets/log/celestials_collector/celestials_collector_1_unlocked.png';
import CelestialsCollector2Locked from '../assets/log/celestials_collector/celestials_collector_2_locked.png';
import CelestialsCollector2Unlocked from '../assets/log/celestials_collector/celestials_collector_2_unlocked.png';
import CelestialsCollector3Locked from '../assets/log/celestials_collector/celestials_collector_3_locked.png';
import CelestialsCollector3Unlocked from '../assets/log/celestials_collector/celestials_collector_3_unlocked.png';

// Celestials
export const getCelestialsAssets = (
    type: 'Custodian' | 'Curator',
    badge: 'Aurora' | 'Verdant' | 'Solara' | 'Emberheart' | 'Aetheris' | 'Celestials'
): [string, string] => {
    let assets: [string, string] = ['', ''];

    if (type === 'Custodian') {
        switch (badge) {
            case 'Verdant':
                assets = [VerdantLocked, VerdantCustodian];
                break;

            case 'Emberheart':
                assets = [EmberheartLocked, EmberheartCustodian];
                break;

            case 'Aurora':
                assets = [AuroraLocked, AuroraCustodian];
                break;

            case 'Solara':
                assets = [SolaraLocked, SolaraCustodian];
                break;

            case 'Aetheris':
                assets = [AetherisLocked, AetherisCustodian];
                break;

            case 'Celestials':
                assets = [CelestialsLocked, CelestialsCustodian];
                break;

            default:
                console.error('Unknown Celestials badge');
        }
    }

    if (type === 'Curator') {
        switch (badge) {
            case 'Verdant':
                assets = [VerdantLocked, VerdantCurator];
                break;

            case 'Emberheart':
                assets = [EmberheartLocked, EmberheartCurator];
                break;

            case 'Aurora':
                assets = [AuroraLocked, AuroraCurator];
                break;

            case 'Solara':
                assets = [SolaraLocked, SolaraCurator];
                break;

            case 'Aetheris':
                assets = [AetherisLocked, AetherisCurator];
                break;

            case 'Celestials':
                assets = [CelestialsLocked, CelestialsCurator];
                break;

            default:
                console.error('Unknown Celestials badge');
        }
    }

    return assets;
};

export const getCelestialsCollector = (type: 1 | 2 | 3): [string, string] => {
    let assets: [string, string] = ['', ''];

    switch (type) {
        case 1:
            assets = [CelestialsCollector1Locked, CelestialsCollector1Unlocked];
            break;
        case 2:
            assets = [CelestialsCollector2Locked, CelestialsCollector2Unlocked];
            break;
        case 3:
            assets = [CelestialsCollector3Locked, CelestialsCollector3Unlocked];
            break;
        default:
            console.error('Unknown collector type');
    }

    return assets;
};

export const getLayoutBackground = () => EcoBg;
export const getUnlockBackground = () => Unlock;
export const getAlternateBackground = () => AlternateBackground;

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
