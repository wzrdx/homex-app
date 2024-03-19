import _ from 'lodash';
import { Text, Image, Stack } from '@chakra-ui/react';
import { getSummaryAssets } from '../services/assets';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" spacing={6} alignItems="center">
            <Stack direction="row" spacing={8}>
                <Image src={_.last(getSummaryAssets(0, 'Occult'))} maxW="142px" />
                <Image src={_.last(getSummaryAssets(4, 'Esoteric'))} maxW="142px" />
                <Image src={_.last(getSummaryAssets(5, 'Magical'))} maxW="142px" />
            </Stack>

            <Text fontWeight={500} fontSize="17px" letterSpacing="0.5px" textAlign="center">
                Three new{' '}
                <Text as="span" color="page" fontWeight={500}>
                    pages
                </Text>{' '}
                have been added to the Traveler's Log.
            </Text>
        </Stack>
    );
};
