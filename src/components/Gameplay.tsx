import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function Gameplay() {
    return (
        <Box pb={4}>
            <Flex alignItems="center">
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
                                Earned through{' '}
                                <Text as="span" color="brightBlue">
                                    staking
                                </Text>
                            </Text>
                        </Flex>

                        <Flex alignItems="center">
                            <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                            <Text ml={1} whiteSpace="nowrap">
                                Used in-game to perform weekly quests
                            </Text>
                        </Flex>

                        <Flex alignItems="center">
                            <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                            <Text ml={1} whiteSpace="nowrap">
                                Can be traded for{' '}
                                <Text as="span" color="brightBlue">
                                    $EGLD
                                </Text>
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

                    <Text mt={4} fontSize="17px">
                        In-game tokens
                    </Text>

                    <Text mt={1} textAlign="center" maxWidth="330px">
                        They are used only{' '}
                        <Text as="span" color="brightBlue">
                            in-game
                        </Text>{' '}
                        to complete missions and earn quest rewards
                    </Text>
                </Flex>
            </Flex>

            <Flex justifyContent="center" alignItems="stretch" mx={-3} mt={10}>
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
                                Staking
                            </Text>

                            <Flex alignItems="flex-start">
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    <Text as="span" color="brightBlue">
                                        Stake
                                    </Text>{' '}
                                    your NFT
                                </Text>
                            </Flex>

                            <Flex alignItems="flex-start" mt={1}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>Earn the $ENERGY token</Text>
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
                                    Complete weekly{' '}
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
                                    using the collected tokens and unlock Prize NFT Tickets
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
                                Rewards
                            </Text>

                            <Flex alignItems="flex-start">
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>Swap $ENERGY for $EGLD</Text>
                            </Flex>

                            <Flex alignItems="flex-start" mt={1}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Use NFT Prize Tickets to earn larger{' '}
                                    <Text as="span" color="orangered">
                                        prizes
                                    </Text>
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
