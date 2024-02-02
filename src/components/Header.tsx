import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    Image,
    useDisclosure,
    Spinner,
    Stack,
    ModalFooter,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routeNames, routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { findIndex } from 'lodash';
import { TimeIcon } from '@chakra-ui/icons';
import { IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { TbMusic, TbMusicOff, TbArrowBigUpLinesFilled } from 'react-icons/tb';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import Resource from '../shared/Resource';
import Gameplay from './Gameplay';
import _ from 'lodash';
import Settings from './Settings';
import Profile from '../assets/profile.png';
import { differenceInSeconds, format, formatDistanceToNow, isBefore } from 'date-fns';
import Separator from '../shared/Separator';
import { HeaderButton } from '../shared/HeaderButton';
import Log from './Achievements/Log';
import { getArtDropTimestamp } from '../blockchain/game/api/getArtDropTimestamp';
import { NewSymbol } from '../shared/NewSymbol';
import { AchievementsProvider } from '../services/achievements';

const ROUTE_WIDTH = 100;
const BONUS_XP_END = new Date('2023-12-11T15:00:00.000Z');

function Header() {
    const { isOpen: isGameplayOpen, onOpen: onGameplayOpen, onClose: onGameplayClose } = useDisclosure();
    const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
    const { isOpen: isLogOpen, onOpen: onLogOpen, onClose: onLogClose } = useDisclosure();

    const { areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound } = useSoundsContext() as SoundsContextType;
    const { resources } = useResourcesContext() as ResourcesContextType;

    const location = useLocation();

    const [routes, setRoutes] = useState<Array<string>>([]);
    const [offset, setOffset] = useState<number>(0);

    const [isArtDropOngoing, setArtDropOngoing] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setRoutes(
            _(serviceRoutes)
                .filter((route) => route.isMainRoute)
                .map((route) => route.path)
                .value()
        );

        if (isMusicOn) {
            setIsMusicOn(true);
        }

        const artDropTimestamp = await getArtDropTimestamp();

        setArtDropOngoing(isBefore(new Date(), artDropTimestamp));
    };

    useEffect(() => {
        const index = findIndex(routes, (route) => location.pathname.includes(route));
        setOffset(index * ROUTE_WIDTH);
    }, [location]);

    const toggleSounds = () => {
        setAreSoundsOn(!areSoundsOn);
    };

    const toggleMusic = () => {
        setIsMusicOn(!isMusicOn);
    };

    const onRouteClick = (index: number) => {
        setOffset(index * ROUTE_WIDTH);
    };

    const getCssPxValue = (value: number): string => `${value}px`;

    return (
        <Flex flexDir="column">
            {/* Main header */}
            <Flex flex={1} position="relative" background="#00000036">
                {/* Routes */}
                <Flex pt={{ md: 4, lg: 5 }} width="100%" justifyContent="center" alignItems="flex-end">
                    <Flex className="Header-Menu" position="relative">
                        {routes.map((route: string, index: number) => (
                            <Flex key={index} flexDir="column" alignItems="center" width={getCssPxValue(ROUTE_WIDTH)}>
                                <NewSymbol isVisible={isArtDropOngoing && route === routeNames.shop ? true : false} />

                                <NavLink
                                    to={route}
                                    onClick={() => {
                                        onRouteClick(index);
                                        playSound('navigate');
                                    }}
                                >
                                    <Text
                                        textTransform="capitalize"
                                        color="header.gray"
                                        fontSize={{ md: '18px', lg: '20px' }}
                                        lineHeight={{ md: '18px', lg: '20px ' }}
                                        transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                        pt={3}
                                        pb={4}
                                        px={3}
                                        cursor="pointer"
                                        _hover={{ color: '#e3e3e3' }}
                                    >
                                        {route}
                                    </Text>
                                </NavLink>
                            </Flex>
                        ))}

                        <Box position="absolute" left={0} bottom={0} right={0}>
                            {offset >= 0 && (
                                <Box
                                    transform={`translateX(${getCssPxValue(offset)})`}
                                    backgroundColor="white"
                                    boxShadow="0 0 1px 0px white"
                                    height="2px"
                                    width={getCssPxValue(ROUTE_WIDTH)}
                                    transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.5)"
                                ></Box>
                            )}
                        </Box>
                    </Flex>
                </Flex>

                {/* Left and right */}
                <Flex
                    layerStyle="layout"
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    justifyContent="space-between"
                    alignItems="center"
                    py={3.5}
                    pointerEvents="none"
                    margin="0 auto"
                >
                    <Flex alignItems="center" pointerEvents="all">
                        {isMusicOn ? (
                            <Box cursor="pointer" color="whitesmoke" px={2.5} ml={-2.5} mb="1px">
                                <TbMusic fontSize="21px" onClick={toggleMusic} />
                            </Box>
                        ) : (
                            <Box cursor="pointer" color="header.lightgray" px={2.5} ml={-2.5} mb="1px">
                                <TbMusicOff fontSize="21px" onClick={toggleMusic} />
                            </Box>
                        )}

                        {areSoundsOn ? (
                            <Box cursor="pointer" color="whitesmoke" px={2.5}>
                                <IoVolumeHighOutline fontSize="22px" onClick={toggleSounds} />
                            </Box>
                        ) : (
                            <Box cursor="pointer" color="header.lightgray" px={2.5}>
                                <IoVolumeMuteOutline fontSize="22px" onClick={toggleSounds} />
                            </Box>
                        )}

                        <HeaderButton
                            type="Gameplay"
                            color="#f97316"
                            backgroundColor="#3c180d"
                            text="Gameplay"
                            onClick={() => {
                                playSound('mystery');
                                onGameplayOpen();
                            }}
                        />
                    </Flex>

                    <Stack direction="row" spacing={3} alignItems="center" pointerEvents="all">
                        <HeaderButton
                            type="Swords"
                            color="travelersLog"
                            backgroundColor="#182e4c"
                            text="Traveler's Log"
                            onClick={onLogOpen}
                        />

                        <HeaderButton
                            type="Settings"
                            color="#f97316"
                            backgroundColor="#3c180d"
                            text="Settings"
                            onClick={onSettingsOpen}
                        />

                        <NavLink to="/xp">
                            <Box
                                mr="-2px"
                                cursor="pointer"
                                transition="all 0.15s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                _hover={{ opacity: 0.85 }}
                            >
                                <Image src={Profile} width="48px" borderRadius="50%" />
                            </Box>
                        </NavLink>
                    </Stack>
                </Flex>

                <Box position="absolute" left={0} bottom={0} right={0}>
                    <Box width="100%" height="2px" backgroundColor="#71818138" boxShadow="0 0 12px #71818159"></Box>
                </Box>
            </Flex>

            {/* Secondary header */}
            <Flex marginTop={4} position="relative">
                {/* Resources */}
                <Flex width="100%" justifyContent="center" alignItems="flex-end">
                    {Object.keys(RESOURCE_ELEMENTS)
                        .slice(0, 4)
                        .map((element: string, index: number) => (
                            <Box key={index} mx={3.5}>
                                <Resource imageSrc={RESOURCE_ELEMENTS[element].icon} value={resources[element]} />
                            </Box>
                        ))}
                </Flex>

                {/* Left and right */}
                <Flex
                    layerStyle="layout"
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    alignItems="center"
                    justifyContent="space-between"
                    py={3.5}
                    pointerEvents="none"
                    margin="0 auto"
                >
                    <Flex alignItems="center">
                        <Resource imageSrc={RESOURCE_ELEMENTS['tickets'].icon} value={resources.tickets} height="46px" />

                        {process.env.NODE_ENV === 'development' && (
                            <Flex alignItems="center" zIndex={4}>
                                <Box
                                    display={{
                                        base: 'block',
                                        sm: 'none',
                                        md: 'none',
                                        lg: 'none',
                                        xl: 'none',
                                        '2xl': 'none',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"Base"' }} ml={6}></Text>
                                </Box>

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'block',
                                        md: 'none',
                                        lg: 'none',
                                        xl: 'none',
                                        '2xl': 'none',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"Small"' }} ml={6}></Text>
                                </Box>

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'none',
                                        md: 'block',
                                        lg: 'none',
                                        xl: 'none',
                                        '2xl': 'none',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"Medium"' }} ml={6}></Text>
                                </Box>

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'none',
                                        md: 'none',
                                        lg: 'block',
                                        xl: 'none',
                                        '2xl': 'none',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"Large"' }} ml={6}></Text>
                                </Box>

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'none',
                                        md: 'none',
                                        lg: 'none',
                                        xl: 'block',
                                        '2xl': 'none',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"XL"' }} ml={6}></Text>
                                </Box>

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'none',
                                        md: 'none',
                                        lg: 'none',
                                        xl: 'none',
                                        '2xl': 'block',
                                    }}
                                >
                                    <Text layerStyle="responsive" _before={{ content: '"2XL"' }} ml={6}></Text>
                                </Box>
                            </Flex>
                        )}
                    </Flex>

                    {differenceInSeconds(BONUS_XP_END, new Date()) > 0 && (
                        <Flex alignItems="center" pointerEvents="all">
                            <Box mb="2px">
                                <TbArrowBigUpLinesFilled fontSize="20px" color="#5ff070" />
                            </Box>

                            <Text ml={1} fontSize="15px" textTransform="uppercase" lineHeight="18px" letterSpacing="0.5px">
                                <Text as="span" color="#5ff070" fontWeight={600}>
                                    Double Xp
                                </Text>
                            </Text>

                            <Box mx={2.5}>
                                <Separator type="vertical" width="1px" height="28px" />
                            </Box>

                            <TimeIcon boxSize={4} />
                            <Text ml={1.5} fontSize="15px">
                                {formatDistanceToNow(BONUS_XP_END)} left
                            </Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>

            {/* Gameplay */}
            <Modal size="full" onClose={onGameplayClose} isOpen={isGameplayOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ boxShadow: '0 0 transparent' }}
                        borderRadius="3px"
                    />

                    <ModalBody backgroundColor="dark" display="flex" justifyContent="center" alignItems="center">
                        <Gameplay />

                        <Box position="absolute" bottom="16px" right="24px">
                            <Button onClick={onGameplayClose} colorScheme="red">
                                Close
                            </Button>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Log */}
            <Modal size="full" onClose={onLogClose} isOpen={isLogOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ boxShadow: '0 0 transparent' }}
                        borderRadius="3px"
                    />

                    <ModalBody backgroundColor="dark" display="flex" justifyContent="center" alignItems="center">
                        <AchievementsProvider>
                            <Log />
                        </AchievementsProvider>
                    </ModalBody>

                    <ModalFooter backgroundColor="dark" position="absolute" bottom={0} right={0}>
                        <Button colorScheme="red" onClick={onLogClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Settings */}
            <Modal size="md" onClose={onSettingsClose} isOpen={isSettingsOpen} isCentered>
                <ModalOverlay />
                <Settings />
            </Modal>
        </Flex>
    );
}

export default Header;
