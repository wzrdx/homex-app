import { Box, Button, Center, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { LiaScrollSolid } from 'react-icons/lia';
import { TbListCheck } from 'react-icons/tb';
import { WiTime4 } from 'react-icons/wi';
import { LuKeyRound } from 'react-icons/lu';
import { BiBadge } from 'react-icons/bi';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { Highlight } from '../../shared/Highlight';

export const LogTutorial = ({ goBack }) => {
    return (
        <Stack height="100%">
            <Flex py={1.5} alignItems="flex-start">
                <Button colorScheme="orange" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            <Flex height="100%" justifyContent="center" alignItems="center">
                <Stack spacing={10} pb={10} justifyContent="center" maxW="600px">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Center width="50px" minW="50px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <BiBadge fontSize="49px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            The Traveler's Log consists of multiple <Highlight>pages</Highlight>, with each page containing
                            <Highlight> badges</Highlight> that can be unlocked individually.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="50px" minW="50px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LuKeyRound fontSize="42px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Each badge has its own unlock condition. Some require obtaining tokens through specific methods,
                            such as <Highlight>minting</Highlight>, while others only require <Highlight>ownership</Highlight>{' '}
                            of tokens acquired through any possible method.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="50px" minW="50px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <WiTime4 fontSize="46px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Unlocking a badge <Highlight>is not</Highlight> always permanent! If the unlock condition is
                            ownership of assets, the badge will remain unlocked as long as the player owns said assets.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="50px" minW="50px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaScrollSolid fontSize="49px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Unlocking all the Badges within a page allows a{' '}
                            <Text as="span" color="energyBright" fontWeight={500}>
                                one time
                            </Text>{' '}
                            mint
                            <br />
                            of a collectible{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            Semi-Fungible Token.
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
