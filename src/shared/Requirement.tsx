import { Box, Flex, Image, Text, calc } from '@chakra-ui/react';
import { round } from '../services/helpers';

type RequirementProps = {
    elements: any;
    valueRequired: number;
    value: number;
};

const SIZE = '50px';
const SMALL_SCREEN_SIZE_DIFF = '10px';

function Requirement({ elements, valueRequired, value }: RequirementProps) {
    return (
        <Flex flexDir="column" justifyContent="center" alignItems="center">
            <Flex mb={{ md: 1, lg: 2 }} position="relative" justifyContent="center" alignItems="center">
                <Image
                    position="relative"
                    zIndex={3}
                    width={{ md: calc(SIZE).subtract(SMALL_SCREEN_SIZE_DIFF).toString(), lg: SIZE }}
                    src={elements.icon}
                    alt="Resource"
                />

                {/* Background */}
                <Box zIndex={2} position="absolute" top={0} right={0} bottom={0} left={0}>
                    <Box
                        width={{ md: calc(SIZE).subtract(SMALL_SCREEN_SIZE_DIFF).toString(), lg: SIZE }}
                        height={{ md: calc(SIZE).subtract(SMALL_SCREEN_SIZE_DIFF).toString(), lg: SIZE }}
                        borderRadius="50%"
                        backgroundColor="black"
                    ></Box>
                </Box>
            </Flex>

            <Text fontSize="15px" fontWeight={700} textShadow="1px 1px 2px #000">
                <Text color={valueRequired > value ? '#FF4136' : 'availableResource'} as="span">{`${
                    value >= 10000 ? '10k+' : round(value, 1)
                }`}</Text>
                <Text as="span" mx={0.5}>
                    /
                </Text>
                <Text as="span">{valueRequired}</Text>
            </Text>
        </Flex>
    );
}

export default Requirement;
