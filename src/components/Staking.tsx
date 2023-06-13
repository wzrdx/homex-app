import { Box, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
import { round } from '../services/helpers';
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

export const ENERGY_REWARD = {
    resource: 'energy',
    name: 'Focus',
};

enum YieldType {
    Travelers,
    Elders,
    Total,
}

function Staking() {
    const { checkEgldBalance, displayToast } = useLayout();

    const { stakingInfo, getStakingInfo } = useStoreContext() as StoreContextType;
    const [isStakingButtonLoading, setStakingButtonLoading] = useState(false);
    const [isClaimingButtonLoading, setClaimingButtonLoading] = useState(false);

    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;
    const { name, icon, image } = getResourceElements('energy');

    const { address } = useGetAccountInfo();

    // Init
    useEffect(() => {
        getStakingInfo();

        let rewardsQueryingTimer: NodeJS.Timer = setInterval(() => {
            getStakingInfo();
        }, REWARDS_QUERYING_INTERVAL);

        return () => {
            clearInterval(rewardsQueryingTimer);
        };
    }, []);

    const toggleStaking = async () => {
        if (!stakingInfo || isStakingButtonLoading) {
            return;
        }

        setStakingButtonLoading(true);

        if (stakingInfo.isStaked) {
            await unstake();
        } else {
            await stake();
        }

        setStakingButtonLoading(false);
    };

    const stake = async () => {
        if (!(await checkEgldBalance())) {
            setStakingButtonLoading(false);
            return;
        }

        const user = new Address(address);

        try {
            const { data: travelerTokens } = await getNonces(address, TRAVELERS_COLLECTION_ID);
            const { data: elderTokens } = await getNonces(address, ELDERS_COLLECTION_ID);

            const transfers: TokenTransfer[] = [
                ..._(travelerTokens)
                    .map((token) => TokenTransfer.nonFungible(TRAVELERS_COLLECTION_ID, token.nonce))
                    .value(),
                ..._(elderTokens)
                    .map((token) => TokenTransfer.nonFungible(ELDERS_COLLECTION_ID, token.nonce))
                    .value(),
            ];

            if (_.isEmpty(transfers)) {
                displayToast(
                    'error',
                    'Nothing to stake',
                    'No NFT from the Home X collections is currently in your wallet',
                    'redClrs'
                );
                return;
            }

            const tx = smartContract.methods
                .stake()
                .withMultiESDTNFTTransfer(transfers)
                .withSender(user)
                .withExplicitReceiver(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(3000000 + 1000000 * _.size(transfers))
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
                    type: TransactionType.Stake,
                    resolution: TxResolution.UpdateStakingInfo,
                },
            ]);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    const unstake = async () => {
        if (!(await checkEgldBalance())) {
            setStakingButtonLoading(false);
            return;
        }

        const updatedStakingInfo: StakingInfo | undefined = await getStakingInfo();
        const user = new Address(address);

        if (!updatedStakingInfo) {
            console.error('Unable to unstake');
            return;
        }

        const energyGain = updatedStakingInfo.rewards;

        try {
            const tx = smartContract.methods
                .unstake()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(
                    3000000 + 1000000 * (updatedStakingInfo.travelerNonces.length + updatedStakingInfo.elderNonces.length)
                )
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
                    type: TransactionType.Unstake,
                    resolution: TxResolution.ClaimStakingRewards,
                    data: {
                        energyGain,
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    const claim = async () => {
        if (isClaimingButtonLoading) {
            return;
        }

        if (!(await checkEgldBalance())) {
            setClaimingButtonLoading(false);
            return;
        }

        setClaimingButtonLoading(true);
        await getStakingInfo();
        const user = new Address(address);

        if (!stakingInfo) {
            console.error('Unable to claim');
            return;
        }

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(6000000)
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
                    type: TransactionType.Claim,
                    resolution: TxResolution.ClaimStakingRewards,
                    data: {
                        energyGain: stakingInfo.rewards,
                    },
                },
            ]);

            setClaimingButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    const getEnergyPerHour = (yieldType: YieldType = YieldType.Total): number => {
        if (!stakingInfo) {
            return 0;
        }

        const travelersYield = round(TRAVELER_YIELD_PER_HOUR * stakingInfo?.travelerNonces?.length, 1);
        const eldersYield = round(ELDER_YIELD_PER_HOUR * stakingInfo?.elderNonces?.length, 1);

        switch (yieldType) {
            case YieldType.Travelers:
                return travelersYield;

            case YieldType.Elders:
                return eldersYield;

            default:
                return round(travelersYield + eldersYield, 1);
        }
    };

    return (
        <Flex height="100%" justifyContent="center" alignItems="center">
            <Flex flexDir="column" justifyContent="center" alignItems="center">
                {stakingInfo && stakingInfo.isStaked && (
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Text fontSize="18px">Staked NFTs</Text>

                        <Box mt={1} mb={4}>
                            <Separator type="horizontal" width="140px" height="1px" />
                        </Box>

                        <Flex alignItems="center">
                            <Flex px={8} alignItems="center">
                                <Image src={getSmallLogo()} height="28px" mr={3} alt="Logo" />
                                <Text fontWeight={500} fontSize="18px">
                                    {stakingInfo.travelerNonces?.length}
                                </Text>
                            </Flex>

                            <Flex px={8} alignItems="center">
                                <Image src={getEldersLogo()} height="28px" mr={3} alt="Logo" />
                                <Text fontWeight={500} fontSize="18px">
                                    {stakingInfo.elderNonces?.length}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                )}

                {/* Resposive */}
                <Flex flexDir={{ md: 'row', lg: 'column' }} justifyContent="center" alignItems="center">
                    <Flex my={4} width="auto" justifyContent="flex-end">
                        <Image
                            width="328px"
                            height="328px"
                            mr={{ md: 5, lg: 0 }}
                            src={getRitualImage()}
                            alt="Energy"
                            borderRadius="1px"
                            border="2px solid #fdefce29"
                        />
                    </Flex>

                    {/* Controls */}
                    {!stakingInfo ? (
                        <Spinner />
                    ) : (
                        <Flex ml={{ md: 5, lg: 0 }} flexDir="column" justifyContent="center" alignItems="center">
                            <Reward
                                image={image}
                                name={name}
                                value={stakingInfo.rewards}
                                icon={icon}
                                perHour={stakingInfo.isStaked ? getEnergyPerHour() : 0}
                            />

                            <Flex mt={4} flexDir="column" justifyContent="center" alignItems="center">
                                <Flex justifyContent="center" alignItems="center">
                                    <ActionButton
                                        disabled={!stakingInfo || isTxPending(TransactionType.Claim)}
                                        isLoading={
                                            isStakingButtonLoading ||
                                            isTxPending(TransactionType.Unstake) ||
                                            isTxPending(TransactionType.Stake)
                                        }
                                        colorScheme="blue"
                                        customStyle={{ width: '156px' }}
                                        onClick={toggleStaking}
                                    >
                                        <Text>{`${stakingInfo.isStaked ? 'Unstake' : 'Stake'}`}</Text>
                                    </ActionButton>

                                    {stakingInfo.isStaked && (
                                        <Box ml={4}>
                                            <ActionButton
                                                disabled={!stakingInfo || isTxPending(TransactionType.Unstake)}
                                                isLoading={isClaimingButtonLoading || isTxPending(TransactionType.Claim)}
                                                colorScheme="red"
                                                customStyle={{ width: '156px' }}
                                                onClick={claim}
                                            >
                                                <Text>Claim Rewards</Text>
                                            </ActionButton>
                                        </Box>
                                    )}
                                </Flex>

                                <Box mt={3}>
                                    <Timer displayDays isActive={stakingInfo.isStaked} timestamp={stakingInfo.timestamp} />
                                </Box>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Staking;
