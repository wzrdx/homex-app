import { Box, Center, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { StoreContextType, useStoreContext } from '../services/store';
import { useOutletContext } from 'react-router-dom';
import Stats from './Staking/Stats';
import { useGetStakedNFTsCount } from '../blockchain/hooks/useGetStakedNFTsCount';
import { CHAIN_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID, isStakingDisabled } from '../blockchain/config';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { Address } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';

type StakingContext = {
    height: number;
};

export function useStaking() {
    return useOutletContext<StakingContext>();
}

function Staking() {
    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { stakedNFTsCount: totalStakedNFTs, getStakedNFTsCount } = useGetStakedNFTsCount();

    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [isClaimButtonLoading, setClaimButtonLoading] = useState(false);

    // Init
    useEffect(() => {
        getStakedNFTsCount();
    }, []);

    useEffect(() => {
        if (stakingInfo) {
            setLoading(false);
        }
    }, [stakingInfo]);

    const claimStakingRewards = async () => {
        if (!stakingInfo) {
            return;
        }

        if (isClaimButtonLoading) {
            return;
        }

        setClaimButtonLoading(true);

        const user = new Address(address);

        const stakedNFTsCount = _(stakingInfo.tokens)
            .filter((token) => !token.timestamp)
            .size();

        try {
            const tx = smartContract.methods
                .claimStakingRewards()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(50000000 + 250000 * stakedNFTsCount)
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
                    type: TransactionType.ClaimEnergy,
                    resolution: TxResolution.UpdateStakingInfo,
                },
            ]);

            setClaimButtonLoading(false);
        } catch (err) {
            console.error('Error occured while sending tx', err);
        }
    };

    return (
        <Flex height="100%" flexDir="column">
            {isLoading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <>
                    <Box mb={6}>
                        <ActionButton
                            disabled={
                                isStakingDisabled ||
                                !stakingInfo ||
                                isTxPending(TransactionType.Stake) ||
                                isTxPending(TransactionType.Unstake)
                            }
                            isLoading={isClaimButtonLoading || isTxPending(TransactionType.ClaimEnergy)}
                            colorScheme="blue"
                            customStyle={{ width: '144px' }}
                            onClick={claimStakingRewards}
                        >
                            <Text>Claim Energy</Text>
                        </ActionButton>
                    </Box>

                    <Stats
                        stakedNFTsCount={totalStakedNFTs}
                        travelersCount={_(stakingInfo?.tokens)
                            .filter((token) => token.tokenId === TRAVELERS_COLLECTION_ID && !token.timestamp)
                            .size()}
                        eldersCount={_(stakingInfo?.tokens)
                            .filter((token) => token.tokenId === ELDERS_COLLECTION_ID && !token.timestamp)
                            .size()}
                    />
                </>
            )}
        </Flex>
    );
}

export default Staking;
