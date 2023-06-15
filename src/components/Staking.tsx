import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useLayout } from './Layout';
import _ from 'lodash';
import { REWARDS_QUERYING_INTERVAL } from '../blockchain/config';
import { StoreContextType, useStoreContext } from '../services/store';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import Tab from '../shared/Tab';
import Stats from './Staking/Stats';
import { useGetStakedNFTsCount } from '../blockchain/hooks/useGetStakedNFTsCount';
import { useGetStakedAddressesCount } from '../blockchain/hooks/useGetStakedAddressesCount';
import { useGetUserTokenNonces } from '../blockchain/hooks/useGetUserTokenNonces';

type StakingContext = {
    height: number;
    checkEgldBalance: () => Promise<boolean>;
    displayToast: (type: string, title: string, description: string, color: string) => void;
};

export function useStaking() {
    return useOutletContext<StakingContext>();
}

function Staking() {
    const { routes, routeNames, checkEgldBalance, displayToast } = useLayout();

    // The height of the menu
    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    const { stakingInfo, getStakingInfo } = useStoreContext() as StoreContextType;

    const { stakedNFTsCount, getStakedNFTsCount } = useGetStakedNFTsCount();
    const { stakedAddressesCount, getStakedAddressesCount } = useGetStakedAddressesCount();
    const { nonces, getUserTokenNonces } = useGetUserTokenNonces();

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.staking));

        getStakingInfo();

        let rewardsQueryingTimer: NodeJS.Timer = setInterval(() => {
            getStakingInfo();
        }, REWARDS_QUERYING_INTERVAL);

        getUserTokenNonces();
        getStakedNFTsCount();
        getStakedAddressesCount();

        return () => {
            clearInterval(rewardsQueryingTimer);
        };
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
                            <Tab text={route.path} />
                        </NavLink>
                    </Box>
                ))}
            </Flex>

            <Flex layerStyle="layout" height="100%">
                <Flex flex={1}>
                    <Stats
                        stakedNFTsCount={stakedNFTsCount}
                        stakedAddressesCount={stakedAddressesCount}
                        travelersCount={_.size(nonces?.travelers)}
                        eldersCount={_.size(nonces?.elders)}
                        stakingInfo={stakingInfo}
                    />
                </Flex>

                <Flex flex={4}>
                    <Outlet context={{ height, checkEgldBalance, displayToast }} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Staking;
