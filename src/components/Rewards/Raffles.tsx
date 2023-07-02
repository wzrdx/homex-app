import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRaffles } from '../../blockchain/api/getRaffles';
import { isAfter, isBefore } from 'date-fns';
import { routeNames } from '../../services/routes';

function Raffles() {
    const location = useLocation();

    const [raffles, setRaffles] = useState<
        {
            id: number;
            timestamp: Date;
            vectorSize: number;
        }[]
    >();

    // Location
    useEffect(() => {
        init(location.pathname);
    }, [location]);

    const init = async (pathname: string) => {
        const raffles = await getRaffles();
        const predicate = pathname.includes(routeNames.past) ? isAfter : isBefore;

        setRaffles(_.filter(raffles, (raffle) => predicate(new Date(), raffle.timestamp)));
    };

    return (
        <Flex flexDir="column">
            <Flex justifyContent="center">
                {_.map(raffles, (raffle, index) => (
                    <Box key={index} px={6}>
                        <RaffleCard id={raffle.id} timestamp={raffle.timestamp} vectorSize={raffle.vectorSize} />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}

export default Raffles;
