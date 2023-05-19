import { Flex, Image, Text, Box } from '@chakra-ui/react';

function Reward({ image, name, value, icon }) {
    return (
        <Flex alignItems="center">
            <Box position="relative">
                <Image
                    src={image}
                    alt="Reward"
                    borderRadius="50%"
                    width="100px"
                    height="100px"
                    boxShadow="0 0 6px 3px #0000008c"
                    backgroundColor="black"
                />
            </Box>

            <Flex flexDir="column" ml={3}>
                <Text mb={1} fontSize="18px">
                    {name}
                </Text>

                <Flex alignItems="center">
                    <Text fontSize="18px" mr={2}>
                        <Text as="span" mr={1}>
                            +
                        </Text>
                        <Text as="span" fontWeight={600}>
                            {value}
                        </Text>
                    </Text>

                    <Image width="28px" mr={2} src={icon} alt="Icon" />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Reward;
