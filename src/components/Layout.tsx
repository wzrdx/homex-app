import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import { getLayoutBackground } from '../services/assets';
import FOG from 'vanta/dist/vanta.fog.min';

function Layout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;

    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const myRef = useRef(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                FOG({
                    el: myRef.current,
                    mouseControls: false,
                    touchControls: false,
                    gyroControls: false,
                    highlightColor: 0x9ca9e3,
                    midtoneColor: 0xf59318,
                    lowlightColor: 0xffffff,
                    baseColor: 0x11000000,
                    speed: 1.8,
                    zoom: 1.2,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    // Init
    useEffect(() => {
        console.log(window);

        getEnergy();
        getHerbs();
        getGems();
        getEssence();
        getTickets();
    }, []);

    return (
        <QuestsProvider>
            {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

            <Flex
                ref={myRef}
                style={getBackgroundStyle(getLayoutBackground())}
                position="relative"
                height="100vh"
                flexDir="column"
            >
                <Box height={{ md: '18%', lg: '14%' }}>
                    <Header />
                </Box>

                <Box
                    height={{ md: '82%', lg: '86%' }}
                    layerStyle="layout"
                    margin="0 auto"
                    py={{ md: 8, lg: 12, xl: 16, '2xl': 20 }}
                >
                    <Outlet />
                </Box>
            </Flex>
        </QuestsProvider>
    );
}

export default Layout;
