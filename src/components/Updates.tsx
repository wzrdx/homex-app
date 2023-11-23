import { Box, Flex, Text, Image, Stack } from '@chakra-ui/react';
import Update from '../assets/log/aurora_curator.png';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" alignItems="center">
            <Image mb={4} src={Update} maxW="240px" />
            <Text layerStyle="header2" textAlign="center">
                Achievements are here!
            </Text>
            <Text textAlign="center">
                Access the{' '}
                <Text as="span" color="energyBright" fontWeight={500}>
                    Traveler's Log
                </Text>{' '}
                from the top right corner and check out the new achievement badges and future rewards! 👀
            </Text>
        </Stack>
    );
};
