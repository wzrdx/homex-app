import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesProvider } from '../services/resources';
import { SoundsProvider } from '../services/sounds';
import Background from '../assets/background.png';
import LoadingScreen from './LoadingScreen';

function Main() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <SoundsProvider>
            <ResourcesProvider>
                <QuestsProvider>
                    {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

                    <div style={getBackgroundStyle(Background)}>
                        <div>
                            {/* TODO: Header */}

                            <Box>
                                <Outlet />
                            </Box>
                        </div>
                    </div>
                </QuestsProvider>
            </ResourcesProvider>
        </SoundsProvider>
    );
}

export default Main;
