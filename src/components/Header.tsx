import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { indexOf } from 'lodash';
import { BsExclamation } from 'react-icons/bs';

const ROUTE_WIDTH = 106;
const HIGHLIGHTED_ROUTES = [2];

function Header() {
    const { areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound } = useSoundsContext() as SoundsContextType;
    const location = useLocation();

    const [routes, setRoutes] = useState<Array<string>>([]);
    const [offset, setOffset] = useState<number>(0);

    // Init
    useEffect(() => {
        setRoutes(serviceRoutes.slice(-3).map((route) => route.path));
    }, []);

    useEffect(() => {
        console.log(location.pathname.slice(1));
        setOffset(indexOf(routes, location.pathname.slice(1)) * ROUTE_WIDTH);
    }, [location]);

    const onRouteClick = (index: number) => {
        setOffset(index * ROUTE_WIDTH);
    };

    const getCssPxValue = (value: number): string => `${value}px`;

    return (
        <Flex flex={1} position="relative" background="#00000070">
            <Flex width="100%" justifyContent="center" alignItems="flex-end">
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
                                borderColor="header.gold"
                                transform="rotate(45deg)"
                                boxShadow="0 0 3px wheat"
                                backgroundColor="#2f2f2f"
                            >
                                <Box color="header.gold" transform="rotate(-45deg)" fontSize="20px" margin="-3px">
                                    <BsExclamation />
                                </Box>
                            </Box>

                            <NavLink to={route} onClick={() => playSound('navigate')}>
                                <Text
                                    textTransform="capitalize"
                                    color="header.gray"
                                    fontSize="19px"
                                    transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                    py={2.5}
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

            <Box position="absolute" left={0} bottom={0} right={0}>
                <Box width="100%" height="2px" backgroundColor="#71818138" boxShadow="0 0 12px #71818159"></Box>
            </Box>
        </Flex>
    );
}

export default Header;
