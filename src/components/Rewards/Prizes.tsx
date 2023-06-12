import _ from 'lodash';
import { Flex, Spinner, Text, Link, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTxExplorerURL, getUsername } from '../../services/helpers';
import { API_URL, EGLD_DENOMINATION, ELDERS_COLLECTION_ID, TICKETS_TOKEN_ID } from '../../blockchain/config';
import axios from 'axios';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import { getTxHashes } from '../../blockchain/api/getTxHashes';
import { format } from 'date-fns';
import { useRewards } from '../Rewards';
import { Timer } from '../../shared/Timer';
import { getRaffleTimestamp } from '../../blockchain/api/getRaffleTimestamp';
import { getEldersLogo } from '../../services/assets';
import { RESOURCE_ELEMENTS } from '../../services/resources';

function Prizes() {
    const { height } = useRewards();
    const [timestamp, setTimestamp] = useState<Date>();

    const [tx, setTx] = useState<{
        winners: Array<{
            username: string;
            prize: JSX.Element;
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
            setHashes(_.reverse(hashes));

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
            const operations = _.filter(result.data.operations, (operation) => operation.action === 'transfer');

            const winners = await Promise.all(
                _.map(operations, async (operation) => {
                    const username = await getUsername(operation.receiver);
                    let prize: JSX.Element = <Flex />;

                    if (operation.type === 'egld') {
                        prize = (
                            <Text>
                                <Text as="span" color="brightBlue" fontWeight={500}>
                                    {Number.parseInt(operation.value) / EGLD_DENOMINATION}
                                </Text>{' '}
                                $EGLD
                            </Text>
                        );
                    }

                    if (operation.type === 'nft' && operation.ticker === ELDERS_COLLECTION_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Image src={getEldersLogo()} height="22px" mr={2} alt="Elder" />
                                <Text fontWeight={500} color="redClrs">
                                    {operation.name}
                                </Text>
                            </Flex>
                        );
                    }

                    if (operation.type === 'nft' && operation.ticker === TICKETS_TOKEN_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Text fontWeight={500} color="brightWheat" minWidth="20px">
                                    {operation.value}
                                </Text>
                                <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                            </Flex>
                        );
                    }

                    return {
                        username,
                        prize,
                    };
                })
            );

            const timestamp = new Date(result.data.timestamp * 1000);

            setTx({
                winners,
                timestamp,
                hash,
            });

            console.log(
                {
                    winners,
                    timestamp,
                },
                result.data
            );
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
                                            height="28px"
                                            _notLast={{ mb: 2 }}
                                        >
                                            <Text mr="2">{winner.username}</Text>
                                            {winner.prize}
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
