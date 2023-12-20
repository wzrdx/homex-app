import Background from '../assets/backgrounds/1.jpg';
import Unlock from '../assets/backgrounds/2.jpg';

import AlternateBackground from '../assets/backgrounds/alternate.jpg';
import Ticket from '../assets/ticket_small.png';
import TicketSFT from '../assets/ticket_sft.jpg';
import Frame from '../assets/frame.png';
import Vision from '../assets/images/vision.png';
import FrameGlow from '../assets/videos/glow.webm';
import SpinningTicket from '../assets/videos/spinning_ticket.webm';
import Logo from '../assets/logo_small.png';
import EldersLogo from '../assets/logo_elders.png';
import TravelersLogo from '../assets/logo_travelers.png';
import AOMLogo from '../assets/aom.png';

import MvxImage from '../assets/multiversx.jpg';
import MvxLogo from '../assets/logo_x.png';
import LogoBox from '../assets/logo_box.png';
import EmptyPNG from '../assets/empty.png';

import EXOTicket from '../assets/images/exo.png';

import RaffleGiants from '../assets/images/raffles/2GiantsVillage.jpg';
import RaffleHomeX from '../assets/images/raffles/2HomeX.jpg';
import RaffleRektNerds from '../assets/images/raffles/2RektNerds.jpg';
import RaffleSuperVictor from '../assets/images/raffles/2SuperVictor.jpg';

import ArtDrop from '../assets/images/Emberheart.jpg';

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

import CelestialsHoarder1Locked from '../assets/log/celestials_hoarder/celestials_hoarder_1_locked.png';
import CelestialsHoarder1Unlocked from '../assets/log/celestials_hoarder/celestials_hoarder_1_unlocked.png';
import CelestialsHoarder2Locked from '../assets/log/celestials_hoarder/celestials_hoarder_2_locked.png';
import CelestialsHoarder2Unlocked from '../assets/log/celestials_hoarder/celestials_hoarder_2_unlocked.png';
import CelestialsHoarder3Locked from '../assets/log/celestials_hoarder/celestials_hoarder_3_locked.png';
import CelestialsHoarder3Unlocked from '../assets/log/celestials_hoarder/celestials_hoarder_3_unlocked.png';

import CelestialsCollectorLocked from '../assets/log/celestials_collector/locked.png';
import CelestialsCollector1 from '../assets/log/celestials_collector/1.png';
import CelestialsCollector2 from '../assets/log/celestials_collector/2.png';
import CelestialsCollector3 from '../assets/log/celestials_collector/3.png';

import BudgetTravelersCommonLocked from '../assets/log/budget_travelers/common_locked.png';
import BudgetTravelersCommon1 from '../assets/log/budget_travelers/common_1.png';
import BudgetTravelersCommon2 from '../assets/log/budget_travelers/common_2.png';
import BudgetTravelersCommon3 from '../assets/log/budget_travelers/common_3.png';

import BudgetTravelersUncommonLocked from '../assets/log/budget_travelers/uncommon_locked.png';
import BudgetTravelersUncommon1 from '../assets/log/budget_travelers/uncommon_1.png';
import BudgetTravelersUncommon2 from '../assets/log/budget_travelers/uncommon_2.png';
import BudgetTravelersUncommon3 from '../assets/log/budget_travelers/uncommon_3.png';

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

export const getCelestialsHoarder = (type: 1 | 2 | 3): [string, string] => {
    let assets: [string, string] = ['', ''];

    switch (type) {
        case 1:
            assets = [CelestialsHoarder1Locked, CelestialsHoarder1Unlocked];
            break;
        case 2:
            assets = [CelestialsHoarder2Locked, CelestialsHoarder2Unlocked];
            break;
        case 3:
            assets = [CelestialsHoarder3Locked, CelestialsHoarder3Unlocked];
            break;
        default:
            console.error('Unknown hoarder type');
    }

    return assets;
};

export const getCelestialsCollector = (type: 1 | 2 | 3): [string, string] => {
    let assets: [string, string] = ['', ''];

    switch (type) {
        case 1:
            assets = [CelestialsCollectorLocked, CelestialsCollector1];
            break;
        case 2:
            assets = [CelestialsCollectorLocked, CelestialsCollector2];
            break;
        case 3:
            assets = [CelestialsCollectorLocked, CelestialsCollector3];
            break;
        default:
            console.error('Unknown hoarder type');
    }

    return assets;
};

export const getBudgetTravelersCommonAssets = (type: 1 | 2 | 3): [string, string] => {
    let assets: [string, string] = ['', ''];

    switch (type) {
        case 1:
            assets = [BudgetTravelersCommonLocked, BudgetTravelersCommon1];
            break;
        case 2:
            assets = [BudgetTravelersCommonLocked, BudgetTravelersCommon2];
            break;
        case 3:
            assets = [BudgetTravelersCommonLocked, BudgetTravelersCommon3];
            break;
        default:
            console.error('Unknown asset type');
    }

    return assets;
};

export const getBudgetTravelersUncommonAssets = (type: 1 | 2 | 3): [string, string] => {
    let assets: [string, string] = ['', ''];

    switch (type) {
        case 1:
            assets = [BudgetTravelersUncommonLocked, BudgetTravelersUncommon1];
            break;
        case 2:
            assets = [BudgetTravelersUncommonLocked, BudgetTravelersUncommon2];
            break;
        case 3:
            assets = [BudgetTravelersUncommonLocked, BudgetTravelersUncommon3];
            break;
        default:
            console.error('Unknown asset type');
    }

    return assets;
};

export const getLayoutBackground = () => Background;
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
export const getTravelersLogo = () => TravelersLogo;
export const getAOMLogo = () => AOMLogo;

export const getMvxImage = () => MvxImage;
export const getMvxLogo = () => MvxLogo;

export const getEmptyPNG = () => EmptyPNG;

export const getEXOTicket = () => EXOTicket;

export const getRaffleGiants = () => RaffleGiants;
export const getRaffleHomeX = () => RaffleHomeX;
export const getRaffleRektNerds = () => RaffleRektNerds;
export const getRaffleSuperVictor = () => RaffleSuperVictor;

export const getArtDrop = () => ArtDrop;
