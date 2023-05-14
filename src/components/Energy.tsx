import { Box, Flex } from '@chakra-ui/react';
import Gameplay from './Gameplay';

function Energy() {
    return (
        <Flex justifyContent="center" alignItems="center" backgroundColor="dark" height="100%">
            <Gameplay />
        </Flex>
    );
}

export default Energy;
