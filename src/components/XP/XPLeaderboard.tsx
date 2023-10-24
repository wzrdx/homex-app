import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getXpLeaderboard } from '../../blockchain/api/getXpLeaderboard';

function XPLeaderboard() {
    const [api, setApi] = useState<boolean>();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const array = await getXpLeaderboard();
        console.log(array);
    };

    return (
        <Flex>
            <Text>Leaderboard</Text>
        </Flex>
    );
}

export default XPLeaderboard;
