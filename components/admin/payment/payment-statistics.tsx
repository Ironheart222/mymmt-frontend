import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { ApolloClientType } from '../../../store/Interface';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

export const PaymentStatistics = (props: any) => {

    const dispatch = useAppDispatch();
    const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);

    const [openAddPlan, setOpenAddPlan] = React.useState<boolean>(false);

    return (
        <React.Fragment>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="card-box bg-midnight-bloom text-light mb-4">
                        <CardContent className="p-3">
                            <div className="d-flex align-items-start">
                                <div>
                                    <Typography variant='caption'>Today Collections</Typography>
                                    <Typography variant='h4'>23,274</Typography>
                                    {/* <span className="font-size-xxl mt-1">23,274</span> */}
                                </div>
                            </div>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <ArrowUpwardRoundedIcon sx={{ fontSize: "18px", color: "#198754", mb: 0.4 }} />
                                <Typography variant='subtitle2' className='stastics-number-text'>7.5%</Typography>
                                <Typography variant='subtitle2' >increase this week</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="card-box bg-midnight-bloom text-light mb-4">
                        <CardContent className="p-3">
                            <div className="d-flex align-items-start">
                                <div>
                                    <Typography variant='caption'>Weekly Collections</Typography>
                                    <Typography variant='h4'>23,274</Typography>
                                    {/* <span className="font-size-xxl mt-1">23,274</span> */}
                                </div>
                                {/* <div className="ml-auto">
                                    <div className="bg-white text-center text-primary d-50 rounded-circle d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon icon={['far', 'lightbulb']} className="font-size-xl" />
                                    </div>
                                </div> */}
                            </div>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <ArrowUpwardRoundedIcon sx={{ fontSize: "18px", color: "#198754", mb: 0.4 }} />
                                <Typography variant='subtitle2' className='stastics-number-text'>7.5%</Typography>
                                <Typography variant='subtitle2' >increase this week</Typography>
                                {/* <span className="text-warning pr-1">7.4%</span> */}
                                {/* <span className="text-white-50">same as before</span> */}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="card-box bg-midnight-bloom text-light mb-4">
                        <CardContent className="p-3">
                            <div className="d-flex align-items-start">
                                <div>
                                    <Typography variant='caption'>Monthly Collections</Typography>
                                    <Typography variant='h4'>23,274</Typography>
                                    {/* <span className="font-size-xxl mt-1">23,274</span> */}
                                </div>
                                {/* <div className="ml-auto">
                                    <div className="bg-white text-center text-primary d-50 rounded-circle d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon icon={['far', 'lightbulb']} className="font-size-xl" />
                                    </div>
                                </div> */}
                            </div>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <ArrowUpwardRoundedIcon sx={{ fontSize: "18px", color: "#198754", mb: 0.4 }} />
                                <Typography variant='subtitle2' className='stastics-number-text'>7.5%</Typography>
                                <Typography variant='subtitle2' >increase this week</Typography>
                                {/* <span className="text-warning pr-1">7.4%</span> */}
                                {/* <span className="text-white-50">same as before</span> */}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="card-box bg-midnight-bloom text-light mb-4">
                        <CardContent className="p-3">
                            <div className="d-flex align-items-start">
                                <div>
                                    <Typography variant='caption'>Yearly Collections</Typography>
                                    <Typography variant='h4'>23,274</Typography>
                                    {/* <span className="font-size-xxl mt-1">23,274</span> */}
                                </div>
                                {/* <div className="ml-auto">
                                    <div className="bg-white text-center text-primary d-50 rounded-circle d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon icon={['far', 'lightbulb']} className="font-size-xl" />
                                    </div>
                                </div> */}
                            </div>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <ArrowUpwardRoundedIcon sx={{ fontSize: "18px", color: "#198754", mb: 0.4 }} />
                                <Typography variant='subtitle2' className='stastics-number-text'>7.5%</Typography>
                                <Typography variant='subtitle2' >increase this week</Typography>
                                {/* <span className="text-warning pr-1">7.4%</span> */}
                                {/* <span className="text-white-50">same as before</span> */}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </React.Fragment >
    )
}
