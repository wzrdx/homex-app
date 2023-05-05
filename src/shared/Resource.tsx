import { Flex, Image, Text } from '@chakra-ui/react';

function Resource({ imageSrc, value, height = '30px' }) {
    return (
        <Flex alignItems="center">
            <Image height={height} mr={2.5} src={imageSrc} alt="Resource" />
            <Text fontWeight="500" fontSize="17px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                {value}
            </Text>
        </Flex>
    );
}

export default Resource;
