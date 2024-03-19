import _ from 'lodash';
import { Text, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function Altar() {
    const [amount, setAmount] = useState(1);

    useEffect(() => {
        (async () => {})();
    }, []);

    return (
        <Center height="100%">
            <Text>Altar</Text>
        </Center>
    );
}

export default Altar;
