import { Box, Flex } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

const OFFSET = 0.5;

export const ShadowButton: FunctionComponent<
    PropsWithChildren<{ color: string; borderColor: string; onClick: () => void }>
> = ({ children, color, borderColor, onClick }) => {
    return (
        <Box position="relative" onClick={onClick}>
            <Flex
                position="relative"
                px={3.5}
                py={2}
                alignItems="center"
                backgroundColor={color}
                border={`2px solid ${borderColor}`}
                transition="all 0.1s ease-in"
                _hover={{ filter: 'brightness(1.1)' }}
                cursor="pointer"
                zIndex={2}
            >
                {children}
            </Flex>

            <Box
                position="absolute"
                top={OFFSET}
                right={-OFFSET}
                bottom={-OFFSET}
                left={OFFSET}
                backgroundColor={borderColor}
                zIndex={1}
            ></Box>
        </Box>
    );
};
