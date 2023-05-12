import { extendTheme } from '@chakra-ui/react';

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
};

const fonts = {
    body: 'IBM Plex Mono, monospace',
    heading: 'IBM Plex Mono, monospace',
    mono: 'IBM Plex Mono, monospace',
};

const styles = {
    global: {
        body: {
            color: 'whitesmoke',
            bg: 'linear-gradient(0deg, #330000, #1c0001)',
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
        fontSize: '15px',
    },
    responsive: {
        background: 'orangered',
        color: 'whitesmoke',
        zIndex: 5,
        px: 1,
    },
};

const breakpoints = {
    sm: '696px',
    md: '960px',
    lg: '1536px',
    xl: '1900px',
    '2xl': '2136px',
};

export const theme = extendTheme({
    colors,
    fonts,
    styles,
    layerStyles,
    breakpoints,
});
