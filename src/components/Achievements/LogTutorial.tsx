import { Button, Center, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { LiaScrollSolid } from 'react-icons/lia';
import { WiTime4 } from 'react-icons/wi';
import { LuKeyRound } from 'react-icons/lu';
import { BiBadge } from 'react-icons/bi';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { Highlight } from '../../shared/Highlight';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export const LogTutorial = ({ goBack }) => {
    return (
        <Stack height="100%" position="relative">
            <Flex position="absolute" top={0} left={0} py={1.5} alignItems="flex-start">
                <Button colorScheme="blue" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            <Flex height="100%" justifyContent="center" alignItems="center">
                <Stack spacing={8} justifyContent="center" maxW="600px">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
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
                        <Center width="54px" minW="54px" height="50px" pb="2px">
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
                        <Center width="54px" minW="54px" height="50px" pb="2px">
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
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaScrollSolid fontSize="49px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Unlocking all the Badges within a page allows a{' '}
                            <Text as="span" color="logHighlight" fontWeight={500}>
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

                    <Stack spacing={2.5} alignItems="center">
                        <Text>The Traveler's Log references the Home X collections:</Text>

                        <Stack spacing={1}>
                            <Link href="https://xoxno.com/collection/AOM-f37bc5" isExternal _hover={{ opacity: 0.75 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ArrowForwardIcon fontSize="18px" />
                                    <Text fontWeight={500}>Art of Menhir</Text>
                                </Stack>
                            </Link>

                            <Link href="https://xoxno.com/collection/TRAVELER-51bdef" isExternal _hover={{ opacity: 0.75 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ArrowForwardIcon fontSize="18px" />
                                    <Text fontWeight={500}>The First Travelers</Text>
                                </Stack>
                            </Link>

                            <Link href="https://xoxno.com/collection/HOMEXELDER-d43957" isExternal _hover={{ opacity: 0.75 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ArrowForwardIcon fontSize="18px" />
                                    <Text fontWeight={500}>The Elders</Text>
                                </Stack>
                            </Link>
                        </Stack>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
