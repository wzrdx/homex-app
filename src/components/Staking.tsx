import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useLayout } from './Layout';
import _, { truncate } from 'lodash';
import { StoreContextType, useStoreContext } from '../services/store';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import Tab from '../shared/Tab';
import Stats from './Staking/Stats';
import { useGetStakedNFTsCount } from '../blockchain/hooks/useGetStakedNFTsCount';
import { CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../blockchain/config';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { getMigrationSizeQuery } from '../blockchain/api/getMigrationSize';
import { Address } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';

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
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [isButtonLoading, setButtonLoading] = useState<boolean>();

    const [isMigrationRequired, setMigrationRequired] = useState<boolean>();
    const [migrationSize, setMigrationSize] = useState<number>(0);

    // Init
    useEffect(() => {
        setRoute(routes.find((route) => route.path === routeNames.staking));
    }, []);

    useEffect(() => {
        getStakedNFTsCount();
        checkMigration();
    }, [stakingInfo]);

    useEffect(() => {
        if (!ref?.current || !(ref?.current as any).clientHeight) {
            return;
        }

        setHeight((ref?.current as any)?.clientHeight);
    }, [(ref?.current as any)?.clientHeight]);

    const checkMigration = async () => {
        setLoading(true);

        const migrationSize: number = await getMigrationSizeQuery();

        setMigrationSize(migrationSize);
        setMigrationRequired(migrationSize > 0);

        setLoading(false);
    };

    const migrateTokens = async () => {
        if (!stakingInfo) {
            return;
        }

        if (isButtonLoading) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .migrateTokens()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(12000000 + 1100000 * migrationSize)
                .buildTransaction();

            await refreshAccount();

            const { sessionId } = await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    processingMessage: 'Processing transaction',
                    errorMessage: 'Error',
                    successMessage: 'Transaction successful',
                },
                redirectAfterSign: false,
            });

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.Migration,
                    resolution: TxResolution.UpdateStakingInfo,
                    data: migrationSize,
                },
            ]);

            setButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {isMigrationRequired ? (
                        <Flex
                            flexDir="column"
                            justifyContent="center"
                            alignItems="center"
                            maxW="636px"
                            backgroundColor="#1d1d1f"
                            borderRadius="3px"
                            px={8}
                            py={9}
                        >
                            <Text layerStyle="header1Alt" mb={5} textAlign="center">
                                Migration required
                            </Text>

                            <Text textAlign="center" fontSize="17px">
                                Exciting news – we have introduced the{' '}
                                <Text as="span" fontWeight={600} color="brightBlue">
                                    unbonding system
                                </Text>
                                .
                            </Text>

                            <Text mb={6} textAlign="center" fontSize="17px">
                                To get started, all you need to do is migrate your NFTs.
                            </Text>

                            <Text textAlign="center" fontSize="17px">
                                Don't worry! There won't be any transfers involved.
                            </Text>

                            <Text mb={6} textAlign="center" fontSize="17px">
                                We are merely{' '}
                                <Text as="span" fontWeight={600} color="brightBlue">
                                    reorganizing
                                </Text>{' '}
                                your NFTs within the same smart contract.
                            </Text>

                            <Text mb={8} textAlign="center" fontSize="17px">
                                Once the migration transaction is successfully concluded, you will regain full access to all the
                                previous functionalities.
                            </Text>

                            <ActionButton
                                disabled={!stakingInfo}
                                isLoading={isButtonLoading || isTxPending(TransactionType.Migration)}
                                colorScheme="blue"
                                customStyle={{ width: '140px' }}
                                onClick={migrateTokens}
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
