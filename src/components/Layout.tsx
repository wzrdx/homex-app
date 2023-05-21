import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import Midjourney from '../assets/backgrounds/Midjourney_2.jpg';
import Elder from '../assets/backgrounds/Elder.png';
import LoadingScreen from './LoadingScreen';
import Header from './Header';

function Layout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;

    // Init
    useEffect(() => {
        getEnergy();
        getHerbs();
        getGems();
        getEssence();
        getTickets();
    }, []);

    return (
        <QuestsProvider>
            {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

            <Flex style={getBackgroundStyle(Midjourney)} position="relative" height="100vh" flexDir="column">
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
