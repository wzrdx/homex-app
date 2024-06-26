import { CalendarIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { addWeeks, format, isBefore } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../blockchain/config';
import { RewardsContextType, useRewardsContext } from '../services/rewards';
import { StoreContextType, useStoreContext } from '../services/store';
import RewardCard from '../shared/RewardCard';

function Rewards() {
    const { stakingInfo } = useStoreContext() as StoreContextType;

    const [isLoading, setLoading] = useState<boolean>(true);
    const { ticketsAmount, getTicketsAmount } = useRewardsContext() as RewardsContextType;

    useEffect(() => {
        getTicketsAmount();
    }, []);

    useEffect(() => {
        if (_.isNumber(ticketsAmount)) {
            setLoading(false);
        }
    }, [ticketsAmount]);

    const getNextEventDate = (): string => {
        const startDate = new Date(2024, 0, 27); // 27th January 2024 - First Cron rewards

        // Calculate the next closest date within the current and next weeks
        let nextClosestDate = startDate;

        while (isBefore(nextClosestDate, new Date())) {
            nextClosestDate = addWeeks(nextClosestDate, 2);
        }

        // Format the date as a string
        const formattedDate = format(nextClosestDate, 'PPP');

        return formattedDate;
    };

    const hasEldersStaked = (): boolean => {
        return !_(stakingInfo?.tokens)
            .filter((token) => token.tokenId === config.eldersCollectionId && !token.timestamp)
            .isEmpty();
    };

    return (
        <Stack spacing={3}>
            {!!hasEldersStaked() && (
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <Text>Next rewards:</Text>

                    <Stack spacing={1.5} direction="row" justifyContent="center" alignItems="center">
                        <CalendarIcon color="mirage" fontSize="14px" />
                        <Text color="mirage">{getNextEventDate()}</Text>
                    </Stack>
                </Stack>
            )}

            <Flex justifyContent="center">
                {isLoading ? (
                    <Spinner />
                ) : !ticketsAmount ? (
                    <Alert status="info" width="auto">
                        <AlertIcon />
                        There are no rewards to be claimed at the moment
                    </Alert>
                ) : (
                    <RewardCard id={1} ticketsAmount={ticketsAmount} />
                )}
            </Flex>
        </Stack>
    );
}

export default Rewards;
