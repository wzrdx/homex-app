import _ from 'lodash';
import { Text, Center, Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Tab from '../shared/Tab';
import { useLayout } from './Layout';
import Stats from './Maze/Stats';
import { useStoreContext, StoreContextType } from '../services/store';

function Maze() {
    const { routes, routeNames, displayToast } = useLayout();
    const ROUTE: {
        path: string;
        children: {
            path: string;
            component: () => JSX.Element;
            isTabRoute: boolean;
        }[];
    } = routes.find((route) => route.path === routeNames.maze) as any;

    // The height of the menu
    const [height, setHeight] = useState<number>(0);
    const ref = useRef(null);

    const { getMazeStakingInfo } = useStoreContext() as StoreContextType;

    useEffect(() => {
        getMazeStakingInfo();
    }, []);

    useEffect(() => {
        if (!ref?.current || !(ref?.current as any).clientHeight) {
            return;
        }

        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            <Flex ref={ref} className="Second-Header-Menu" alignItems="center" pb={{ md: 4, lg: 8 }}>
                {_.map(ROUTE.children, (route, index) => (
                    <Box key={index}>
                        <NavLink to={route.path}>
                            <Tab text={route.path} />
                        </NavLink>
                    </Box>
                ))}
            </Flex>

            <Flex layerStyle="layout" height="100%">
                <Flex flex={1}>
                    <Stats />
                </Flex>

                <Flex flex={4}>
                    <Outlet context={{ height, displayToast }} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Maze;
