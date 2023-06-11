import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { routes, routeNames } from '../services/routes';
import { toTitleCase } from '../services/helpers';

type RewardsContext = { height: number };

export function useRewards() {
    return useOutletContext<RewardsContext>();
}

function Rewards() {
    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.rewards));
    }, []);

    useEffect(() => {
        if (!(ref?.current as any).clientHeight) {
            return;
        }
        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            <Flex ref={ref} className="Rewards-Menu" alignItems="center" pb={{ md: 4, lg: 8 }}>
                {_.map(route?.children, (route, index) => (
                    <Box key={index}>
                        <NavLink to={route.path}>
                            <Box className="Border-Box" pb={0.5} mx={5} borderBottom="2px solid transparent">
                                <Text
                                    fontSize="lg"
                                    fontWeight={500}
                                    color="header.gray"
                                    transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                    cursor="pointer"
                                    userSelect="none"
                                    _hover={{ color: '#e3e3e3' }}
                                >
                                    {toTitleCase(route.path)}
                                </Text>
                            </Box>
                        </NavLink>
                    </Box>
                ))}
            </Flex>

            <Outlet context={{ height }} />
        </Flex>
    );
}

export default Rewards;
