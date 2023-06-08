import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { getRoute, routeNames } from '../services/routes';
import { toTitleCase } from '../services/helpers';

type RewardsContext = { height: number };

export function useRewards() {
    return useOutletContext<RewardsContext>();
}

function Rewards() {
    const [height, setHeight] = useState<number>(0);
    const ref = useRef(null);

    useEffect(() => {
        if (!(ref?.current as any).clientHeight) {
            return;
        }
        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            <Flex ref={ref} className="Rewards-Menu" alignItems="center" pb={6}>
                {_.map(getRoute(routeNames.rewards)?.children, (route, index) => (
                    <Box key={index}>
                        <NavLink to={route.path}>
                            <Text mx={4} fontSize="lg" fontWeight={500} color="header.gray">
                                {toTitleCase(route.path)}
                            </Text>
                        </NavLink>
                    </Box>
                ))}
            </Flex>

            <Outlet context={{ height }} />
        </Flex>
    );
}

export default Rewards;
