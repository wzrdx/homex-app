import { Box, Flex, Image, Text, calc } from '@chakra-ui/react';
import { round } from '../services/helpers';

type RequirementProps = {
    elements: any;
    valueRequired: number;
    value: number;
};

const SIZE = '56px';

function Requirement({ elements, valueRequired, value }: RequirementProps) {
    return (
        <Flex flexDir="column" justifyContent="center" alignItems="center">
            <Flex position="relative" justifyContent="center" alignItems="center" mb={2}>
                <Image position="relative" zIndex={3} width={SIZE} src={elements.icon} alt="Resource" />

                {/* Background */}
                <Box zIndex={2} position="absolute" top={0} right={0} bottom={0} left={0}>
                    <Box width={SIZE} height={SIZE} borderRadius="50%" backgroundColor="black"></Box>
                </Box>
            </Flex>

            <Text fontSize="15px" fontWeight={700} textShadow="1px 1px 2px #000">
                <Text color={valueRequired > value ? '#FF4136' : 'wheat'} as="span">{`${
                    value >= 1000 ? '1k+' : round(value, 1)
                }`}</Text>
                <Text as="span" mx={1}>
                    /
                </Text>
                <Text as="span">{valueRequired}</Text>
            </Text>
        </Flex>
    );
}

export default Requirement;
