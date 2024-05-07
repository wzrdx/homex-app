import { WarningIcon } from '@chakra-ui/icons';
import { Flex, Image, Spinner, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { getRaffleParticipants } from '../blockchain/game/api/getRaffleParticipants';
import { getRaffleParticipantsCount } from '../blockchain/game/api/getRaffleParticipantsCount';
import { Participant } from '../blockchain/types';
import { getFullTicket } from '../services/assets';
import { getUsername, pairwise } from '../services/helpers';
import { RESOURCE_ELEMENTS } from '../services/resources';

const COLUMNS = [
    {
        name: 'No.',
        width: '68px',
        align: 'left',
    },
    {
        name: 'Player',
        width: '268px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '60px',
        align: 'left',
    },
];

function ParticipantsList({ id }) {
    const [participants, setParticipants] = useState<Participant[]>();
    const [error, setError] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const count: number = await getRaffleParticipantsCount(id);
            const chunks = new Array(Math.floor(count / 100)).fill(100).concat(count % 100);

            const apiCalls: Array<Promise<Participant[]>> = [];

            pairwise(
                _(chunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 100 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (current: number, next: number) => {
                    apiCalls.push(getRaffleParticipants(id, current, next));
                }
            );

            const result = await Promise.all(apiCalls);
            parse(_.flatten(result));
        } catch (error) {
            console.error(error);
            setError(true);
            setParticipants([]);
        }
    };

    const parse = async (earners: Participant[]) => {
        const sorted = _.orderBy(earners, ['ticketsCount'], ['desc']);
        const parsed = await Promise.all(
            _(sorted)
                .map(async (earner) => ({
                    ...earner,
                    username: await getUsername(earner.address),
                }))
                .value()
        );

        setParticipants(parsed);
    };

    return (
        <>
            {!participants ? (
                <Spinner mt={6} />
            ) : !!error ? (
                <Flex alignItems="center">
                    <WarningIcon boxSize={4} color="redClrs" />
                    <Text ml={2}>Unable to fetch data</Text>
                </Flex>
            ) : (
                <Flex px={6} flexDir="column" overflowY="auto" overflowX="hidden">
                    {!participants?.length ? (
                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                            <Image my={2} height="256px" src={getFullTicket()} />
                            <Text mt={5} textAlign="center" maxWidth="464px">
                                No traveler has entered this Raffle yet. <br /> Become the first one by submitting a{' '}
                                <Text as="span" color="ticketGold">
                                    Ticket
                                </Text>
                                .
                            </Text>
                        </Flex>
                    ) : (
                        <Flex mb={1}>
                            {_.map(COLUMNS, (column: any, index: number) => (
                                <Text key={index} layerStyle="header2" minWidth={column.width} textAlign={column.align}>
                                    {column.name}
                                </Text>
                            ))}
                        </Flex>
                    )}

                    {_.map(participants, (participant: Participant, index: number) => (
                        <Flex mt={2} alignItems="center" key={index}>
                            <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                            <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                {participant.username}
                            </Text>

                            <Flex minWidth={COLUMNS[2].width}>
                                <Text minWidth="24px">{participant.ticketsCount}</Text>
                                <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            )}
        </>
    );
}

export default ParticipantsList;
