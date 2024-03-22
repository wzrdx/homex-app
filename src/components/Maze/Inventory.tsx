import _ from 'lodash';
import { Flex, Alert, AlertIcon } from '@chakra-ui/react';
import { useStaking } from '../Staking';

function Inventory() {
    const { height } = useStaking();

    return (
        <Flex flexDir="column" height={`calc(100% - ${height}px)`} width="100%">
            <Flex py={4}>
                <Flex backgroundColor="#000000e3">
                    <Alert status="info">
                        <AlertIcon />
                        The secrets of the Inventory have yet to be revealed.
                    </Alert>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Inventory;
