import * as React from 'react';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, InputLabel, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import Config from '../../config/config';
import { loadStripe } from '@stripe/stripe-js';
import { notificationFail } from '../../store/slices/notificationSlice';
import { updateCreditCardDetail } from '../../store/thunk/subscription';
import { ApolloClientType } from '../../store/Interface';
import assert from 'assert';

const CheckoutForm = (props: any) => {

    const { closeModal, paymentMethods } = props;
    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)
    const { buttonLoading } = useAppSelector((state) => state.subscriptionSlice)
    const stripe = useStripe();
    const elements = useElements();

    // const classes = useStyle();
    const [name, setName] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setLoading(buttonLoading);
    }, [buttonLoading]);

    //update creadit card detail and set new payment method as default in stripe
    const updateCreditCard = async () => {

        if (!stripe || !elements || !CardElement) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);
        await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
            billing_details: {
                name: name,
            },
        }).then(async function (result: any) {
            if (result.error) {
                setLoading(false);
                dispatch(notificationFail(result.error.message))
                // dispatch(setLoading(false))
                return
            }
            // Handle result.error or result.paymentMethod
            const _request = {
                cardData: result.paymentMethod,
            }

            if (paymentMethods && Object.keys(paymentMethods).length > 0) {
                Object.assign(_request, { payment_method_id: paymentMethods.id })
            }

            dispatch(updateCreditCardDetail({
                _request, userClient, result:async (res: any) => {
                    closeModal();
                }
            }))
        }).catch((error: any) => {
            dispatch(notificationFail(error.message))
            // dispatch(setLoading(false))
        })
    };

    return (
        <form>
            <DialogContent className="customCardDesign">
                <Grid container>
                    <Grid item md={12}>
                        <Box className='card-details'>
                            <Grid container>
                                {
                                    <>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <InputLabel className="textfield-label" required>Card holder Name</InputLabel>
                                            <TextField
                                                variant='outlined'
                                                id="cardholderName"
                                                name="cardholderName"
                                                placeholder='Cardholder Name'
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12} style={{ marginTop: '30px' }}>
                                            <CardElement />
                                        </Grid>
                                    </>
                                }

                                {paymentMethods && Object.keys(paymentMethods).length > 0 &&
                                    <>
                                        <Grid item md={12} sm={12} xs={12} style={{ marginTop: '20px' }}>
                                            <Typography variant='body1' sx={{ my: 1, mx: 1, color: "rgba(108,108,132,1)" }}>
                                                Enter your new card detail above and click the save button it will be replace with below card.
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12} style={{ marginTop: "10px" }} container>
                                            <Grid item md={6} sm={12} xs={12}>
                                                <span className='subdesc'>Card holder Name</span>
                                                <span className='card-holder-name'>
                                                    {paymentMethods.billing_details.name}
                                                </span>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12} style={{ marginTop: '10px' }}>
                                            <div className="cardBox">
                                                <Grid container>
                                                    <Grid item md={6} sm={6} xs={12}>
                                                        <CreditCardTwoToneIcon style={{ fontSize: 20, color: '#c1bcbc' }} />
                                                        <span style={{ fontWeight: 'bold', color: "#606B76" }}>Saved Card</span>
                                                    </Grid>
                                                    <Grid item md={6} sm={6} xs={12}>
                                                        <span style={{ fontWeight: 'bold', color: "#606B76", float: "right"}}>**** **** **** {paymentMethods.card.last4}</span>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Grid>

                                    </>
                                }
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <Box mt={3} mb={3} mr={4} display='flex' justifyContent='flex-end'>

                <>
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="contained" disabled={loading || !stripe ? true : false} color='primary' onClick={updateCreditCard}>
                        {loading ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                </>
            </Box>
        </form>
    )
}

function AddCardDetailModal({ open, onClose, paymentMethods }: any) {

    const dispatch = useAppDispatch();
    let stripePromise: any;

    stripePromise = loadStripe(Config.stripe_publish_key);

    return (
        <Dialog
            disableEscapeKeyDown
            fullWidth={true}
            maxWidth={'sm'}
            scroll='paper'
            open={open}>
            <DialogTitle>Add Card Detail</DialogTitle>
            <Elements stripe={stripePromise} >
                <CheckoutForm closeModal={onClose} openCloseSuccessModal={onClose} paymentMethods={paymentMethods} />
            </Elements>
        </Dialog>
    );
}

export default AddCardDetailModal;