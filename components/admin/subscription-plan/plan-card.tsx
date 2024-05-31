import Head from 'next/head';
import { Box, Button, Card, Container, List, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import { useEffect, useState } from 'react';

const PlanCard = (props: any) => {
    let { plandetails } = props

    const [descriptionArr, setDescriptionArr] = useState<string[]>([]);
    const [maxChildAllowed, setMaxChildAllowed] = useState<string>();

    useEffect(() => {
        if (plandetails) {
            let arr = [];
            if (plandetails.description) {
                arr = plandetails.description.split("|");
            }
            setDescriptionArr(arr);

            if (plandetails.metadata?.max_child_allowed) {
                setMaxChildAllowed(plandetails.metadata?.max_child_allowed);
            }
        }
    }, [plandetails]);

    return (
        <Box className="Pricing-card">
            <Box>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    className="Pricing-title Pricing-main"
                >
                    {plandetails.name}
                </Typography>
            </Box>
            <Box sx={{ my: 0.3 }}>
                <div className="Pricing-second-block">
                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        className="Pricing-subtitle"
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {
                                Number(maxChildAllowed) < 2 && (
                                    <PersonIcon className="Pricing-icon" />
                                )
                            }
                            {
                                Number(maxChildAllowed) == 2 && (
                                    <PeopleIcon className="Pricing-icon" />
                                )
                            }
                            {
                                Number(maxChildAllowed) > 2 && (
                                    <img src="/images/person_group.png" width="36px" height="18px" style={{ marginRight: "12px" }} />
                                )
                            }
                            {plandetails.metadata?.subtitle || ""}
                        </Box>
                    </Typography>
                </div>
            </Box>
            <Box className="Pricing-body">
                <ul>
                    {descriptionArr.map((line: any, index: any) => (
                        <Box key={index} sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
                            <img src="/images/check_mark_green.png" alt="check_mark" className="Pricing-check-mark" />
                            <Typography variant='body2' sx={{ color: "#fff", letterSpacing: 0.4, ml: 1, pt: 0.1 }}>
                                {line}
                            </Typography>
                        </Box>
                    ))}
                </ul>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "flex-end",
                        my: 2,
                    }}
                >
                    {/* <Typography variant="subtitle1">
                        $
                    </Typography> */}
                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        className="Pricing-amount">
                        ${plandetails.product_price?.unit_amount / 100} /month
                    </Typography>
                    {/* <Typography variant='body1' sx={{ color: "rgba(108,108,132,0.8)", ml: 1, letterSpacing: 0.7 }}>
                        <strong>/ month</strong>
                    </Typography> */}
                </Box>
            </Box>
        </Box>
        // <Card className='plan-card'>
        //     <Typography variant='h3' className='plan-category'>
        //         {plandetails.name}
        //     </Typography>

        //     <Typography variant='h2' className='plan-price'>
        //         {"$" + "120" + "/month"}
        //     </Typography>

        //     {/* <List>
        //         {
        //             plandetails.description && plandetails.description.map((value: any, index: number) => (
        //                 <Stack direction={"row"} className={"plan-description"} spacing={1} key={index}>
        //                     <ListItemIcon>
        //                         <CheckCircleOutlineRoundedIcon className='description-icon' />
        //                     </ListItemIcon>
        //                     <Typography className='description-title'>
        //                         {value}
        //                     </Typography> */}
        //                     {/* <ListItemText primary={value} className='description-title'/> */}
        //                 {/* </Stack>
        //             ))
        //         }
        //     </List> */}
        // </Card>
    )
}

export default PlanCard;
