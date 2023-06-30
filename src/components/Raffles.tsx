import _ from 'lodash';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { useLayout } from './Layout';
import Tab from '../shared/Tab';

type RewardsContext = { height: number };

export function useRewards() {
    return useOutletContext<RewardsContext>();
}

function Raffles() {
    const { routes, routeNames } = useLayout();

    // The height of the menu
    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.raffles));
    }, []);

    useEffect(() => {
        if (!(ref?.current as any).clientHeight) {
            return;
        }
        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            <Flex ref={ref} className="Second-Header-Menu" alignItems="center" pb={{ md: 4, lg: 8 }}>
                {_(route?.children)
                    .filter((route) => route.isTabRoute)
                    .map((route, index) => (
                        <Box key={index}>
                            <NavLink to={route.path}>
                                <Tab text={route.path} />
                            </NavLink>
                        </Box>
                    ))
                    .value()}
            </Flex>

            <Outlet context={{ height }} />
        </Flex>
    );
}

export default Raffles;