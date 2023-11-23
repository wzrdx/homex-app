import { Box, Flex } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

const OFFSET = '1px';

export const IconWithShadow: FunctionComponent<PropsWithChildren<{ shadowColor: string }>> = ({ children, shadowColor }) => {
    return (
        <Box position="relative">
            <Flex position="relative" zIndex={2}>
                {children}
            </Flex>

            <Box
                position="absolute"
                top={OFFSET}
                right={`-${OFFSET}`}
                bottom={`-${OFFSET}`}
                left={OFFSET}
                color={shadowColor}
                zIndex={1}
            >
                {children}
            </Box>
        </Box>
    );
};
