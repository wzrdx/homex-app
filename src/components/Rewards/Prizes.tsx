import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTxExplorerURL, getUsername } from '../../services/helpers';
import { API_URL, EGLD_DENOMINATION } from '../../blockchain/config';
import axios from 'axios';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const TX_HASH = 'b6a01cb84ce09a01f188f07cf72727e627bfa699467412e1458433391cac99f5';

function Prizes() {
    const [raffle, setRaffle] = useState<{
        winners: Array<{
            username: string;
            prize: string;
        }>;
        timestamp: Date;
    }>();

    // Init
    useEffect(() => {
        getRaffleTx();
    }, []);

    const getRaffleTx = async () => {
        const result = await axios.get(`transactions/${TX_HASH}`, {
            baseURL: API_URL,
            params: {
                fields: 'operations,timestamp',
            },
        });

        if (result.data) {
            const winners = await Promise.all(
                _.map(result.data.operations, async (operation) => ({
                    username: await getUsername(operation.receiver),
                    prize: operation.value,
                }))
            );

            const timestamp = new Date(result.data.timestamp * 1000);

            console.log({
                winners,
                timestamp,
            });

            setRaffle({
                winners,
                timestamp,
            });
        }
    };

    return (
        <Flex justifyContent="center" height="100%">
            {!raffle ? (
                <Spinner />
            ) : (
                <Flex flexDir="column" alignItems="center">
                    <Link href={getTxExplorerURL(TX_HASH)} isExternal>
                        <Flex alignItems="center">
                            <Text>{getShortAddress(TX_HASH)}</Text>
                            <ExternalLinkIcon ml={1.5} />
                        </Flex>
                    </Link>

                    <Text mt={4}>{raffle.timestamp.toString()}</Text>
                    <Text my="4" fontSize="17px" fontWeight={500}>
                        Winners
                    </Text>

                    {_.map(raffle.winners, (winner, index) => (
                        <Flex width="38%" justifyContent="space-between" key={index}>
                            <Text mr="2">{winner.username}</Text>

                            <Text>{Number.parseInt(winner.prize) / EGLD_DENOMINATION} $EGLD</Text>
                        </Flex>
                    ))}
                </Flex>
            )}
        </Flex>
    );
}

export default Prizes;
