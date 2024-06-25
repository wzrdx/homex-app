import { Box, Flex } from '@chakra-ui/react';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { config } from '../blockchain/config';
import { useGetStakedNFTsCount } from '../blockchain/game/hooks/useGetStakedNFTsCount';
import { StoreContextType, useStoreContext } from '../services/store';
import Tab from '../shared/Tab';
import { useLayout } from './Layout';
import Stats from './Staking/Stats';

type StakingContext = {
    height: number;
    displayToast: (type: string, title: string, description: string, color: string) => void;
};

export function useStaking() {
    return useOutletContext<StakingContext>();
}

function Staking() {
    const { routes, routeNames, displayToast } = useLayout();

    // The height of the menu
    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { stakedNFTsCount, getStakedNFTsCount } = useGetStakedNFTsCount();

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.staking));
    }, []);

    useEffect(() => {
        getStakedNFTsCount();
    }, [stakingInfo]);

    useEffect(() => {
        if (!ref?.current || !(ref?.current as any).clientHeight) {
            return;
        }

        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            <Flex ref={ref} className="Second-Header-Menu" alignItems="center" pb={{ md: 4, lg: 8 }}>
                {_.map(route?.children, (route, index) => (
                    <Box key={index}>
                        <NavLink to={route.path}>
                            <Tab text={route.path} />
                        </NavLink>
                    </Box>
                ))}
            </Flex>

            <Flex layerStyle="layout" height="100%">
                <Flex flex={1}>
                    <Stats
                        stakedNFTsCount={stakedNFTsCount}
                        travelersCount={_(stakingInfo?.tokens)
                            .filter((token) => token.tokenId === config.travelersCollectionId && !token.timestamp)
                            .size()}
                        eldersCount={_(stakingInfo?.tokens)
                            .filter((token) => token.tokenId === config.eldersCollectionId && !token.timestamp)
                            .size()}
                    />
                </Flex>

                <Flex flex={4}>
                    <Outlet context={{ height, displayToast }} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Staking;
