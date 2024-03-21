import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    StyleProps,
    Text,
    ToastId,
    ToastPosition,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { getBackgroundStyle } from '../services/helpers';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import { getLayoutBackground } from '../services/assets';
import { CustomToast } from '../shared/CustomToast';
import { routes, routeNames } from '../services/routes';
import { useTransactionsContext, TransactionsContextType } from '../services/transactions';
import { Updates } from './Updates';

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
    const [isLoaded, setIsLoaded] = useState(false);
    const { getEnergy, getHerbs, getGems, getEssence, getTickets } = useResourcesContext() as ResourcesContextType;
    const { getGameState } = useTransactionsContext() as TransactionsContextType;

    const toast = useToast();
    const toastIdRef = useRef<ToastId>();

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    // Init
    useEffect(() => {
        getEnergy();
        getHerbs();
        getGems();
        getEssence();
        getTickets();

        getGameState();
    }, []);

    // Updates
    useEffect(() => {
        if (isLoaded && !window.localStorage['update_5']) {
            setTimeout(() => onModalOpen(), 1500);
            window.localStorage['update_5'] = true;
        }
    }, [isLoaded]);

    const displayToast = (
        type: string,
        title: string,
        description: string,
        color: string,
        duration = 6000,
        position: ToastPosition = 'top-right',
        containerStyle: StyleProps = {
            marginTop: '1rem',
            marginRight: '1rem',
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
                    <Header />
                </Box>

                <Box
                    height={{ md: '82%', lg: '86%' }}
                    layerStyle="layout"
                    margin="0 auto"
                    pt={{ md: 3, lg: 6, xl: 16, '2xl': 20 }}
                    pb={{ md: 6, lg: 6, xl: 16, '2xl': 20 }}
                >
                    <Outlet context={{ displayToast, closeToast, routes, routeNames }} />
                </Box>
            </Flex>

            {/* Updates */}
            <Modal size="xl" onClose={onModalClose} isOpen={isModalOpen} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor="dark">
                    <ModalHeader>New updates!</ModalHeader>

                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ boxShadow: '0 0 transparent' }}
                        borderRadius="3px"
                    />
                    <ModalBody>
                        <Updates />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" onClick={onModalClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Layout;
