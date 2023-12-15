import { Box, Flex, Text, Image, Stack } from '@chakra-ui/react';
import Update from '../assets/images/Solara.jpg';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" alignItems="center">
            {/* <Image mb={4} src={} maxW="240px" /> */}
            <Text layerStyle="header2" textAlign="center">
                The Solara art drop is live!
            </Text>
        </Stack>
    );
};
