import { Box } from '@chakra-ui/react';
import { BsExclamation } from 'react-icons/bs';

export const NewSymbol = ({ isVisible }) => {
    return (
        <Box
            visibility={isVisible ? 'visible' : 'hidden'}
            borderWidth="2px"
            borderColor="wheat"
            transform="rotate(45deg)"
            boxShadow="0 0 3px wheat"
            backgroundColor="#2f2f2f"
        >
            <Box color="wheat" transform="rotate(-45deg)" fontSize={{ md: '18px', lg: '19px' }} margin="-3px">
                <BsExclamation />
            </Box>
        </Box>
    );
};
