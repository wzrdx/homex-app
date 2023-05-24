import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function Gameplay() {
    return (
        <Box pb={4}>
            <Flex flexDir="column" justifyContent="center" alignItems="center">
                <Text maxWidth="663px" textAlign="justify" mb={4}>
                    In order to participate in the Beta Testing you need{' '}
                    <Text as="span" color="brightBlue">
                        xEGLD
                    </Text>{' '}
                    for gas fees.{' '}
                    <Text as="span" color="brightBlue">
                        xEGLD
                    </Text>{' '}
                    is the token used on the MultiversX devnet and can be obtained through the official faucet.
                </Text>

                <Text fontSize="17px">
                    Steps to obtain{' '}
                    <Text as="span" color="brightBlue">
                        xEGLD
                    </Text>
                </Text>

                <Box
                    mt={0.5}
                    mb={3}
                    width="214px"
                    height="1px"
                    background="linear-gradient(90deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
                ></Box>

                <Flex flexDir="column">
                    <Flex alignItems="center">
                        <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                        <Text ml={1} whiteSpace="nowrap">
                            Connect your wallet to{' '}
                            <Link color="brightBlue" href="https://devnet-wallet.multiversx.com" target="_blank">
                                https://devnet-wallet.multiversx.com
                            </Link>
                        </Text>
                    </Flex>

                    <Flex alignItems="center">
                        <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                        <Text ml={1} whiteSpace="nowrap">
                            On the menu to the left click on Faucet
                        </Text>
                    </Flex>

                    <Flex alignItems="center">
                        <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                        <Text ml={1} whiteSpace="nowrap">
                            A window will open where you can press Request Tokens
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Flex mt={8} alignItems="center">
                <Flex flex={1} flexDir="column">
                    <Flex alignItems="center">
                        <Image width="64px" src={RESOURCE_ELEMENTS.energy.icon} alt="Energy" />

                        <Flex ml={3} flexDir="column">
                            <Text fontSize="17px" fontWeight={500} color={RESOURCE_ELEMENTS.energy.color}>
                                $ENERGY
                            </Text>
                            <Text>Fungible token</Text>
                        </Flex>
                    </Flex>

                    <Flex mt={9} flexDir="column">
                        <Flex alignItems="center">
                            <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                            <Text ml={1} whiteSpace="nowrap">
                                Earned by performing{' '}
                                <Text as="span" color="brightBlue">
                                    Rituals
                                </Text>
                            </Text>
                        </Flex>

                        <Flex alignItems="center">
                            <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                            <Text ml={1} whiteSpace="nowrap">
                                Used in-game to complete quests
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Box
                    mx={16}
                    width="1px"
                    height="182px"
                    opacity={0.7}
                    background="linear-gradient(0deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
                ></Box>

                <Flex flex={1} flexDir="column" alignItems="center">
                    <Flex>
                        {Object.keys(RESOURCE_ELEMENTS)
                            .slice(1, 4)
                            .map((resource) => (
                                <Flex
                                    width="72px"
                                    flexDir="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    key={resource}
                                >
                                    <Image width="48px" src={RESOURCE_ELEMENTS[resource].icon} alt="Resource" />
                                    <Text
                                        mt={1}
                                        fontSize="16px"
                                        fontWeight={500}
                                        color={RESOURCE_ELEMENTS[resource].color}
                                    >
                                        {RESOURCE_ELEMENTS[resource].name}
                                    </Text>
                                </Flex>
                            ))}
                    </Flex>

                    <Text mt={4} fontWeight={500} fontSize="17px">
                        In-game tokens
                    </Text>

                    <Text mt={1} textAlign="center" maxWidth="330px">
                        They are used only{' '}
                        <Text as="span" color="brightBlue">
                            in-game
                        </Text>{' '}
                        to complete quests and earn rewards
                    </Text>
                </Flex>
            </Flex>

            <Flex justifyContent="center" alignItems="stretch" mx={-3} mt={8}>
                {/* Step 1 */}
                <Box flex={1} position="relative">
                    <Flex position="absolute" top={0} right={0} left={0} justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor="brightBlue"
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                        >
                            <Text fontWeight={500} fontSize="17px" color="black">
                                1
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        mx={3}
                        flexDir="column"
                        height="100%"
                        backgroundColor="lightDark"
                        overflow="hidden"
                        borderRadius="3px"
                    >
                        <Box width="100%" height="3px" backgroundColor="brightBlue"></Box>

                        <Flex mt={8} px={4} flexDir="column">
                            <Text mb={3} fontSize="18px" fontWeight={500} textAlign="center" color="brightBlue">
                                Energy
                            </Text>

                            <Flex alignItems="flex-start">
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Perform{' '}
                                    <Text as="span" color="brightBlue">
                                        Rituals
                                    </Text>{' '}
                                    in order to gain energy
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>

                {/* Step 2 */}
                <Box flex={1} position="relative">
                    <Flex position="absolute" top={0} right={0} left={0} justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor="lightOrange"
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                        >
                            <Text fontWeight={500} fontSize="17px">
                                2
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        mx={3}
                        flexDir="column"
                        height="100%"
                        backgroundColor="lightDark"
                        overflow="hidden"
                        borderRadius="3px"
                    >
                        <Box width="100%" height="3px" backgroundColor="lightOrange"></Box>

                        <Flex mt={8} px={4} flexDir="column">
                            <Text mb={3} fontSize="18px" fontWeight={500} textAlign="center" color="lightOrange">
                                Quests
                            </Text>

                            <Flex alignItems="flex-start">
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Complete{' '}
                                    <Text as="span" color="lightOrange">
                                        quests
                                    </Text>{' '}
                                    and earn in-game tokens
                                </Text>
                            </Flex>

                            <Flex alignItems="flex-start" mt={1}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Complete the final{' '}
                                    <Text as="span" color="lightOrange">
                                        mission
                                    </Text>{' '}
                                    using the collected tokens and unlock NFT Tickets
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>

                {/* Step 3 */}
                <Box flex={1} position="relative">
                    <Flex position="absolute" top={0} right={0} left={0} justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor="orangered"
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                        >
                            <Text fontWeight={500} fontSize="17px">
                                3
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        mx={3}
                        flexDir="column"
                        height="100%"
                        backgroundColor="lightDark"
                        overflow="hidden"
                        borderRadius="3px"
                    >
                        <Box width="100%" height="3px" backgroundColor="orangered"></Box>

                        <Flex mt={8} px={4} flexDir="column">
                            <Text mb={3} fontSize="18px" fontWeight={500} textAlign="center" color="orangered">
                                Leaderboard
                            </Text>

                            <Flex alignItems="flex-start" mt={1}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Advance your{' '}
                                    <Text as="span" color="orangered">
                                        ranking
                                    </Text>{' '}
                                    in the leaderboard in order to win prizes
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
}

export default Gameplay;
