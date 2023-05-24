import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { QuestsProvider } from '../services/quests';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import { getLayoutBackground } from '../services/assets';
import FOG from 'vanta/dist/vanta.fog.min';
import { CustomToast } from '../shared/CustomToast';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { getAccountBalance } from '@multiversx/sdk-dapp/utils';

type ContextType = { checkEgldBalance: () => Promise<boolean> };

export function useLayout() {
    return useOutletContext<ContextType>();
}

function Layout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const myRef = useRef(null);
    const toast = useToast();

    // Smoke
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
        getEnergy();
        getHerbs();
        getGems();
        getEssence();
        getTickets();
    }, []);

    const checkEgldBalance = async (): Promise<boolean> => {
        const balance = await getAccountBalance();

        if (!balance || balance === '0') {
            playSound('swap');

            toast({
                position: 'top-right',
                containerStyle: {
                    marginTop: '2rem',
                    marginRight: '2rem',
                },
                duration: 10000,
                render: () => (
                    <CustomToast type="error" title="Insufficient balance" color="redClrs">
                        <Text mt={2}>You need xEGLD for gas fees</Text>
                        <Text mt={1}>
                            Please check{' '}
                            <Text as="span" color="#f97316">
                                Gameplay
                            </Text>{' '}
                            (top left corner)
                        </Text>
                    </CustomToast>
                ),
            });

            return false;
        } else {
            return true;
        }
    };

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
                    <Outlet context={{ checkEgldBalance }} />
                </Box>
            </Flex>
        </QuestsProvider>
    );
}

export default Layout;
