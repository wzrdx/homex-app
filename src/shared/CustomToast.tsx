import { CheckCircleIcon, InfoOutlineIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MdErrorOutline } from 'react-icons/md';

const ICON_SIZE = '19px';

export const CustomToast: FunctionComponent<
    PropsWithChildren<{
        type: string;
        color: string;
        title: string;
    }>
> = ({ children, type, color, title }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon fontSize={ICON_SIZE} color="green.500" />;

            case 'error':
                return (
                    <Box color={color} mb="1px">
                        <MdErrorOutline fontSize="22px" />
                    </Box>
                );

            case 'time':
                return <TimeIcon fontSize={ICON_SIZE} color="whiteAlpha.800" />;

            default:
                return <InfoOutlineIcon fontSize={ICON_SIZE} color="green.500" />;
        }
    };

    return (
        <Flex
            flexDir="column"
            backgroundColor="#222222"
            borderInlineStartWidth="4px"
            borderInlineStartColor={color}
            px={4}
            py={3}
            borderRadius={3}
        >
            <Flex alignItems="center">
                {getIcon()}

                <Text ml={2} fontSize="17px" fontWeight={600}>
                    {title}
                </Text>
            </Flex>

            {children}
        </Flex>
    );
};
