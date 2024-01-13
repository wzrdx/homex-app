import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner, Stack, Text, Center, Box, Flex } from '@chakra-ui/react';
import { LogSummary, getLogSummary } from '../../blockchain/api/achievements/getLogSummary';

// const HEADER = [
//     {
//         title: (
//             <Text layerStyle="header2">
//                 <Text as="span" color="energyBright" fontWeight={600}>
//                     Energy
//                 </Text>{' '}
//                 claimed
//             </Text>
//         ),
//         key: 'energy',
//     },
//     {
//         title: (
//             <Text layerStyle="header2">
//                 <Text as="span" color="ticketBright" fontWeight={600}>
//                     Tickets
//                 </Text>{' '}
//                 earned
//             </Text>
//         ),
//         key: 'tickets',
//     },
// ];

// const QUESTS = [
//     {
//         title: <Text layerStyle="header2">Completed quests</Text>,
//         key: 'questsCompleted',
//     },
//     {
//         title: (
//             <Text layerStyle="header2">
//                 <Text as="span" color="resources.herbs" fontWeight={600}>
//                     Herbalism
//                 </Text>{' '}
//                 quests
//             </Text>
//         ),
//         key: 'herbalism',
//     },
//     {
//         title: (
//             <Text layerStyle="header2">
//                 <Text as="span" color="resources.gems" fontWeight={600}>
//                     Jewelcrafting
//                 </Text>{' '}
//                 quests
//             </Text>
//         ),
//         key: 'jewelcrafting',
//     },
//     {
//         title: (
//             <Text layerStyle="header2">
//                 <Text as="span" color="resources.essence" fontWeight={600}>
//                     Divination
//                 </Text>{' '}
//                 quests
//             </Text>
//         ),
//         key: 'divination',
//     },
// ];

const HEADER = [
    {
        title: 'Energy claimed',
        color: 'energyBright',
        key: 'energy',
    },
    {
        title: 'Tickets earned',
        color: 'ticketGold',
        key: 'tickets',
    },
];

const QUESTS = [
    {
        title: 'Herbalism quests',
        color: 'resources.herbs',
        key: 'herbalism',
    },
    {
        title: 'Jewelcrafting quests',
        color: 'resources.gems',
        key: 'jewelcrafting',
    },
    {
        title: 'Divination quests',
        color: 'resources.essence',
        key: 'divination',
    },
];

export const Summary = ({}) => {
    const [summary, setSummary] = useState<LogSummary>();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setSummary(await getLogSummary());
    };

    return (
        <Stack spacing={{ md: 8, lg: 10 }} height="100%" justifyContent="center" alignItems="center">
            {!summary ? (
                <Center height="100%">
                    <Spinner />
                </Center>
            ) : (
                <Stack spacing={4}>
                    <Stack>
                        <Text fontSize="24px" letterSpacing="0.5px" color="#dcdcdc">
                            Earnings
                        </Text>

                        <Stack direction="row" spacing={2.5}>
                            {HEADER.map((item, index) => (
                                <Box key={index}>
                                    <Card title={item.title} value={summary[item.key]} color={item.color} />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>

                    <Stack>
                        <Text fontSize="24px" letterSpacing="0.5px" color="#dcdcdc">
                            Quests
                        </Text>

                        <Flex>
                            <Card title="Completed quests" value={summary.questsCompleted} color="#8f9b9d" />
                        </Flex>

                        <Stack direction="row">
                            {QUESTS.map((item, index) => (
                                <Box key={index}>
                                    <Card title={item.title} value={summary[item.key]} color={item.color} />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};

const Card = ({ title, value, color }) => (
    <Stack py="1rem" px="1.25rem" minW="262px" spacing={2.5} borderRadius="16px" backgroundColor={color}>
        <Text letterSpacing="0.5px" fontWeight={700} textTransform="uppercase" color="black">
            {title}
        </Text>

        <Text fontSize="26px" lineHeight="26px" fontWeight={500} color="black">
            {value}
        </Text>
    </Stack>
);
