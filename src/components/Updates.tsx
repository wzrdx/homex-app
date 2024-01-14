import _ from 'lodash';
import { Text, Image, Stack } from '@chakra-ui/react';
import { getRareTravelersRareAssets, getRareTravelersRoyalAssets } from '../services/assets';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" spacing={6} alignItems="center">
            <Stack direction="row" spacing={8}>
                <Image src={_.last(getRareTravelersRareAssets(3))} maxW="180px" />
                <Image src={_.last(getRareTravelersRoyalAssets(3))} maxW="180px" />
            </Stack>

            <Text fontWeight={500} fontSize="17px" letterSpacing="0.5px" textAlign="center" maxW="382px">
                The{' '}
                <Text as="span" color="page" fontWeight={500}>
                    Rare Travelers
                </Text>{' '}
                page has been added to the Traveler's Log.
            </Text>
        </Stack>
    );
};
