import { Flex, Spinner, Text } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

export const StatsEntry: FunctionComponent<
    PropsWithChildren<{
        label: string;
        value: string | number;
        color?: string;
    }>
> = ({ children, label, value, color = 'brightWheat' }) => {
    return (
        <Flex mb={4} flexDir="column">
            <Text layerStyle="header2">{label}</Text>

            {value === undefined ? (
                <Spinner mt={1} size="sm" />
            ) : (
                <Flex alignItems="center">
                    <Text layerStyle="value" color={color}>
                        <Text as="span">{value}</Text>
                    </Text>

                    {children}
                </Flex>
            )}
        </Flex>
    );
};
