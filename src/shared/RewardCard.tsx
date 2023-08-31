import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { getTicketsPrize } from '../services/rewards';
import { getTrialTimestamp } from '../blockchain/api/getTrialTimestamp';
import { intervalToDuration } from 'date-fns';
import { zeroPad } from '../services/helpers';

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

    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    const { isGamePaused, isClaimRewardTxPending, setPendingTxs } = useTransactionsContext() as TransactionsContextType;

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const start = await getTrialTimestamp();
        setDuration(
            intervalToDuration({
                start,
                end: new Date(),
            })
        );
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
                .withGasLimit(14000000 + 750000 * ticketsAmount)
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
            width="322.5px"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
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

            <Flex pt={2.5} pb={1} width="100%" alignItems="center" justifyContent="center">
                <Text layerStyle="header2">Elder Ticket Rewards</Text>
            </Flex>

            <Flex pb={2.5} width="100%" alignItems="center" justifyContent="center">
                <Text textTransform="uppercase" fontSize="15px" fontWeight={500} userSelect="none">
                    {`Expires in ${
                        (duration.days as number) > 0 || (duration.months as number) > 0
                            ? `${duration.days} day${(duration.days as number) > 1 ? 's' : ''}, `
                            : ''
                    } ${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`}
                </Text>
            </Flex>

            <Box width="100%">
                <ActionButton
                    isLoading={isButtonLoading || isClaimRewardTxPending(TransactionType.ClaimReward, id)}
                    colorScheme="red"
                    onClick={claimReward}
                    customStyle={{ width: '100%', borderRadius: 0, padding: '0.75rem' }}
                >
                    <Text userSelect="none">Claim</Text>
                </ActionButton>
            </Box>
        </Flex>
    );
}

export default RewardCard;
