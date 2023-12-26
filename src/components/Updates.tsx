import _ from 'lodash';
import { Box, Flex, Text, Image, Stack, Center } from '@chakra-ui/react';
import { getCelestialsCollectorAssets, getCelestialsHoarderAssets } from '../services/assets';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" spacing={6} alignItems="center">
            <Stack direction="row" spacing={8}>
                <Image src={_.last(getCelestialsCollectorAssets(3))} maxW="180px" />
                <Image src={_.last(getCelestialsHoarderAssets(3))} maxW="180px" />
            </Stack>

            <Text fontWeight={500} fontSize="17px" letterSpacing="0.5px" textAlign="center" px={12}>
                Two new Celestials pages have been added to the Traveler's Log.
            </Text>
        </Stack>
    );
};
