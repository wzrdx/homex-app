import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Flex, Text } from '@chakra-ui/react';

export const CustomToast: FunctionComponent<
    PropsWithChildren<{
        type: string;
        color: string;
        title: string;
    }>
> = ({ children, type, color, title }) => {
    return (
        <Flex
            flexDir="column"
            backgroundColor="#191919"
            borderInlineStartWidth="4px"
            borderInlineStartColor={color}
            padding="12px 32px 12px 12px"
            borderRadius={3}
        >
            <Flex alignItems="center">
                {type === 'success' ? (
                    <CheckCircleIcon boxSize={5} color="green.500" />
                ) : (
                    <WarningIcon boxSize={5} color="redClrs" />
                )}

                <Text ml={2} fontSize="lg" fontWeight={600}>
                    {title}
                </Text>
            </Flex>

            {children}
        </Flex>
    );
};
