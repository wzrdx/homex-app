import _ from 'lodash';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRewardsContext, RewardsContextType, Competition } from '../../services/rewards';

function Battles() {
    const location = useLocation();

    const [competitions, setCompetitions] = useState<Competition[]>();

    const { battles } = useRewardsContext() as RewardsContextType;

    // Location
    useEffect(() => {
        if (location && !_.isEmpty(battles)) {
            init(location.pathname);
        }
    }, [location, battles]);

    const init = async (pathname: string) => {
        // const predicate = pathname.includes(routeNames.past) ? isAfter : isBefore;
        // setCompetitions(_.filter(battles, (raffle) => predicate(new Date(), raffle.timestamp)));
        setCompetitions([]);
    };

    return (
        <Flex flexDir="column">
            <Flex justifyContent="center">
                {_.map(competitions, (raffle, index) => (
                    <Box key={index} px={6}></Box>
                ))}
            </Flex>
        </Flex>
    );
}

export default Battles;
