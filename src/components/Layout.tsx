import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesContextType, ResourcesProvider, useResourcesContext } from '../services/resources';
import { SoundsProvider } from '../services/sounds';
import Midjourney from '../assets/backgrounds/Midjourney_2.jpg';
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

        console.log(window.innerWidth);
    }, []);

    return (
        <SoundsProvider>
            <QuestsProvider>
                {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

                <Flex style={getBackgroundStyle(Midjourney)} position="relative" height="100vh" flexDir="column">
                    {/* height={{ base: '18%', lg: '15%' }} */}
                    <Box height="18%">
                        <Header />
                    </Box>

                    <Box height="82%" layerStyle="layout" margin="0 auto" py={14}>
                        <Outlet />
                    </Box>
                </Flex>
            </QuestsProvider>
        </SoundsProvider>
    );
}

export default Layout;
