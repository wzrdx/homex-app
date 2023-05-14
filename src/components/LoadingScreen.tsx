import useImagePreloader from '../services/preload';
import Unlocker from '../assets/videos/unlocker.webm';
import { useEffect, useState } from 'react';
import { getResourceElements } from '../services/resources';
import { Box } from '@chakra-ui/react';

function LoadingScreen({ setIsLoaded }) {
    const [isReady, setIsReady] = useState(false);

    const { image: TicketImage } = getResourceElements('tickets');
    const { image: EnergyImage } = getResourceElements('energy');

    const { imagesPreloaded } = useImagePreloader([TicketImage, EnergyImage]);

    const getTransitionValue = () => window.innerWidth / 2 + 200;

    const onVideoEnd = () => {
        /**
         * Setting 'isReady' to true so the component has time
         * to complete its transition animation
         */
        setIsReady(true);
        /**
         * Calling parent to destroy the component after the transition has ended
         * (must be the same value as the CSS transition property)
         */
        setTimeout(() => {
            setIsLoaded(true);
        }, 400);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <Box>
            {/* <div>
                <video autoPlay={true} muted={true} onEnded={onVideoEnd}>
                    <source src={Unlocker} type="video/webm" />
                </video>
            </div>

            <div style={isReady ? { transform: `translateX(-${getTransitionValue()}px)`, opacity: 0.25 } : {}}></div>
            <div style={isReady ? { transform: `translateX(${getTransitionValue()}px)`, opacity: 0.25 } : {}}></div> */}
        </Box>
    );
}

export default LoadingScreen;
