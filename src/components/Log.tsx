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
    Stack,
    Switch,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ShadowButton } from '../shared/ShadowButton';
import { getBadgeDisabled, getBadgeEnabled } from '../services/assets';

function Log() {
    const [isEnabled, setEnabled] = useState(false);

    return (
        <Stack alignItems="center">
            <Text layerStyle="header1Alt" textShadow="1px 1px 1px #333">
                Traveler's Log
            </Text>

            <ShadowButton color="#8c1eff" borderColor="#333" onClick={() => setEnabled(!isEnabled)}>
                <Text textShadow="1px 1px 1px #333" color="white">
                    Legendary Characters
                </Text>
            </ShadowButton>

            <Flex>
                <Image src={isEnabled ? getBadgeEnabled() : getBadgeDisabled()} maxH="240px" />
            </Flex>
        </Stack>
    );
}

export default Log;
