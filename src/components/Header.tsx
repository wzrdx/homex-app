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
    Link,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { findIndex } from 'lodash';
import { BsExclamation, BsTwitter, BsGlobe, BsDiscord } from 'react-icons/bs';
import { AiOutlineSetting } from 'react-icons/ai';
import { IoVolumeHighOutline, IoVolumeMuteOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { TbMusic, TbMusicOff, TbBook } from 'react-icons/tb';
import Wallet from '../shared/Wallet';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import Resource from '../shared/Resource';
import Gameplay from './Gameplay';
import { getSmallLogo } from '../services/assets';
import _ from 'lodash';
import Separator from '../shared/Separator';
import Settings from './Settings';

const ROUTE_WIDTH = 98;

function Header({ displayToast }) {
    const { isOpen: isGameplayOpen, onOpen: onGameplayOpen, onClose: onGameplayClose } = useDisclosure();
    const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

    const { areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound } = useSoundsContext() as SoundsContextType;
    const { resources } = useResourcesContext() as ResourcesContextType;

    const location = useLocation();

    const [routes, setRoutes] = useState<Array<string>>([]);
    const [offset, setOffset] = useState<number>(0);

    // Init
    useEffect(() => {
        setRoutes(
            _(serviceRoutes)
                .filter((route) => route.isMainRoute)
                .map((route) => route.path)
                .value()
        );

        if (isMusicOn) {
            setIsMusicOn(true);
        }
    }, []);

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
                                <Box
                                    visibility="hidden"
                                    borderWidth="2px"
                                    borderColor="wheat"
                                    transform="rotate(45deg)"
                                    boxShadow="0 0 3px wheat"
                                    backgroundColor="#2f2f2f"
                                >
                                    <Box color="wheat" transform="rotate(-45deg)" fontSize="20px" margin="-3px">
                                        <BsExclamation />
                                    </Box>
                                </Box>

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
                            <Box
                                transform={`translateX(${getCssPxValue(offset)})`}
                                backgroundColor="white"
                                boxShadow="0 0 1px 0px white"
                                height="2px"
                                width={getCssPxValue(ROUTE_WIDTH)}
                                transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.5)"
                            ></Box>
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

                        <Flex
                            ml={2.5}
                            alignItems="center"
                            padding="7px 16px"
                            borderRadius="9999px"
                            backgroundColor="#3c180d"
                            cursor="pointer"
                            transition="all 0.15s cubic-bezier(0.215, 0.610, 0.355, 1)"
                            _hover={{ backgroundColor: '#4d1e0e' }}
                            onClick={() => {
                                playSound('mystery');
                                onGameplayOpen();
                            }}
                        >
                            <TbBook fontSize="20px" color="rgb(249 115 22)" />
                            <Text ml={2} color="white">
                                Gameplay
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex alignItems="center" pointerEvents="all">
                        <Wallet />

                        <Flex
                            ml={2.5}
                            alignItems="center"
                            padding="7px 16px"
                            borderRadius="9999px"
                            backgroundColor="#3c180d"
                            cursor="pointer"
                            transition="all 0.15s cubic-bezier(0.215, 0.610, 0.355, 1)"
                            _hover={{ backgroundColor: '#4d1e0e' }}
                            onClick={() => onSettingsOpen()}
                        >
                            <AiOutlineSetting fontSize="20px" color="rgb(249 115 22)" />
                            <Text ml={2} color="white">
                                Settings
                            </Text>
                        </Flex>

                        <Box ml={6} mr="-2px">
                            <Image width="68px" opacity={0.9} src={getSmallLogo()} />
                        </Box>
                    </Flex>
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

                    <Flex alignItems="center" pointerEvents="all">
                        {/* <Text fontSize="15px">Trial sponsored by</Text>

                        <Image ml={2} mt="2px" src={getEXOLogo()} width="54px" />

                        <Box ml={3}>
                            <Separator type="vertical" width="1px" height="26px" />
                        </Box>

                        <Link href="https://exo.game/" isExternal ml={3} _hover={{ opacity: 0.85 }}>
                            <BsGlobe cursor="pointer" />
                        </Link>

                        <Link href="https://exo.game/whitepaper" isExternal ml={3} _hover={{ opacity: 0.85 }}>
                            <IoDocumentTextOutline fontSize="18px" cursor="pointer" />
                        </Link>

                        <Link href="https://twitter.com/ExoMultiversX" isExternal ml={3} _hover={{ opacity: 0.85 }}>
                            <BsTwitter cursor="pointer" />
                        </Link>

                        <Link href="https://discord.com/invite/m3gmUhGq3E" isExternal ml={3} _hover={{ opacity: 0.85 }}>
                            <BsDiscord cursor="pointer" />
                        </Link> */}
                    </Flex>
                </Flex>
            </Flex>

            {/* Gameplay */}
            <Modal size="full" onClose={onGameplayClose} isOpen={isGameplayOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton color="white" _focusVisible={{ outline: 0 }} borderRadius="3px" />
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

            {/* Settings */}
            <Modal size="md" onClose={onSettingsClose} isOpen={isSettingsOpen} isCentered>
                <ModalOverlay />
                <Settings />
            </Modal>
        </Flex>
    );
}

export default Header;
