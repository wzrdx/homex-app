import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const colors = {
    resources: {
        energy: '#287ece',
        herbs: '#039d5d',
        gems: '#e24e06',
        essence: '#cd3b95',
        tickets: '#7927e2',
    },
    header: {
        gray: '#718181',
        lightgray: '#8e9e9e',
        gold: '#f4d091',
    },
    almostWhite: 'gainsboro',
    dark: '#191919',
    darkBlue: '#23242a',
    lightDark: '#212121',
    brightBlue: '#88ddff',
    lightOrange: '#ee8b1c',
};

const fonts = {
    body: "'Space Grotesk', sans-serif",
    heading: "'Space Grotesk', sans-serif",
    mono: "'Space Grotesk', sans-serif",
};

const styles = {
    global: {
        body: {
            color: 'whitesmoke',
            bg: 'dark',
        },
    },
};

const layerStyles = {
    layout: {
        width: '1420px',
    },
    header1: {
        textTransform: 'uppercase',
        fontSize: '20px',
        fontWeight: 600,
        letterSpacing: '0.75px',
    },
    questDescription: {
        textAlign: 'justify',
        lineHeight: '22px',
    },
    responsive: {
        background: 'orangered',
        color: 'whitesmoke',
        zIndex: 5,
        px: 1,
    },
    absoluteCentered: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
};

const breakpoints = {
    sm: '696px',
    md: '960px',
    lg: '1736px',
    xl: '2026px',
    '2xl': '2436px',
};

export const theme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    layerStyles,
    breakpoints,
});
