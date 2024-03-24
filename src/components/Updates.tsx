import _ from 'lodash';
import { Text, Image, Stack } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';

export const Updates = ({}) => {
    return (
        <Stack justifyContent="center" spacing={6} alignItems="center">
            <Stack direction="row" spacing={8}>
                <Image src={RESOURCE_ELEMENTS.maze.icon} maxW="186px" />
            </Stack>

            <Text fontWeight={500} fontSize="17px" letterSpacing="0.5px" textAlign="center">
                Season{' '}
                <Text as="span" color="mirage" fontWeight={500}>
                    2
                </Text>{' '}
                has officially started! Stake your Traveler's Log pages and gather the{' '}
                <Text as="span" color="mirage" fontWeight={500}>
                    Maze
                </Text>{' '}
                token in anticipation for the next updates.
            </Text>
        </Stack>
    );
};
