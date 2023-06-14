import { Box, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { getResourceElements } from '../services/resources';
import Reward from '../shared/Reward';
import { getEldersLogo, getRitualImage, getSmallLogo } from '../services/assets';
import { useLayout } from './Layout';
import _ from 'lodash';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getNonces } from '../services/authentication';
import { round, toTitleCase } from '../services/helpers';
import {
    CHAIN_ID,
    ELDERS_COLLECTION_ID,
    ELDER_YIELD_PER_HOUR,
    REWARDS_QUERYING_INTERVAL,
    TRAVELERS_COLLECTION_ID,
    TRAVELER_YIELD_PER_HOUR,
} from '../blockchain/config';
import { StoreContextType, useStoreContext } from '../services/store';
import { Timer } from '../shared/Timer';
import Separator from '../shared/Separator';
import { StakingInfo } from '../blockchain/hooks/useGetStakingInfo';
import { NavLink, Outlet } from 'react-router-dom';
import Tab from '../shared/Tab';
import Stats from './Staking/Stats';

function Staking() {
    const { routes, routeNames } = useLayout();

    const [height, setHeight] = useState<number>(0);
    const [route, setRoute] = useState<any>();
    const ref = useRef(null);

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.staking));
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

            <Flex width="800px">
                <Flex flex={1} backgroundColor="pink">
                    <Stats />
                </Flex>

                <Flex flex={4} backgroundColor="cyan">
                    <Outlet context={{ height }} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Staking;
