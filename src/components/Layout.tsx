import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesProvider } from '../services/resources';
import { SoundsProvider } from '../services/sounds';
import Background from '../assets/background.png';
import LoadingScreen from './LoadingScreen';
import Header from './Header';

function Main() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <SoundsProvider>
            <ResourcesProvider>
                <QuestsProvider>
                    {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

                    <Flex style={getBackgroundStyle(Background)} height="100vh" flexDir="column">
                        <Header />

                        <Box flex={10} backgroundColor="#705959">
                            <Outlet />
                        </Box>
                    </Flex>
                </QuestsProvider>
            </ResourcesProvider>
        </SoundsProvider>
    );
}

export default Main;
