import { Box, Flex, StyleProps, Text, ToastId, ToastPosition, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import { getLayoutBackground } from '../services/assets';
import { CustomToast } from '../shared/CustomToast';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { getAccountBalance } from '@multiversx/sdk-dapp/utils';
import { routes, routeNames } from '../services/routes';
import { useTransactionsContext, TransactionsContextType } from '../services/transactions';

type LayoutContext = {
    checkEgldBalance: () => Promise<boolean>;
    displayToast: (
        type: string,
        title: string,
        description: string,
        color: string,
        duration?: number,
        position?: ToastPosition,
        containerStyle?: StyleProps
    ) => void;
    closeToast: () => void;
    routes;
    routeNames;
};

export function useLayout() {
    return useOutletContext<LayoutContext>();
}

function Layout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;
    const { isGamePaused, getGameState } = useTransactionsContext() as TransactionsContextType;

    const toast = useToast();
    const toastIdRef = useRef<ToastId>();

    // Init
    useEffect(() => {
        getEnergy();
        getHerbs();
        getGems();
        getEssence();
        getTickets();

        getGameState();
    }, []);

    useEffect(() => {
        if (isGamePaused) {
            displayToast('time', 'The game is temporarily paused', '', 'whitesmoke', 1000000000, 'bottom-left', {
                margin: '3rem',
            });
        }
    }, [isGamePaused]);

    const checkEgldBalance = async (): Promise<boolean> => {
        const balance = await getAccountBalance();

        if (!balance || balance === '0') {
            playSound('swap');

            displayToast('error', 'Insufficient balance', 'You need EGLD for gas fees', 'redClrs');
            return false;
        } else {
            return true;
        }
    };

    const displayToast = (
        type: string,
        title: string,
        description: string,
        color: string,
        duration = 6000,
        position: ToastPosition = 'top-right',
        containerStyle: StyleProps = {
            marginTop: '2rem',
            marginRight: '2rem',
        }
    ) => {
        toastIdRef.current = toast({
            position,
            containerStyle,
            duration,
            render: () => (
                <CustomToast type={type} title={title} color={color}>
                    {description && <Text mt={2}>{description}</Text>}
                </CustomToast>
            ),
        });
    };

    const closeToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current);
        }
    };

    return (
        <>
            {!isLoaded && <LoadingScreen setIsLoaded={setIsLoaded} />}

            <Flex style={getBackgroundStyle(getLayoutBackground())} position="relative" height="100vh" flexDir="column">
                <Box height={{ md: '18%', lg: '14%' }}>
                    <Header displayToast={displayToast} />
                </Box>

                <Box
                    height={{ md: '82%', lg: '86%' }}
                    layerStyle="layout"
                    margin="0 auto"
                    pt={{ md: 3, lg: 10, xl: 16, '2xl': 20 }}
                    pb={{ md: 6, lg: 10, xl: 16, '2xl': 20 }}
                >
                    <Outlet context={{ checkEgldBalance, displayToast, closeToast, routes, routeNames }} />
                </Box>
            </Flex>
        </>
    );
}

export default Layout;
