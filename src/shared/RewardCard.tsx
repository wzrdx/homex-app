import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Address } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useEffect, useState } from 'react';
import { CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/game/smartContract';
import { getTicketsPrize } from '../services/rewards';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';

function RewardCard({ id, ticketsAmount }: { id: number; ticketsAmount: number }) {
    const { address } = useGetAccountInfo();
    const [isButtonLoading, setButtonLoading] = useState(false);

    const [prize, setPrize] = useState<{
        backgroundColor: string;
        imageSrc: string;
        height: {
            md: string;
            lg: string;
        };
        textColor: string;
        text: string;
    }>();

    const { isClaimRewardTxPending, setPendingTxs } = useTransactionsContext() as TransactionsContextType;

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setPrize(getTicketsPrize(ticketsAmount));
    };

    const claimReward = async () => {
        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .claimReward()
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(80000000 + 1000000 * ticketsAmount)
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

            setButtonLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.ClaimReward,
                    data: {
                        id,
                        ticketsAmount,
                    },
                    resolution: TxResolution.UpdateTicketsAndRewards,
                },
            ]);
        } catch (err) {
            console.error('Error occured during claimReward', err);
        }
    };

    return (
        <Flex
            flexDir="column"
            alignItems="center"
            border="2px solid #fdefce26"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#181818"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            minW="280px"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Flex flexDir="column" width="100%" height="260px">
                <Flex
                    backgroundColor={prize?.backgroundColor}
                    justifyContent="center"
                    alignItems="center"
                    userSelect="none"
                    height="100%"
                >
                    <Flex justifyContent="center" alignItems="center">
                        <Flex justifyContent="center" alignItems="center">
                            <Image src={prize?.imageSrc} height={prize?.height} alt="Traveler" />
                        </Flex>

                        <Text ml={2.5} textTransform="uppercase" color={prize?.textColor} fontWeight={600}>
                            {prize?.text}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Flex py={4} width="100%" alignItems="center" justifyContent="center">
                <Text layerStyle="header2">Elder Ticket Rewards</Text>
            </Flex>

            <Box width="100%">
                <ActionButton
                    isLoading={isButtonLoading || isClaimRewardTxPending(TransactionType.ClaimReward, id)}
                    colorScheme="red"
                    customStyle={{ width: '100%', borderRadius: 0, padding: '0.75rem' }}
                >
                    <Text userSelect="none">Claim rewards</Text>
                </ActionButton>
            </Box>
        </Flex>
    );
}

export default RewardCard;
