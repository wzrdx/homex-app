import _ from 'lodash';
import { Alert, AlertIcon, Box, Center, Flex, Spinner, Stack } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAfter, isBefore } from 'date-fns';
import { routeNames } from '../../services/routes';
import { useRewardsContext, RewardsContextType, Competition } from '../../services/rewards';
import { Pagination } from '../../shared/Pagination';

function Raffles() {
    const location = useLocation();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [route, setRoute] = useState<string>();

    const [displayedCompetitions, setDisplayedCompetitions] = useState<Competition[]>();
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

        const isDisplayingPastRaffles = pathname.includes(routeNames.past);
        const predicate = isDisplayingPastRaffles ? isAfter : isBefore;
        setRoute(isDisplayingPastRaffles ? routeNames.past : routeNames.current);

        const competitions = _(raffles)
            .filter((raffle) => predicate(new Date(), raffle.timestamp))
            .orderBy('id', 'desc')
            .value();

        setCompetitions(competitions);
        setDisplayedCompetitions(competitions.slice(0, 8));

        setLoading(false);
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex flexDir="column" pr={_.size(displayedCompetitions) > 4 ? 4 : 0} overflowY="auto" layerStyle="layout">
                    {_.isEmpty(competitions) ? (
                        <Flex justifyContent="center">
                            <Flex>
                                <Alert status="warning">
                                    <AlertIcon />
                                    There are no raffles to display
                                </Alert>
                            </Flex>
                        </Flex>
                    ) : (
                        <Stack spacing={6}>
                            {route === routeNames.past && (
                                <Center>
                                    <Pagination
                                        total={_.size(competitions)}
                                        pageSize={8}
                                        onPageChange={(page) => {
                                            setDisplayedCompetitions(
                                                (competitions as Competition[]).slice((page - 1) * 8, page * 8)
                                            );
                                        }}
                                    />
                                </Center>
                            )}

                            <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" rowGap={8} columnGap={6}>
                                {_.map(displayedCompetitions, (raffle, index) => (
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
                        </Stack>
                    )}
                </Flex>
            )}
        </>
    );
}

export default Raffles;
