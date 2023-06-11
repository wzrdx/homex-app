import _ from 'lodash';
import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTxExplorerURL, getUsername } from '../../services/helpers';
import { API_URL, EGLD_DENOMINATION } from '../../blockchain/config';
import axios from 'axios';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import { getTxHashes } from '../../blockchain/api/getTxHashes';
import { format } from 'date-fns';
import { useRewards } from '../Rewards';
import { Timer } from '../../shared/Timer';
import { getRaffleTimestamp } from '../../blockchain/api/getRaffleTimestamp';

function Prizes() {
    const { height } = useRewards();
    const [timestamp, setTimestamp] = useState<Date>();

    const [tx, setTx] = useState<{
        winners: Array<{
            username: string;
            prize: string;
        }>;
        timestamp: Date;
        hash: string;
    }>();

    const [hashes, setHashes] = useState<string[]>([]);
    const [isLoadingHashes, setLoadingHashes] = useState<boolean>(true);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (hashes.length) {
            getTx(_.head(hashes) as string);
        }
    }, [hashes]);

    const init = async () => {
        try {
            setTimestamp(await getRaffleTimestamp());

            const hashes = await getTxHashes();

            setHashes(hashes);

            if (hashes.length) {
                await getTx(_.head(hashes) as string);
            }

            setLoadingHashes(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getTx = async (hash: string) => {
        // Used to trigger the spinner
        setTx(undefined);

        const result = await axios.get(`transactions/${hash}`, {
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

            setTx({
                winners,
                timestamp,
                hash,
            });
        }
    };

    return (
        <Flex height={_.isEmpty(hashes) ? 'auto' : `calc(100% - ${height}px)`} justifyContent="center">
            {isLoadingHashes ? (
                <Spinner />
            ) : _.isEmpty(hashes) ? (
                <Flex flexDir="column" alignItems="Center">
                    <Text mb={3}>Prizes distribution will be displayed here after the raffle ends</Text>

                    <Flex minWidth="158px">
                        <Timer timestamp={timestamp as Date} isActive isDescending displayDays />
                    </Flex>
                </Flex>
            ) : (
                <Flex minW="448px">
                    {/* Left */}
                    <Flex flex={1} flexDir="column" overflowY="auto" pr={4}>
                        {_.map(hashes, (hash, index) => (
                            <Text
                                key={index}
                                color={tx?.hash === hash ? 'white' : 'header.gray'}
                                _notLast={{ mb: 2 }}
                                cursor="pointer"
                                transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                _hover={{ color: '#e3e3e3' }}
                                onClick={() => getTx(hash)}
                            >
                                Trial #{index + 1}
                            </Text>
                        ))}
                    </Flex>

                    {/* Right */}
                    <Flex flex={4} flexDir="column" px={10} overflowY="auto">
                        {!tx ? (
                            <Flex justifyContent="center">
                                <Spinner />
                            </Flex>
                        ) : (
                            <>
                                <Flex alignItems="center" mb={2}>
                                    <CalendarIcon mr={2} fontSize="14px" color="whiteAlpha.900" />
                                    <Text>{format(tx.timestamp, 'PPPP')}</Text>
                                </Flex>

                                <Link href={getTxExplorerURL(tx.hash)} isExternal>
                                    <Flex alignItems="center">
                                        <Text>{getShortAddress(tx.hash)}</Text>
                                        <ExternalLinkIcon ml={1.5} />
                                    </Flex>
                                </Link>

                                <Text mt={6} mb={2} fontSize="17px" fontWeight={500}>
                                    Winners
                                </Text>

                                <Flex width="100%" flexDir="column">
                                    {_.map(tx.winners, (winner, index) => (
                                        <Flex
                                            key={index}
                                            width="100%"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            _notLast={{ mb: 1 }}
                                        >
                                            <Text mr="2">{winner.username}</Text>

                                            <Text>
                                                <Text as="span" color="brightBlue">
                                                    {Number.parseInt(winner.prize) / EGLD_DENOMINATION}
                                                </Text>{' '}
                                                $EGLD
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </>
                        )}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

export default Prizes;
