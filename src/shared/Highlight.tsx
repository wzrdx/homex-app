import { Text } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

export const Highlight: FunctionComponent<PropsWithChildren<{ color?: string }>> = ({ children, color = 'logHighlight' }) => {
    return (
        <Text as="span" color={color} fontWeight={500}>
            {children}
        </Text>
    );
};
