import { Box, Flex, ToastId, useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import Header from './Header';
import { routes, routeNames } from '../services/routes';
import { useTransactionsContext, TransactionsContextType } from '../services/transactions';
import { QuestsContextType, useQuestsContext } from '../services/quests';

type LayoutContext = {
    closeToast: () => void;
    routes;
    routeNames;
};

export function useLayout() {
    return useOutletContext<LayoutContext>();
}

function Layout() {
    // Mobile bypasses Loading Screen
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;
    const { getGameState } = useTransactionsContext() as TransactionsContextType;
    const { getDoubleXpTimestamp } = useQuestsContext() as QuestsContextType;

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
        getDoubleXpTimestamp();
    }, []);

    const closeToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current);
        }
    };

    return (
        <>
            <Flex backgroundColor="#151a1b" position="relative" flexDir="column" minHeight="100vh">
                <Box>
                    <Header />
                </Box>

                <Box py={8} px={4}>
                    <Outlet context={{ closeToast, routes, routeNames }} />
                </Box>
            </Flex>
        </>
    );
}

export default Layout;
