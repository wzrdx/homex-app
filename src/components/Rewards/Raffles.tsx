import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Raffles() {
    const location = useLocation();

    // Init
    useEffect(() => {
        // Obtain raffles and set using location.pathname
    }, []);

    return (
        <Flex flexDir="column">
            <Flex justifyContent="center">
                <RaffleCard />
            </Flex>
        </Flex>
    );
}

export default Raffles;
