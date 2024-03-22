import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Separator from '../shared/Separator';

function Gameplay() {
    return (
        <Stack spacing={10} pb={4}>
            <Flex alignItems="center">
                <Flex flex={1} flexDir="column">
                    <Flex alignItems="center">
                        <Image width="64px" src={RESOURCE_ELEMENTS.energy.icon} alt="Energy" />

                        <Flex ml={3} flexDir="column">
                            <Text fontSize="17px" fontWeight={500} color={RESOURCE_ELEMENTS.energy.color}>
                                $ENERGY
                            </Text>
                            <Text fontWeight={500}>Main fungible token</Text>
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
                                Used to complete quests
                            </Text>
                        </Flex>

                        <Flex alignItems="center">
                            <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                            <Text ml={1} whiteSpace="nowrap">
                                Can be swapped on JEXchange for{' '}
                                <Text as="span" color="brightBlue">
                                    $EGLD
                                </Text>
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Box mx={16} opacity={0.7}>
                    <Separator type="vertical" width="1px" height="182px" />
                </Box>

                <Flex flex={1} flexDir="column" alignItems="center">
                    <Flex>
                        {Object.keys(RESOURCE_ELEMENTS)
                            .slice(1, 5)
                            .map((resource) => (
                                <Flex width="86px" flexDir="column" justifyContent="center" alignItems="center" key={resource}>
                                    <Image width="48px" src={RESOURCE_ELEMENTS[resource].icon} alt="Resource" />
                                    <Text mt={1} fontSize="16px" fontWeight={500} color={RESOURCE_ELEMENTS[resource].color}>
                                        {RESOURCE_ELEMENTS[resource].name === 'Maze' && (
                                            <Text as="span" color="whitesmoke" mr="1px">
                                                *
                                            </Text>
                                        )}
                                        {RESOURCE_ELEMENTS[resource].name}
                                    </Text>
                                </Flex>
                            ))}
                    </Flex>

                    <Text mt={4} fontWeight={500} fontSize="17px">
                        Secondary fungible tokens
                    </Text>

                    <Text mt={1} textAlign="center">
                        Used to complete quests and earn rewards
                    </Text>
                </Flex>
            </Flex>

            <Stack maxW="964px">
                <Text>
                    <Text as="span" color="whitesmoke" mr="1px">
                        *
                    </Text>
                    The{' '}
                    <Text as="span" color="mirage" fontWeight={500}>
                        Maze
                    </Text>{' '}
                    token will only exist in-game until its launch, after which players will be able to mint their in-game
                    balances into fungible tokens.
                </Text>

                <Text>
                    <Text as="span" color="whitesmoke" mr="1px">
                        *
                    </Text>
                    The{' '}
                    <Text as="span" color="mirage" fontWeight={500}>
                        Maze
                    </Text>{' '}
                    token can be earned through staking, with additional earning methods to be introduced, such as airdrops,
                    exchanging Golden Tickets, and others.
                </Text>
            </Stack>

            <Stack spacing={5} direction="row" justifyContent="center" alignItems="stretch">
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
                            <Text fontWeight={600} color="black">
                                1
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        pb={0.5}
                        flexDir="column"
                        height="100%"
                        backgroundColor="#272727"
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
                                    <Text as="span" color="brightBlue">
                                        Stake
                                    </Text>{' '}
                                    your NFTs in order to gain the $ENERGY token
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
                            <Text fontWeight={600}>2</Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        pb={0.5}
                        flexDir="column"
                        height="100%"
                        backgroundColor="#272727"
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
                                    and earn tokens
                                </Text>
                            </Flex>

                            <Flex alignItems="flex-start" mt={3}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Complete the final{' '}
                                    <Text as="span" color="lightOrange">
                                        mission
                                    </Text>{' '}
                                    using the collected tokens and unlock Golden Tickets
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
                            <Text fontWeight={600}>3</Text>
                        </Flex>
                    </Flex>

                    <Flex
                        mt="16px"
                        width="308px"
                        pb={0.5}
                        flexDir="column"
                        height="100%"
                        backgroundColor="#272727"
                        overflow="hidden"
                        borderRadius="3px"
                    >
                        <Box width="100%" height="3px" backgroundColor="orangered"></Box>

                        <Flex mt={8} px={4} flexDir="column">
                            <Text mb={3} fontSize="18px" fontWeight={500} textAlign="center" color="orangered">
                                Rewards
                            </Text>

                            <Flex alignItems="flex-start" mt={1}>
                                <Flex alignItems="center" height="24px" mr={1}>
                                    <ArrowForwardIcon boxSize={4} color="whitesmoke" />
                                </Flex>
                                <Text>
                                    Use{' '}
                                    <Text as="span" color="orangered">
                                        Golden Tickets
                                    </Text>{' '}
                                    to earn rewards
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>
            </Stack>
        </Stack>
    );
}

export default Gameplay;
