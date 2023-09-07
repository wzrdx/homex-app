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
    const [competitions, setCompetitions] = useState<Competition[]>();

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
        setCompetitions(_.filter(raffles, (raffle) => predicate(new Date(), raffle.timestamp)));
        setLoading(false);
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex flexDir="column" pr={_.size(competitions) > 4 ? 4 : 0} overflowY="auto">
                    {_.isEmpty(competitions) ? (
                        <Flex justifyContent="center">
                            <Alert status="warning">
                                <AlertIcon />
                                There are no raffles to display
                            </Alert>
                        </Flex>
                    ) : (
                        <Box layerStyle="layout" display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" rowGap={8} columnGap={6}>
                            {_.map(competitions, (raffle, index) => (
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
