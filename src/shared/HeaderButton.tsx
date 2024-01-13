import { AiOutlineSetting } from 'react-icons/ai';
import { TbBook } from 'react-icons/tb';
import { LuSwords } from 'react-icons/lu';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const ICONS = {
    Swords: <LuSwords fontSize="19px" />,
    Settings: <AiOutlineSetting fontSize="20px" />,
    Gameplay: <TbBook fontSize="20px" />,
};

export const HeaderButton: FunctionComponent<
    PropsWithChildren<{
        type: 'Swords' | 'Settings' | 'Gameplay';
        color: string;
        backgroundColor: string;
        text: string;
        onClick: () => void;
    }>
> = ({ type, color, backgroundColor, text, onClick }) => {
    const getIcon = () => <Box color={color}>{ICONS[type]}</Box>;

    return (
        <Flex
            ml={2.5}
            alignItems="center"
            padding="8px 15px"
            borderRadius="9999px"
            backgroundColor={backgroundColor}
            cursor="pointer"
            transition="all 0.15s cubic-bezier(0.21, 0.6, 0.35, 1)"
            _hover={{ filter: 'brightness(1.2)' }}
            onClick={onClick}
        >
            {getIcon()}

            <Text ml={2} color="white">
                {text}
            </Text>
        </Flex>
    );
};
