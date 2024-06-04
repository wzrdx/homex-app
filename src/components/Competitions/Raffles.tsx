import { Alert, AlertIcon, Box, Center, Flex, Spinner, Stack } from '@chakra-ui/react';
import { isAfter, isBefore } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Competition, RewardsContextType, useRewardsContext } from '../../services/rewards';
import { routeNames } from '../../services/routes';
import { Pagination } from '../../shared/Pagination';
import RaffleCard from '../../shared/RaffleCard';

function Raffles() {
    const location = useLocation();

    const [isLoading, setLoading] = useState<boolean>(true);

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

        const competitions = _(raffles)
            .filter((raffle) => predicate(new Date(), raffle.timestamp))
            .orderBy('id', 'desc')
            .value();

        setCompetitions(competitions);

        const slice = competitions.slice(0, 8);
        console.log(slice);

        setDisplayedCompetitions(slice);

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
                            {_.size(competitions) > 8 && (
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
                                            raffles={raffles}
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
