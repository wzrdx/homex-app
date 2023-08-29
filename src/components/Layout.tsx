import { Box, Flex, StyleProps, Text, ToastId, ToastPosition, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { getBackgroundStyle, isMobile } from '../services/helpers';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import { getLayoutBackground } from '../services/assets';
import { CustomToast } from '../shared/CustomToast';
import { routes, routeNames } from '../services/routes';
import { useTransactionsContext, TransactionsContextType } from '../services/transactions';

type LayoutContext = {
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
    // Mobile bypasses Loading Screen
    const [isLoaded, setIsLoaded] = useState(isMobile() || process.env.NODE_ENV === 'development');
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;
    const { getGameState } = useTransactionsContext() as TransactionsContextType;

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
                <Flex
                    pointerEvents="none"
                    position="absolute"
                    justifyContent="center"
                    alignItems="center"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    zIndex={9999}
                >
                    <Text textShadow="1px 1px 2px black" fontSize="20px">{`isMobile: ${isMobile()}`}</Text>
                    <Text textShadow="1px 1px 2px black">{`${navigator.userAgent}`}</Text>
                    <Text textShadow="1px 1px 2px black">{`${navigator.userAgent
                        .match(/iPhone|iPad|iPod/i)
                        ?.toString()}`}</Text>
                </Flex>

                <Box height={{ md: '18%', lg: '14%' }}>
                    <Header displayToast={displayToast} />
                </Box>

                <Box
                    height={{ md: '82%', lg: '86%' }}
                    layerStyle="layout"
                    margin="0 auto"
                    pt={{ md: 3, lg: 8, xl: 16, '2xl': 20 }}
                    pb={{ md: 6, lg: 8, xl: 16, '2xl': 20 }}
                >
                    <Outlet context={{ displayToast, closeToast, routes, routeNames }} />
                </Box>
            </Flex>
        </>
    );
}

export default Layout;
