import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function Rewards() {
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // init();
    }, []);

    const init = async () => {};

    return (
        <Flex justifyContent="center" height="100%">
            <Flex flexDir="column" alignItems="center">
                <Text>Rewards</Text>
            </Flex>
        </Flex>
    );
}

export default Rewards;
