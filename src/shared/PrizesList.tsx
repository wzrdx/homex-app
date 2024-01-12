import _ from 'lodash';
import {
    Flex,
    Spinner,
    Text,
    Link,
    Image,
    Alert,
    AlertIcon,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTx, getTxExplorerURL, getUsername } from '../services/helpers';
import {
    EGLD_DENOMINATION,
    ELDERS_COLLECTION_ID,
    ENERGY_TOKEN_ID,
    ESSENCE_TOKEN_ID,
    GEMS_TOKEN_ID,
    HERBS_TOKEN_ID,
    TICKETS_TOKEN_ID,
    TOKEN_DENOMINATION,
    TRAVELERS_COLLECTION_ID,
} from '../blockchain/config';
import { ExternalLinkIcon, CalendarIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useSection } from '../components/Section';
import { getEldersLogo, getSmallLogo } from '../services/assets';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { ActionButton } from './ActionButton/ActionButton';
import { useRewardsContext, RewardsContextType } from '../services/rewards';
import { getRaffleHashes } from '../blockchain/api/getRaffleHashes';
import { CompetitionType } from './CompetitionDetails';

const COLUMNS = [
    {
        name: 'No.',
        style: {
            minWidth: '58px',
        },
        align: 'left',
    },
    {
        name: 'Player',
        style: {},
        align: 'left',
    },
    {
        name: 'Prize',
        style: {
            flex: 1,
        },
        align: 'right',
    },
];

interface Winner {
    username: string;
    address: string;
    prizes: Array<JSX.Element>;
}

function PrizesList({ id, type }: { id: number; type: CompetitionType }) {
    const { height } = useSection();
    const { isOpen: isHashesOpen, onOpen: onHashesOpen, onClose: onHashesClose } = useDisclosure();

    const [winners, setWinners] = useState<Array<Winner>>();

    const { raffles } = useRewardsContext() as RewardsContextType;

    const [competition, setCompetition] = useState<{
        id: number;
        timestamp: Date;
        tickets: number;
    }>();

    const [hashes, setHashes] = useState<string[]>([]);

    const [isLoading, setLoading] = useState<boolean>(true);
    const { address: userAddress } = useGetAccountInfo();

    useEffect(() => {
        if (type === CompetitionType.Raffle && !_.isEmpty(raffles)) {
            setCompetition(_.find(raffles, (raffle) => raffle.id == id));
        }
    }, [raffles]);

    useEffect(() => {
        if (competition) {
            init();
        }
    }, [competition]);

    const init = async () => {
        const hashes = await getRaffleHashes(id);
        setHashes(hashes);

        const result = await Promise.all(_.map(hashes, (hash) => getTransaction(hash)));

        const parsedWinners = _(result)
            .map((hashResult) => hashResult?.winners)
            .flatten()
            .value();

        const winners = _.map(Array.from(new Set(_.map(parsedWinners, (winner) => winner?.username))), (username) => {
            const entries = _.filter(parsedWinners, (winner) => winner?.username === username);

            return {
                username,
                address: entries[0]?.address,
                prizes: _.map(entries, (entry) => entry?.prize),
            };
        });

        console.log(winners);

        setWinners(winners as Winner[]);
        setLoading(false);
    };

    const getTransaction = async (hash: string) => {
        const result = await getTx(hash);

        if (result.data) {
            const operations = _.filter(result.data.operations, (operation) => operation.action === 'transfer');

            const winners = await Promise.all(
                _.map(operations, async (operation) => {
                    console.log(operation);

                    const username = await getUsername(operation.receiver);
                    let prize: JSX.Element = <Flex />;

                    if (operation.type === 'egld') {
                        prize = (
                            <Text color="brightBlue" fontWeight={500}>
                                {Number.parseInt(operation.value) / EGLD_DENOMINATION} $EGLD
                            </Text>
                        );
                    }

                    // NFTs
                    if (operation.type === 'nft' && operation.esdtType === 'NonFungibleESDT') {
                        if (operation.collection === ELDERS_COLLECTION_ID) {
                            prize = (
                                <Flex alignItems="center">
                                    <Image src={getEldersLogo()} height="22px" mr={1.5} alt="Elder" />
                                    <Text fontWeight={500} color="redClrs">
                                        {operation.name}
                                    </Text>
                                </Flex>
                            );
                        } else if (operation.collection === TRAVELERS_COLLECTION_ID) {
                            prize = (
                                <Flex alignItems="center">
                                    <Image src={getSmallLogo()} height="22px" mr={1.5} alt="NFT" />
                                    <Text fontWeight={500} color="primary">
                                        {operation.name}
                                    </Text>
                                </Flex>
                            );
                        } else {
                            prize = (
                                <Flex alignItems="center">
                                    <Text fontWeight={500} color="whitesmoke" minWidth="20px">
                                        {`${operation.name}`}
                                    </Text>
                                </Flex>
                            );
                        }
                    }

                    // SFTs
                    if (operation.type === 'nft' && operation.esdtType === 'SemiFungibleESDT') {
                        if (operation.ticker === TICKETS_TOKEN_ID) {
                            prize = (
                                <Flex alignItems="center">
                                    <Text mr={1} fontWeight={500} color="brightWheat" minWidth="20px" textAlign="center">
                                        {operation.value}
                                    </Text>
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>
                            );
                        } else {
                            prize = (
                                <Flex alignItems="center">
                                    <Text fontWeight={500} color="whitesmoke" minWidth="20px">
                                        {`${operation.value} ${operation.name}`}
                                    </Text>
                                </Flex>
                            );
                        }
                    }

                    // Tokens
                    if (operation.type === 'esdt' && operation.esdtType === 'FungibleESDT') {
                        switch (operation.identifier) {
                            case ENERGY_TOKEN_ID:
                                prize = (
                                    <Flex alignItems="center">
                                        <Text mr={1.5} fontWeight={500} color={RESOURCE_ELEMENTS.energy.color} minWidth="20px">
                                            {operation.value / TOKEN_DENOMINATION}
                                        </Text>
                                        <Image height="24px" src={RESOURCE_ELEMENTS.energy.icon} />
                                    </Flex>
                                );
                                break;

                            case HERBS_TOKEN_ID:
                                prize = (
                                    <Flex alignItems="center">
                                        <Text mr={1.5} fontWeight={500} color={RESOURCE_ELEMENTS.herbs.color} minWidth="20px">
                                            {operation.value / TOKEN_DENOMINATION}
                                        </Text>
                                        <Image height="24px" src={RESOURCE_ELEMENTS.herbs.icon} />
                                    </Flex>
                                );
                                break;

                            case GEMS_TOKEN_ID:
                                prize = (
                                    <Flex alignItems="center">
                                        <Text mr={1.5} fontWeight={500} color={RESOURCE_ELEMENTS.gems.color} minWidth="20px">
                                            {operation.value / TOKEN_DENOMINATION}
                                        </Text>
                                        <Image height="24px" src={RESOURCE_ELEMENTS.gems.icon} />
                                    </Flex>
                                );
                                break;

                            case ESSENCE_TOKEN_ID:
                                prize = (
                                    <Flex alignItems="center">
                                        <Text mr={1.5} fontWeight={500} color={RESOURCE_ELEMENTS.essence.color} minWidth="20px">
                                            {operation.value / TOKEN_DENOMINATION}
                                        </Text>
                                        <Image height="24px" src={RESOURCE_ELEMENTS.essence.icon} />
                                    </Flex>
                                );
                                break;

                            default:
                                prize = (
                                    <Flex alignItems="center">
                                        <Text fontWeight={500} color="whitesmoke">
                                            {`${operation.value / Math.pow(10, operation.decimals)}`}
                                        </Text>

                                        <Image mx={1.5} height="24px" src={operation.svgUrl} />

                                        <Text fontWeight={500} color="whitesmoke">
                                            {`${operation.name}`}
                                        </Text>
                                    </Flex>
                                );
                        }
                    }

                    return {
                        username,
                        prize,
                        address: operation.receiver,
                    };
                })
            );

            const timestamp = new Date(result.data.timestamp * 1000);

            return {
                winners,
                timestamp,
                hash,
            };
        }
    };

    const isWinner = (address: string = userAddress) => {
        return _.findIndex(winners, (winner) => winner.address === address) > -1;
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} justifyContent="center">
            {isLoading ? (
                <Spinner mt={6} />
            ) : _.isEmpty(hashes) ? (
                <Flex justifyContent="center" alignItems="flex-start">
                    <Alert status="warning">
                        <AlertIcon />
                        The prizes have not been drawn yet
                    </Alert>
                </Flex>
            ) : (
                <Flex minW="782px">
                    <Flex flex={4} flexDir="column" overflowY="auto" pr={6}>
                        <Flex alignItems="flex-start" justifyContent="space-between">
                            <ActionButton colorScheme="default" customStyle={{ width: '204px' }} onClick={onHashesOpen}>
                                <Flex alignItems="center">
                                    <InfoOutlineIcon />
                                    <Text ml={1.5}>View Transactions</Text>
                                </Flex>
                            </ActionButton>

                            <Flex alignItems="center">
                                <CalendarIcon mr={2} fontSize="14px" color="whiteAlpha.900" />
                                <Text>{format(competition?.timestamp as Date, 'PPPP')}</Text>
                            </Flex>
                        </Flex>

                        {isWinner() && (
                            <Flex mt={4} backgroundColor="#000000e3">
                                <Alert status="success">
                                    <AlertIcon />
                                    <Flex ml={1} flexDir="column">
                                        <Text>Congratulations!</Text>
                                        <Text>You are one of the winners</Text>
                                    </Flex>
                                </Alert>
                            </Flex>
                        )}

                        {/* Header */}
                        <Flex mb={1} mt={6}>
                            {_.map(COLUMNS, (column: any, index: number) => (
                                <Text
                                    key={index}
                                    style={column.style}
                                    textAlign={column.align}
                                    fontWeight={600}
                                    fontSize="17px"
                                >
                                    {column.name}
                                </Text>
                            ))}
                        </Flex>

                        <Flex width="100%" flexDir="column">
                            {_.map(winners, (winner, index) => (
                                <Flex key={index} width="100%" alignItems="center" height="28px" mt={2}>
                                    <Text style={COLUMNS[0].style}>{index + 1}</Text>

                                    <Text
                                        pr={6}
                                        layerStyle="ellipsis"
                                        style={COLUMNS[1].style}
                                        color={winner.address === userAddress ? 'redClrs' : '#F5F5F5'}
                                    >
                                        {winner.username}
                                    </Text>

                                    <Flex justifyContent="flex-end" alignItems="center" style={COLUMNS[2].style}>
                                        {_.map(winner.prizes, (prize, prizeIndex) => (
                                            <Box ml={3} key={prizeIndex}>
                                                {prize}
                                            </Box>
                                        ))}
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            )}

            {/* Hashes */}
            <Modal onClose={onHashesClose} isOpen={isHashesOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Transaction Hashes</ModalHeader>
                    <ModalCloseButton _focusVisible={{ outline: 0 }} />

                    <ModalBody>
                        <Flex flexDir="column" pb={2}>
                            {!_.isEmpty(hashes) &&
                                _.map(hashes, (hash, index) => (
                                    <Flex
                                        key={index}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        _notLast={{ marginBottom: 1 }}
                                    >
                                        <Link href={getTxExplorerURL(hash)} isExternal>
                                            <Flex alignItems="center">
                                                <Text minW="130px">{getShortAddress(hash, 6)}</Text>
                                                <ExternalLinkIcon ml={1.5} />
                                            </Flex>
                                        </Link>
                                    </Flex>
                                ))}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default PrizesList;
