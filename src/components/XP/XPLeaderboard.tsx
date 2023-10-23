import {
    Box,
    Button,
    Flex,
    Image,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';

function XPLeaderboard() {
    const [api, setApi] = useState<boolean>();

    const save = () => {};

    return (
        <Flex>
            <Text>Leaderboard</Text>
        </Flex>
    );
}

export default XPLeaderboard;
