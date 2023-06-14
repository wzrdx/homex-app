import { Box, Text } from '@chakra-ui/react';
import { toTitleCase } from '../services/helpers';

function Tab({ text }) {
    return (
        <Box className="Border-Box" pb={0.5} mx={5} borderBottom="2px solid transparent">
            <Text
                fontSize="lg"
                fontWeight={500}
                color="header.gray"
                transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                cursor="pointer"
                userSelect="none"
                _hover={{ color: '#e3e3e3' }}
            >
                {toTitleCase(text)}
            </Text>
        </Box>
    );
}

export default Tab;
