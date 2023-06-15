import { FunctionComponent, PropsWithChildren } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import style from './ActionButton.module.scss';
import { isEmpty } from 'lodash';
import { useTransactionsContext, TransactionsContextType } from '../../services/transactions';

export const ActionButton: FunctionComponent<
    PropsWithChildren<{
        isLoading?: boolean;
        disabled?: boolean;
        onClick?: () => void;
        colorScheme?: string;
        customStyle?: any;
    }>
> = ({ children, isLoading, disabled, onClick, colorScheme = 'default', customStyle }) => {
    const { isGamePaused } = useTransactionsContext() as TransactionsContextType;

    const getColorScheme = () => {
        if (isDisabled()) {
            return style.disabled;
        } else if (colorScheme) {
            return style[colorScheme];
        } else {
            return style.default;
        }
    };

    const isDisabled = () => isGamePaused || disabled;

    return (
        <Flex
            className={`${style.actionButton} ${getColorScheme()} ${isLoading ? style.loading : ''}`}
            position="relative"
            width={[160, 160, 160, 200]}
            padding={['0.4rem', '0.4rem', '0.4rem', '0.45rem']}
            onClick={() => {
                if (!isDisabled() && !isLoading && onClick) {
                    onClick();
                }
            }}
            alignItems="center"
            justifyContent="center"
            cursor={isLoading || isDisabled() ? 'not-allowed' : 'pointer'}
            style={!isEmpty(customStyle) ? customStyle : {}}
        >
            {isLoading && (
                <Flex position="absolute" alignItems="center" justifyContent="center" top="0" right="0" bottom="0" left="0">
                    <Spinner size="sm" />
                </Flex>
            )}
            <Box userSelect="none" visibility={isLoading ? 'hidden' : 'visible'}>
                {isGamePaused ? 'Game paused' : children}
            </Box>
        </Flex>
    );
};
