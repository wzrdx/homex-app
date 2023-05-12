import { FunctionComponent, PropsWithChildren } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import style from './ActionButton.module.scss';

export const ActionButton: FunctionComponent<
    PropsWithChildren<{
        isLoading?: boolean;
        disabled?: boolean;
        onClick?: () => void;
        colorScheme?: string;
        buttonWidth?: string;
    }>
> = ({ children, isLoading, disabled, onClick, colorScheme = 'default', buttonWidth = 'default' }) => {
    const getColorScheme = () => {
        if (disabled) {
            return style.disabled;
        } else if (colorScheme) {
            return style[colorScheme];
        } else {
            return style.default;
        }
    };

    return (
        <Flex
            className={`${style.actionButton} ${getColorScheme()}`}
            position="relative"
            width={[160, 160, 160, 200]}
            padding={['0.4rem', '0.4rem', '0.4rem', '0.5rem']}
            onClick={() => {
                if (!disabled && !isLoading && onClick) {
                    onClick();
                }
            }}
            alignItems="center"
            justifyContent="center"
            cursor={isLoading || disabled ? 'not-allowed' : 'pointer'}
            style={buttonWidth === 'small' ? { width: '160px' } : {}}
        >
            {isLoading && (
                <Flex
                    position="absolute"
                    alignItems="center"
                    justifyContent="center"
                    top="0"
                    right="0"
                    bottom="0"
                    left="0"
                >
                    <Spinner size="sm" />
                </Flex>
            )}
            <Box visibility={isLoading ? 'hidden' : 'visible'}>{children}</Box>
        </Flex>
    );
};
