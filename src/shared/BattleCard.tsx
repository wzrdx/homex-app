import _ from 'lodash';
import { Flex, Text } from '@chakra-ui/react';
import { AiOutlineEye } from 'react-icons/ai';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { BATTLES, getEGLDPrize } from '../services/rewards';

const EGLD_PRIZE = getEGLDPrize();

function BattleCard({ id, timestamp, tickets }: { id: number; timestamp: Date; tickets: number }) {
    return (
        <Flex
            flexDir="column"
            alignItems="center"
            border="2px solid #fdefce26"
            width="322.5px"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Flex flexDir="column" width="100%" height="260px">
                <Flex
                    backgroundColor={EGLD_PRIZE.backgroundColor}
                    justifyContent="center"
                    alignItems="center"
                    userSelect="none"
                    height="100%"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Text textTransform="uppercase" color="ticketBright" fontWeight={600} fontSize="18px">
                            {BATTLES[id - 1]?.amount} EGLD
                        </Text>

                        <Text
                            color="whitesmoke"
                            fontWeight={500}
                            textTransform="uppercase"
                            fontSize="15px"
                            letterSpacing="0.25px"
                        >
                            Prize Pool
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Flex flexDir="column" pb={2.5} width="100%">
                <Flex flexDir="column" py={2.5} px={3} width="100%">
                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Total tickets</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {tickets}
                        </Text>
                    </Flex>

                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Timestamp</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {format(timestamp, 'PP')}
                        </Text>
                    </Flex>

                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Winners</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {BATTLES[id - 1]?.winners}
                        </Text>
                    </Flex>
                </Flex>

                <Flex width="100%" justifyContent="center">
                    <Link to={`/battles/${id}?completed=true`}>
                        <Flex
                            alignItems="center"
                            px={2}
                            transition="all 0.1s ease-in"
                            cursor="pointer"
                            _hover={{ color: '#b8b8b8' }}
                            userSelect="none"
                        >
                            <AiOutlineEye fontSize="19px" />
                            <Text ml={1} textTransform="uppercase" fontWeight={500} fontSize="14px" letterSpacing="0.25px">
                                View details
                            </Text>
                        </Flex>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default BattleCard;
