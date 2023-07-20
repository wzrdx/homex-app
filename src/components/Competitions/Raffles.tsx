import _ from 'lodash';
import { Alert, AlertIcon, Box, Flex, Spinner } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAfter, isBefore } from 'date-fns';
import { routeNames } from '../../services/routes';
import { useRewardsContext, RewardsContextType, Competition } from '../../services/rewards';

function Raffles() {
    const location = useLocation();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [localRaffles, setLocalRaffles] = useState<Competition[]>();

    const { raffles } = useRewardsContext() as RewardsContextType;

    // Location
    useEffect(() => {
        if (location && !_.isEmpty(raffles)) {
            init(location.pathname);
        }
    }, [location, raffles]);

    const init = async (pathname: string) => {
        setLoading(true);
        const predicate = pathname.includes(routeNames.past) ? isAfter : isBefore;
        setLocalRaffles(_.filter(raffles, (raffle) => predicate(new Date(), raffle.timestamp)));
        setLoading(false);
    };

    <Alert status="warning">
        <AlertIcon />
        There are no raffles to display
    </Alert>;

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex flexDir="column" pr={_.size(localRaffles) > 4 ? 4 : 0} overflowY="auto">
                    {_.isEmpty(localRaffles) ? (
                        <Flex justifyContent="center">
                            <Alert status="warning">
                                <AlertIcon />
                                There are no raffles to display
                            </Alert>
                        </Flex>
                    ) : (
                        <Box layerStyle="layout" display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" rowGap={8} columnGap={6}>
                            {_.map(localRaffles, (raffle, index) => (
                                <Box key={index}>
                                    <RaffleCard
                                        id={raffle.id}
                                        timestamp={raffle.timestamp}
                                        tickets={raffle.tickets}
                                        _raffles={raffles}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Flex>
            )}
        </>
    );
}

export default Raffles;
