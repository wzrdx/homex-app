import _ from 'lodash';
import { Flex, Text, Image } from '@chakra-ui/react';
import { AiOutlineEye } from 'react-icons/ai';
import { Timer } from './Timer';
import { format, isAfter } from 'date-fns';
import { Link } from 'react-router-dom';
import { RAFFLES, RewardType } from '../services/rewards';
import { getBackgroundStyle } from '../services/helpers';

function RaffleCard({
    id,
    timestamp,
    tickets,
}: {
    id: number;
    timestamp: Date;
    tickets: number;
    _raffles?:
        | {
              id: number;
              timestamp: Date;
              tickets: number;
          }[]
        | undefined;
}) {
    const isCompleted = (): boolean => isAfter(new Date(), timestamp);

    const getContent = (): JSX.Element => {
        const raffle = RAFFLES[id - 1];
        let element = <></>;

        if (!raffle) {
            return element;
        }

        switch (raffle.type) {
            case RewardType.SingleImage:
                return <Image src={raffle.imageSrc} height="100%" userSelect="none" />;

            case RewardType.Prizes:
                return (
                    <>
                        {_.map(RAFFLES[id - 1].prizes, (prize, index) => (
                            <Flex
                                key={index}
                                backgroundColor={prize.backgroundColor}
                                justifyContent="center"
                                alignItems="center"
                                userSelect="none"
                                height="100%"
                            >
                                <Flex justifyContent="center" alignItems="center">
                                    <Flex justifyContent="center" alignItems="center">
                                        <Image src={prize.imageSrc} height={prize.height} alt="Prize" />
                                    </Flex>

                                    <Text
                                        ml={2.5}
                                        textTransform="uppercase"
                                        color={prize.textColor}
                                        fontWeight={600}
                                        fontSize="17px"
                                    >
                                        {prize.text}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </>
                );

            case RewardType.NFT:
                return (
                    <Flex position="relative" style={getBackgroundStyle(raffle.url)} height="100%">
                        <Flex position="absolute" right={0} bottom={0}>
                            <Flex
                                alignItems="center"
                                background="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.65) 30%)"
                                pr={1.5}
                                pl={6}
                                py="2px"
                            >
                                <Text
                                    pt="3px"
                                    ml={1}
                                    mr={0.5}
                                    color="whitesmoke"
                                    fontSize="12.5px"
                                    letterSpacing="0.25px"
                                    fontWeight={500}
                                    textTransform="uppercase"
                                >
                                    {`${raffle.name}${raffle.rank ? ` • ${raffle.rank}` : ''}`}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                );

            default:
                return element;
        }
    };

    return (
        <Flex
            flexDir="column"
            alignItems="center"
            border="2px solid #fdefce26"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Flex flexDir="column" width="100%" height="300px">
                {getContent()}
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
                            {RAFFLES[id - 1]?.winners}
                        </Text>
                    </Flex>
                </Flex>

                <Flex width="100%" justifyContent="center">
                    <Link to={`/raffles/${id}?completed=${isCompleted()}`}>
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

            {!isCompleted() && timestamp && (
                <Flex pt={2.5} borderTop="2px solid #fdefce26" width="100%" alignItems="center" justifyContent="center">
                    <Text textTransform="uppercase" mr={1} fontSize="15px" fontWeight={500} userSelect="none">
                        Ends in
                    </Text>
                    <Timer
                        timestamp={timestamp as Date}
                        displayClock={false}
                        customStyle={{ textTransform: 'uppercase', fontSize: '15px', fontWeight: 500, userSelect: 'none' }}
                        isActive
                        isDescending
                        displayDays
                    />
                </Flex>
            )}
        </Flex>
    );
}

export default RaffleCard;
