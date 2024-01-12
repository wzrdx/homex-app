import _ from 'lodash';
import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useLayout } from './Layout';
import Tab from '../shared/Tab';
import { routeNames } from '../services/routes';
import { useRewardsContext, RewardsContextType } from '../services/rewards';

type SectionContext = { height: number };

export function useSection() {
    return useOutletContext<SectionContext>();
}

function Section() {
    const { routes } = useLayout();
    const location = useLocation();

    // The height of the menu
    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    const { getRaffles } = useRewardsContext() as RewardsContextType;

    // Init
    useEffect(() => {
        const currentRoute = location.pathname.split('/')[1];
        setRoute(routes.find((route) => route.path === currentRoute));

        // Custom calls
        if (currentRoute === routeNames.raffles) {
            getRaffles();
        }
    }, [location.pathname.split('/')[1]]);

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

export default Section;
