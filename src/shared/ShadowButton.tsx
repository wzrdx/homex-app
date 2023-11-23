import { Box, Flex } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

const OFFSET = 0.5;

export const ShadowButton: FunctionComponent<
    PropsWithChildren<{ color: string; borderColor: string; onClick: () => void; isEnabled?: boolean }>
> = ({ children, color, borderColor, onClick, isEnabled }) => {
    return (
        <Box position="relative" onClick={onClick}>
            <Flex
                position="relative"
                px={3.5}
                py={1.5}
                alignItems="center"
                backgroundColor={color}
                border={`2px solid ${borderColor}`}
                transition="all 0.1s ease-in"
                filter={isEnabled ? 'brightness(1.3)' : 'brightness(1)'}
                _hover={{ filter: 'brightness(1.3)' }}
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
