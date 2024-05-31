import NextLink from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EmptyState = () => (
    // <Box
    //     component="main"
    //     sx={{
    //         alignItems: 'center',
    //         display: 'flex',
    //         position:"absolute",
    //         flexGrow: 1,
    //         minHeight: '100%',
    //     }}
    // >
    //     <Container maxWidth="md">
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <img
                        alt="Under development"
                        src="/images/undraw_empty_state.svg"
                        style={{
                            marginTop: 50,
                            display: 'inline-block',
                            maxWidth: '100%',
                            width: 300
                        }}
                    />
                </Box>
                {/* <Typography
                    align="center"
                    color="textPrimary"
                    variant="h6"
                    sx={{mt:2}}
                >
                    Sorry, No Lesson are available for this week.!!
                </Typography> */}
                <Typography
                    align="center"
                    color="textPrimary"
                    variant="body1"
                    sx={{mt:2}}
                >
                    No Lesson are available for this week enjoy!!
                </Typography>

            </Box>
        // </Container>
    // </Box>
);

export default EmptyState;
