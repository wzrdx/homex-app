import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { indexOf } from 'lodash';
import { BsExclamation, BsQuestionCircle } from 'react-icons/bs';
import { IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { TbMusic, TbMusicOff, TbBook } from 'react-icons/tb';
import Wallet from '../shared/Wallet';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import Resource from '../shared/Resource';

const ROUTE_WIDTH = 144;
const HIGHLIGHTED_ROUTES = [2];

function Header() {
    const { areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound } = useSoundsContext() as SoundsContextType;
    const { resources } = useResourcesContext() as ResourcesContextType;

    const location = useLocation();

    const [routes, setRoutes] = useState<Array<string>>([]);
    const [offset, setOffset] = useState<number>(0);

    const size = useWindowSize();

    // Init
    useEffect(() => {
        setRoutes(serviceRoutes.slice(-3).map((route) => route.path));
    }, []);

    useEffect(() => {
        setOffset(indexOf(routes, location.pathname.slice(1)) * ROUTE_WIDTH);
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

    function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
            width: 0,
            height: 0,
        });
        useEffect(() => {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            // Add event listener
            window.addEventListener('resize', handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }

    return (
        <Flex flexDir="column">
            {/* Main header */}
            <Flex flex={1} position="relative" background="#00000070">
                {/* Routes */}
                <Flex pt={{ md: 4, lg: 5 }} width="100%" justifyContent="center" alignItems="flex-end">
                    <Flex position="relative">
                        {routes.map((route: string, index: number) => (
                            <Flex
                                onClick={() => onRouteClick(index)}
                                key={index}
                                flexDir="column"
                                alignItems="center"
                                width={getCssPxValue(ROUTE_WIDTH)}
                            >
                                <Box
                                    visibility={HIGHLIGHTED_ROUTES.includes(index) ? 'visible' : 'hidden'}
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

                                <NavLink to={route} onClick={() => playSound('navigate')}>
                                    <Text
                                        textTransform="capitalize"
                                        color="header.gray"
                                        fontSize={{ md: '18px', lg: '20px ' }}
                                        lineHeight={{ md: '18px', lg: '20px ' }}
                                        transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                        pt={3}
                                        pb={4}
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
                            <Box cursor="pointer" color="whitesmoke" px={2.5} ml={-2.5}>
                                <TbMusic fontSize="20px" onClick={toggleMusic} />
                            </Box>
                        ) : (
                            <Box cursor="pointer" color="header.lightgray" px={2.5} ml={-2.5}>
                                <TbMusicOff fontSize="20px" onClick={toggleMusic} />
                            </Box>
                        )}

                        {areSoundsOn ? (
                            <Box cursor="pointer" color="whitesmoke" px={2.5}>
                                <IoVolumeHighOutline fontSize="21px" onClick={toggleSounds} />
                            </Box>
                        ) : (
                            <Box cursor="pointer" color="header.lightgray" px={2.5}>
                                <IoVolumeMuteOutline fontSize="21px" onClick={toggleSounds} />
                            </Box>
                        )}

                        <Flex
                            ml={2.5}
                            alignItems="center"
                            padding="7px 16px"
                            borderRadius="9999px"
                            backgroundColor="#7c2d1250"
                            cursor="pointer"
                            transition="all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1)"
                            _hover={{ backgroundColor: '#7c2d1280' }}
                        >
                            <TbBook fontSize="20px" color="rgb(249 115 22)" />
                            <Text ml={2} color="white">
                                Gameplay
                            </Text>
                        </Flex>
                    </Flex>

                    <Box pointerEvents="all">
                        <Wallet />
                    </Box>
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
                    py={3.5}
                    pointerEvents="none"
                    margin="0 auto"
                >
                    <Flex alignItems="center">
                        <Resource
                            imageSrc={RESOURCE_ELEMENTS['tickets'].icon}
                            value={resources.tickets}
                            height="46px"
                        />

                        {/* TODO: Debug */}
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

                        {/* Size */}
                        <Text layerStyle="responsive" ml={2}>
                            {size.width}px / {size.height}px
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Header;
