import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Button, Stack } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { range } from '../services/helpers';

export const Pagination: FunctionComponent<
    PropsWithChildren<{ total: number; pageSize: number; onPageChange: (page: number) => void }>
> = ({ total, pageSize, onPageChange }) => {
    const [currentPage, setPage] = useState<number>(1);

    return (
        <Stack direction="row">
            <Button
                size="sm"
                width="36px"
                height="34px"
                background="#2c313d"
                _hover={{ background: '#4e5360' }}
                onClick={() => {
                    if (currentPage > 1) {
                        const page = currentPage - 1;
                        setPage(page);
                        onPageChange(page);
                    }
                }}
            >
                <ArrowBackIcon fontSize="18px" />
            </Button>

            {range(Math.ceil(total / pageSize)).map((index) => (
                <Button
                    key={index}
                    size="sm"
                    fontSize="17px"
                    width="36px"
                    height="34px"
                    background={currentPage === index ? '#4e5360' : '#2c313d'}
                    _hover={{ background: '#4e5360' }}
                    onClick={() => {
                        const page = index;
                        setPage(page);
                        onPageChange(page);
                    }}
                >
                    {index}
                </Button>
            ))}

            <Button
                size="sm"
                width="36px"
                height="34px"
                background="#2c313d"
                _hover={{ background: '#4e5360' }}
                onClick={() => {
                    if (currentPage < Math.ceil(total / pageSize)) {
                        const page = currentPage + 1;
                        setPage(page);
                        onPageChange(page);
                    }
                }}
            >
                <ArrowForwardIcon fontSize="18px" />
            </Button>
        </Stack>
    );
};
