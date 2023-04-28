import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { indexOf } from 'lodash';

const ROUTE_WIDTH = 106;

function Header() {
    const { areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound } = useSoundsContext() as SoundsContextType;
    const location = useLocation();

    const [routes, setRoutes] = useState<Array<string>>([]);
    const [offset, setOffset] = useState<number>(0);

    // Init
    useEffect(() => {
        setRoutes(serviceRoutes.slice(-3).map((route) => route.path));
        setOffset(indexOf(routes, location.pathname.slice(1)) * ROUTE_WIDTH);
    }, []);

    const onRouteClick = (route: string, index: number) => {
        setOffset(index * ROUTE_WIDTH);
    };

    const getCssPxValue = (value: number): string => `${value}px`;

    return (
        <Flex
            flex={1}
            backgroundColor="#393439"
            borderBottom="2px solid header.gray"
            borderBottomWidth="2px"
            borderBottomColor="header.gray"
        >
            <Flex width="100%" justifyContent="center" alignItems="flex-end">
                <Flex position="relative">
                    {routes.map((route: string, index: number) => (
                        <Flex
                            onClick={() => onRouteClick(route, index)}
                            key={index}
                            justifyContent="center"
                            width={getCssPxValue(ROUTE_WIDTH)}
                        >
                            <NavLink to={route} onClick={() => playSound('navigate')}>
                                <Text
                                    textTransform="capitalize"
                                    color="header.gray"
                                    fontSize="18px"
                                    transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                    py={2}
                                    cursor="pointer"
                                    _hover={{ color: '#e3e3e3' }}
                                >
                                    {route}
                                </Text>
                            </NavLink>
                        </Flex>
                    ))}

                    <Box position="absolute" left={0} bottom="-2px" right={0}>
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
        </Flex>
    );
}

export default Header;
