import _, { isNumber } from 'lodash';
import { Alert, AlertIcon, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import RewardCard from '../shared/RewardCard';
import { useRewardsContext, RewardsContextType } from '../services/rewards';

function Rewards() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const { ticketsAmount, getTicketsAmount } = useRewardsContext() as RewardsContextType;

    useEffect(() => {
        getTicketsAmount();
    }, []);

    useEffect(() => {
        if (isNumber(ticketsAmount)) {
            setLoading(false);
        }
    }, [ticketsAmount]);

    return (
        <Flex flexDir="column">
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
        </Flex>
    );
}

export default Rewards;
