import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';

function Raffles() {
    return (
        <Flex justifyContent="center">
            <RaffleCard />
        </Flex>
    );
}

export default Raffles;
