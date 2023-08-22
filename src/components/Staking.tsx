import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useLayout } from './Layout';
import _ from 'lodash';
import { StoreContextType, useStoreContext } from '../services/store';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import Tab from '../shared/Tab';
import Stats from './Staking/Stats';
import { useGetStakedNFTsCount } from '../blockchain/hooks/useGetStakedNFTsCount';
import { ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../blockchain/config';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { TransactionType } from '../services/transactions';

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

    // NFT Migration
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isMigrationRequired, setMigrationRequired] = useState<boolean>();
    const [isButtonLoading, setButtonLoading] = useState<boolean>();

    // Init
    useEffect(() => {
        checkMigration();
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

    const checkMigration = async () => {
        // TODO: Check
        await new Promise((r) => setTimeout(r, 1000));
        setMigrationRequired(true);
        setLoading(false);
    };

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {isMigrationRequired ? (
                        <Flex flexDir="column" justifyContent="center" alignItems="center" maxW="754px">
                            <Text layerStyle="header1" mb={8} textAlign="center">
                                Migration required
                            </Text>

                            <Text mb={6} textAlign="center">
                                In order to use the updated{' '}
                                <Text as="span" fontWeight={600}>
                                    unbonding system
                                </Text>{' '}
                                you must first migrate your NFTs.
                            </Text>

                            <Text mb={6} textAlign="center">
                                Don't worry! We are not transferring them anywhere, we are simply moving your NFTs inside the
                                same smart contract, but to a different data structure.
                            </Text>

                            <Text mb={8} textAlign="center">
                                Once the migration transaction is completed, you will regain access to all previous
                                functionality.
                            </Text>

                            <ActionButton
                                // disabled={!stakingInfo}
                                // isLoading={isButtonLoading || isTxPending(TransactionType.Migration)}
                                colorScheme="blue"
                                customStyle={{ width: '120px' }}
                                onClick={() => console.log('Migrate')}
                            >
                                <Text>Migrate</Text>
                            </ActionButton>
                        </Flex>
                    ) : (
                        <>
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
                                            .filter((token) => token.tokenId === TRAVELERS_COLLECTION_ID && !token.timestamp)
                                            .size()}
                                        eldersCount={_(stakingInfo?.tokens)
                                            .filter((token) => token.tokenId === ELDERS_COLLECTION_ID && !token.timestamp)
                                            .size()}
                                    />
                                </Flex>

                                <Flex flex={4}>
                                    <Outlet context={{ height, displayToast }} />
                                </Flex>
                            </Flex>
                        </>
                    )}
                </>
            )}
        </Flex>
    );
}

export default Staking;
