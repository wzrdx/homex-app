import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesProvider } from '../services/resources';
import { SoundsProvider } from '../services/sounds';
import Midjourney from '../assets/backgrounds/Midjourney_2.jpg';
// import Dome_1 from '../assets/backgrounds/Dome_1.jpg';
import LoadingScreen from './LoadingScreen';
import Header from './Header';

function Main() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <SoundsProvider>
            <ResourcesProvider>
                <QuestsProvider>
                    {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

                    <Flex style={getBackgroundStyle(Midjourney)} position="relative" height="100vh" flexDir="column">
                        <Header />

                        <Box flex={10}>
                            <Outlet />
                        </Box>
                    </Flex>
                </QuestsProvider>
            </ResourcesProvider>
        </SoundsProvider>
    );
}

export default Main;
