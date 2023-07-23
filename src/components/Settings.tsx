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
import { isEmpty } from 'lodash';
import { useState } from 'react';

export const MUSIC_KEY = 'music';
export const SOUNDS_KEY = 'sounds';
export const API_KEY = 'api';

function Settings() {
    const [music, setMusic] = useState<boolean>(!isEmpty(window.localStorage[MUSIC_KEY]));
    const [sounds, setSounds] = useState<boolean>(!isEmpty(window.localStorage[SOUNDS_KEY]));

    // In order to default to the dedicated API, an empty key means the dedicated one is used
    const [api, setApi] = useState<boolean>(isEmpty(window.localStorage[API_KEY]));

    const save = () => {
        window.localStorage[MUSIC_KEY] = !music ? '' : 'true';
        window.localStorage[SOUNDS_KEY] = !sounds ? '' : 'true';
        window.localStorage[API_KEY] = !api ? 'public' : '';

        window.location.reload();
    };

    return (
        <ModalContent>
            <ModalHeader>Settings</ModalHeader>

            <ModalCloseButton zIndex={1} color="white" _focusVisible={{ boxShadow: '0 0 transparent' }} borderRadius="3px" />
            <ModalBody>
                <Flex flexDir="column">
                    <Flex _notLast={{ mb: 2 }} alignItems="center" justifyContent="space-between">
                        <Text>Music autoplay</Text>

                        <Flex alignItems="center">
                            <Text align="right" minW="79px">
                                Off
                            </Text>
                            <Switch
                                mx={3}
                                id="music-autoplay"
                                isChecked={music}
                                onChange={(event) => setMusic(event.target.checked)}
                            />
                            <Text minW="79px">On</Text>
                        </Flex>
                    </Flex>

                    <Flex _notLast={{ mb: 2 }} alignItems="center" justifyContent="space-between">
                        <Text>Sounds autoplay</Text>

                        <Flex alignItems="center">
                            <Text align="right" minW="79px">
                                Off
                            </Text>
                            <Switch
                                mx={3}
                                id="sounds-autoplay"
                                isChecked={sounds}
                                onChange={(event) => setSounds(event.target.checked)}
                            />
                            <Text minW="79px">On</Text>
                        </Flex>
                    </Flex>

                    <Flex _notLast={{ mb: 2 }} alignItems="center" justifyContent="space-between">
                        <Text>API Endpoint</Text>

                        <Flex alignItems="center">
                            <Text align="right" minW="79px">
                                Public
                            </Text>
                            <Switch
                                mx={3}
                                id="api-endpoint"
                                isChecked={api}
                                onChange={(event) => setApi(event.target.checked)}
                            />
                            <Text minW="79px">Dedicated</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" onClick={save}>
                    Save
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default Settings;
