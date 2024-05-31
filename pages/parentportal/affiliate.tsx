import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import * as React from 'react';
import ParentSettingsLayout from '../../components/parent-setting/parent-settings-layout';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Auth from '../../config/auth';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getAffiliateDetail, sentInvitationLink } from '../../store/thunk/parentThunk';
import { ApolloClientType } from '../../store/Interface';
import Validations from '../../helpers/validations';

interface FormError {
    email?: string
}

function Affiliate() {
    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)
    const { affiliateData } = useAppSelector((state) => state.parentReducer)

    let [email, setEmail] = React.useState<string>('');
    let [refferalLink, setRefferalLink] = React.useState<string>('');
    let [refferalPoint, setRefferalPoint] = React.useState<number>(0);
    let [isCopied, setIsCopied] = React.useState<boolean>(false);
    let [isCopying, setIsCopying] = React.useState<boolean>(false);
    let [loading, setLoading] = React.useState<boolean>(false);
    let [formError, setFormError] = React.useState<FormError>({});

    React.useEffect(() => {
        dispatch(getAffiliateDetail(userClient));
    }, []);

    React.useEffect(() => {
        if (affiliateData) {
            setRefferalPoint(+affiliateData.referral_point)
            setRefferalLink(affiliateData.referral_link);
        }
    }, [affiliateData]);

    React.useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
    }, [isCopied]);

    const copyToClipboard = () => {
        if (refferalLink) {
            setIsCopying(true);
            setTimeout(() => {
                const el = document.createElement(`textarea`)
                el.value = refferalLink
                el.setAttribute(`readonly`, ``)
                document.body.appendChild(el)
                el.select()
                document.execCommand(`copy`)
                document.body.removeChild(el);
                setIsCopied(true);
                setIsCopying(false);
            }, 1000);
        }
    }

    const result = (response: any) => {
        if (response.status === "true") {
            setLoading(false);
            setEmail('');
        }
    }
    const handleSentLink = () => {
        let _request = {
            email: email
        }
        let allError = Validations.validateEmail(_request);

        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            setLoading(true);
            dispatch(sentInvitationLink({ _request, userClient, result }));
        }
        setFormError(allError);
    }

    return (
        <ParentSettingsLayout>
            <Box sx={{
                m: {
                    lg: 4,
                    md: 4,
                    sm: 2,
                    xs: 2
                }
            }}>
                <Box sx={{mb:2}}>
                    <Typography variant='body1' className="header-h6 border-green">
                        Become An Affiliate
                    </Typography>
                </Box>
                <Box sx={{background: "#000", padding: "12px", borderRadius: "8px"}}>
                    <Typography variant="h6" sx={{color: "#99FD31"}}>
                        Coming Soon
                    </Typography>
                </Box>
                {/* <CardHeader
                    title="Refer Friends & Earn Credit"
                    subheader="Invite you friends to Math Tutor. If they sign up, you'll will be credited 10 POINTS to your account."
                    titleTypographyProps={{ color: "#fff" }}
                    subheaderTypographyProps={{
                        color: "#fff"
                    }}
                    sx={{
                        position: "absolute",
                        backgroundColor: "#000",
                    }}
                /> */}
                {/* <Card elevation={4}>
                    <Box sx={{ display: "flex", flexDirection: "row", background: "#000" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2 }}>
                            <Typography variant="h6" className='white-text'>
                                Refer Friends & Earn Credit
                            </Typography>
                            <Typography variant="body1" className="white-text">
                                Invite you friends to Math Tutor. If they sign up, you&apos;ll be credited 10 POINTS to your account.
                            </Typography>
                        </Box>
                        <Box className="points-box">
                            <Typography variant="h4" color="inherit">
                                {refferalPoint}
                            </Typography>
                            <Typography variant="subtitle2">
                                POINTS
                            </Typography>
                        </Box>
                    </Box>



                    <CardContent sx={{ p: { md: 4, sm: 4, xs: 2} }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <Typography variant='h6' className='affiliate-subheader1'>
                                Invite your friends
                            </Typography>
                            <Typography variant='subtitle1' className='affiliate-subheader2'>
                                Insert your friend&apos;s email address and send them invitation to join Math Tutor!
                            </Typography>
                            <TextField
                                required
                                id="email"
                                name="email"
                                autoComplete="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    style: {
                                        paddingLeft: 6,
                                        paddingRight: 4,
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {
                                                !loading ? (
                                                    <IconButton onClick={handleSentLink} className="sent-link-btn">
                                                        <SendRoundedIcon
                                                            sx={{ fontSize: "16px", color: "#fff" }} />
                                                    </IconButton>
                                                ) : (
                                                    <CircularProgress size={20} />
                                                )
                                            }
                                        </InputAdornment>
                                    ),
                                }}
                                className='email-invitation'
                                error={formError && formError.email ? true : false}
                                helperText={formError && formError.email}
                            />
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            mt: 4
                        }}>
                            <Typography variant='h6' className='affiliate-subheader1'>
                                Share the referral link
                            </Typography>
                            <Typography variant='subtitle1' className='affiliate-subheader2'>
                                You can also share your referral link by copying and sending it.
                            </Typography>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                py: 0.5,
                                px: 2,
                                mt: 2,
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#f1f6ff",
                                borderRadius: "30px"
                            }}>
                                <Grid container>
                                    <Grid item md={10} sm={10} xs={8} display="flex" alignItems="center">
                                        <Typography variant='body1' id="refer_link" className='affiliate-subheader2'>
                                            {refferalLink}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={2} xs={4} textAlign="end">
                                        <Button onClick={() => copyToClipboard()} variant='text' className={isCopied ? "copied-text" : "copy-text"}>
                                            {isCopied && <CheckCircleIcon className="copied-sign" />}
                                            {isCopying ? (<CircularProgress color='success' size={20} />) : (isCopied ? "Copied" : "Copy")}
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Box>
                    </CardContent>
                </Card> */}
            </Box>
        </ParentSettingsLayout>
    )
}

export default Auth(Affiliate);