import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useImagePreloader from '../services/preload';
import Unlocker from '../assets/videos/unlocker.webm';
import { getBackground1080p, getFrame, getVisionImage, getTicketSFT } from '../services/assets';
import { getQuestImage } from '../services/quests';
import { isAfter } from 'date-fns';

function LoadingScreen({ setIsLoaded }) {
    const [isReady, setIsReady] = useState(false);

    const { imagesPreloaded: _imagesPreloaded } = useImagePreloader([
        getFrame(),
        getBackground1080p(),
        getQuestImage(1),
        getVisionImage(),
        getTicketSFT(),
    ]);

    const getTranslateDistance = () => window.innerWidth / 2 + 250;

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
        }, 500);
    };

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            setIsLoaded(true);
        }
    }, []);

    return (
        <Flex
            display={['none', 'flex']}
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            left={0}
            zIndex={5}
            pointerEvents="none"
            userSelect="none"
        >
            <>
                <Flex justifyContent="center" position="absolute" top={0} right={0} bottom={0} left={0} zIndex={6}>
                    <video style={{ height: '100%' }} autoPlay={true} muted={true} onEnded={onVideoEnd}>
                        <source src={Unlocker} type="video/webm" />
                    </video>
                </Flex>

                <Box
                    width="50%"
                    height="100vh"
                    opacity={1}
                    transition="all 0.5s ease-in-out"
                    backgroundColor="dark"
                    style={isReady ? { transform: `translateX(-${getTranslateDistance()}px)`, opacity: 0.25 } : {}}
                ></Box>
                <Box
                    width="50%"
                    height="100vh"
                    opacity={1}
                    transition="all 0.5s ease-in-out"
                    backgroundColor="dark"
                    style={isReady ? { transform: `translateX(${getTranslateDistance()}px)`, opacity: 0.25 } : {}}
                ></Box>
            </>
        </Flex>
    );
}

export default LoadingScreen;
