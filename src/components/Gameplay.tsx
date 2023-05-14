import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function Gameplay() {
    return (
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
                                <Text mt={1} fontSize="16px" fontWeight={500} color={RESOURCE_ELEMENTS[resource].color}>
                                    {RESOURCE_ELEMENTS[resource].name}
                                </Text>
                            </Flex>
                        ))}
                </Flex>

                <Text mt={4} fontSize="17px">
                    In-game tokens
                </Text>

                <Text mt={1} textAlign="center" maxWidth="315px">
                    They are used only{' '}
                    <Text as="span" color="brightBlue">
                        in-game
                    </Text>{' '}
                    to complete missions and earn quest rewards
                </Text>
            </Flex>
        </Flex>
    );
}

export default Gameplay;
