import _ from 'lodash';
import { Box, Flex } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAfter, isBefore } from 'date-fns';
import { routeNames } from '../../services/routes';
import { useRewardsContext, RewardsContextType } from '../../services/rewards';

function Raffles() {
    const location = useLocation();

    const [localRaffles, setLocalRaffles] = useState<
        {
            id: number;
            timestamp: Date;
            vectorSize: number;
        }[]
    >();

    const { raffles } = useRewardsContext() as RewardsContextType;

    // Location
    useEffect(() => {
        if (location && !_.isEmpty(raffles)) {
            init(location.pathname);
        }
    }, [location, raffles]);

    const init = async (pathname: string) => {
        const predicate = pathname.includes(routeNames.past) ? isAfter : isBefore;
        setLocalRaffles(_.filter(raffles, (raffle) => predicate(new Date(), raffle.timestamp)));
    };

    return (
        <Flex flexDir="column">
            <Flex justifyContent="center">
                {_.map(localRaffles, (raffle, index) => (
                    <Box key={index} px={6}>
                        <RaffleCard id={raffle.id} timestamp={raffle.timestamp} vectorSize={raffle.vectorSize} />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}

export default Raffles;
