import * as React from "react";
import {
  Button,
  TextField,
  CssBaseline,
  Paper,
  Box,
  Grid,
  CircularProgress,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  IconButton,
} from "@mui/material";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Typography from "@mui/material/Typography";
import { ThemeProvider, styled } from "@mui/material/styles";
import { mdTheme } from "../../config/theme_config";

import { useRouter } from "next/router";
import { registerTrialUser } from "../../store/thunk/userThunk";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Validations from "../../helpers/validations";
import { notificationFail } from "../../store/slices/notificationSlice";
import {
  ApolloClientType,
  CountryType,
  StateType,
} from "../../store/Interface";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import StateSearchable from "../../components/searchable-dropdown/state-searchable";
import CountrySearchable from "../../components/searchable-dropdown/country-searchable";
import { countries } from "../../helpers/country-data";
import { states } from "../../helpers/state-data";
import { memberShipPlanData } from "../../helpers/membership-plan-data";
import Config from "../../config/config";
import Link from "@mui/material/Link";
import { verifyDiscountCode } from "../../store/thunk/subscription";
import SignUpLayout from "../../components/signup/signup-layout";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { QuestionMark } from "@mui/icons-material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

const passwordTooltip = "This password allows access to the learning portal.";
const parentPasswordTooltip =
  "This password allows access to the learning portal as well as the account settings area.";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

interface FormData {
  plan?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  mobile_no?: string;
  country?: CountryType;
  state?: StateType;
  country_code?: string;
  apartment?: string;
  city?: string;
  postal_code?: string;
  promo_code?: string;
  login_password?: string;
  setting_password?: string;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#99FD31" : "#308fe8",
  },
}));

function CheckoutForm(props: any) {
  const dispatch = useAppDispatch();
  const [paymentGatewayType, setPaymentGatewayType] =
    React.useState<string>("stripe");

  const stripe = useStripe();
  const elements = useElements();

  const Router = useRouter();
  const { plan, first_name, last_name, email }: any = Router.query;

  const [planData, setPlanData] = React.useState({
    id: 0,
    name: "",
    plan_value: "",
    plan_price: "",
    plan_type: "",
    plan_text: "",
    plan_price_text: "",
    interval_unit: "",
    product_price: {
      unit_amount: 0,
    },
  });

  const { discountDetail } = useAppSelector((state) => state.subscriptionSlice);

  const [codeApplyLoading, setCodeApplyLoading] =
    React.useState<boolean>(false);

  const [couponData, setCouponData] = React.useState<any>(null);

  const [totalAmount, setTotalAmount] = React.useState<string>("");
  const [discountOff, setDiscountOff] = React.useState<string>("");

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const { subscriptionPlanList } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const calculateDiscount = React.useMemo(() => {
    let discountPrice: number;

    if (couponData && Object.keys(couponData).length > 0) {
      if (couponData.amount_off) {
        discountPrice =
          Number(planData?.product_price?.unit_amount) / 100 -
          parseFloat(couponData.amount_off);
        setTotalAmount(discountPrice.toFixed(2));
        setDiscountOff(couponData.amount_off.toFixed(2) + "$");
        return couponData.amount_off;
      } else if (couponData.percent_off) {
        let amountOff =
          ((Number(planData?.product_price?.unit_amount) / 100) *
            couponData.percent_off.toFixed(2)) /
          100;

        discountPrice =
          Number(planData?.product_price?.unit_amount) / 100 - amountOff;
        setTotalAmount(discountPrice.toFixed(2));
        setDiscountOff(couponData.percent_off.toFixed(2) + "%");
        return amountOff;
      }
    } else {
      let totalAmount = Number(planData?.product_price?.unit_amount) / 100;
      setTotalAmount(totalAmount.toFixed(2));
    }
  }, [couponData]);

  React.useEffect(() => {
    if (Object.keys(discountDetail).length > 0) {
      setCouponData(discountDetail);
    } else {
      setCouponData(null);
    }
  }, [discountDetail]);

  React.useEffect(() => {
    if (first_name == "" || first_name === undefined) {
      Router.push(`/signup1/a`);
    }
    let selectedPlan = subscriptionPlanList.filter(
      (planData) => planData.trial_alias == plan
    );

    setPlanData(selectedPlan[0]);
    let amt = Number(selectedPlan[0]?.product_price?.unit_amount);
    amt = Number(amt) / 100;
    setPlanAmount(amt.toFixed(2));
  }, [subscriptionPlanList]);

  const handleOnChange = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };
  const [planAmount, setPlanAmount] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openStateSearchable, setOpenStateSearchable] =
    React.useState<boolean>(false);
  const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [openCountrySearchable, setOpenCountrySearchable] =
    React.useState<boolean>(false);
  const [countryAnchorEl, setCountryAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [stateData, setStateData] = React.useState<StateType[]>([]);
  const [values, setValues] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_no: "",
    country: {
      code: "AU",
      label: "Australia",
      phone: "61",
    },
    state: {
      id: "",
      latitude: "",
      longitude: "",
      name: "",
      state_code: "",
      type: "",
    },
    country_code: "",
    plan: plan,
    address: "",
    apartment: "",
    city: "",
    promo_code: "",
    postal_code: "",
    login_password: "",
    setting_password: "",
    showPassword: false,
    showParentPassword: false,
  });

  React.useEffect(() => {
    if (values.country) {
      let selectCountry = states.find(
        (value: any) =>
          value.name.toLowerCase() == values.country.label.toLowerCase()
      );
      setStateData(selectCountry ? selectCountry.states : []);
    }

    // setValues({
    //   ...values,
    //   state: {
    //     id: "",
    //     latitude: "",
    //     longitude: "",
    //     name: "",
    //     state_code: "",
    //     type: "",
    //   },
    // });
  }, [values.country]);

  const [formError, setFormError] = React.useState<FormData>();

  const handleChange =
    (prop: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const onChangeMobile = (event: any, value: any) => {
    let countryObj = countries.find((val) => val.label === value.name);
    setValues({
      ...values,
      country:
        countryObj && Object.keys(countryObj).length > 0
          ? countryObj
          : values.country,
      country_code: value.countryCode,
      mobile_no: event,
    });
  };

  const verifyCallbackFunc = (response: any) => {
    setCodeApplyLoading(false);
    console.log("Response", response);
  };

  const handleApplyDiscountCode = () => {
    let _request = {
      discount_code: values?.promo_code.toUpperCase(),
      plan_id: values?.plan,
    };
    setCodeApplyLoading(true);
    dispatch(
      verifyDiscountCode({ _request, userClient, result: verifyCallbackFunc })
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !CardElement) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    let reqParams: any = {
      first_name,
      last_name,
      email,
      login_password: values.login_password,
      setting_password: values.setting_password,
      street_1: values.address,
      apartment_no: values.apartment,
      mobile_no: values.mobile_no.trim(),
      country:
        values.country && Object.keys(values.country).length > 0
          ? values.country.label
          : null,
      state:
        values.state && Object.keys(values.state).length > 0
          ? values.state.name
          : null,
      country_code: values.country_code,
      city: values.city.trim(),
      plan_id: values.plan,
      promo_code: couponData ? couponData?.id : "",
      postal_code: values.postal_code,
      payment_gateway_type: paymentGatewayType,
      price: couponData ? totalAmount : planAmount,
    };

    let allError = Validations.validateSignup2PricingForm(reqParams);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);

      if (paymentGatewayType == "stripe") {
        // For Stripe Payment
        await stripe
          .createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${first_name} ${last_name} `,
            },
          })
          .then(async function (result: any) {
            if (result.error) {
              setLoading(false);
              dispatch(notificationFail(result.error.message));
              return;
            }
            // Handle result.error or result.paymentMethod
            const _request = {
              card_data: result.paymentMethod,
            };

            Object.assign(_request, reqParams);

            dispatch(
              registerTrialUser({
                _request,
                userClient,
                result: async (res: any) => {
                  setLoading(false);
                },
              })
            );
          })
          .catch((error: any) => {
            setLoading(false);
            dispatch(notificationFail(error.message));
          });
      } else {
        // For Paypal
        dispatch(
          registerTrialUser({
            _request: reqParams,
            userClient,
            result: async (res: any) => {
              setLoading(false);
            },
          })
        );
      }
    }
    setFormError(allError);
  };

  const handleOpenState = (event: any) => {
    setOpenStateSearchable(!openStateSearchable);
    setStateAnchorEl(event?.currentTarget || null);
  };

  const handleOpenCountry = (event: any) => {
    setOpenCountrySearchable(!openCountrySearchable);
    setCountryAnchorEl(event?.currentTarget || null);
  };

  const handleChangePlan = (event: SelectChangeEvent) => {
    setValues({
      ...values,
      plan: event.target.value,
      promo_code: "",
    });

    let selectedPlan = subscriptionPlanList.filter(
      (planData: any) => planData.trial_alias == event.target.value
    );

    setCouponData(null); //Reset coupen data
    setTotalAmount("");

    let amt = Number(selectedPlan[0]?.product_price?.unit_amount);
    amt = Number(amt) / 100;
    setPlanAmount(amt.toFixed(2));
    setPlanData(selectedPlan[0]);
  };

  const handleChangePaymentMethod = (field: any) => (event: any) => {
    setPaymentGatewayType(event.target.value);
  };

  return (
    <SignUpLayout>
      <Box
        component="form"
        className="form-element"
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid
          container
          component="main"
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundImage: `url(${"../images/sign-up-pricing-background.jpg"})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // height: "160vh",
            alignItems: "top",
            pt: 3,
          }}
          className="signup-second-page-container"
        >
          <CssBaseline />

          {/* First Section */}
          <Grid
            item
            xs={12}
            sm={10}
            md={4}
            component={Paper}
            square
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              mt: 0,
              maxHeight: "750px",
            }}
            className="signup-second-page"
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
              >
                Start FREE 14-Day Trial
              </Typography>
              <BorderLinearProgress variant="determinate" value={90} />
              <Typography
                component="p"
                className=""
                sx={{ textAlign: "center", mt: 1 }}
              >
                Create Your Account: Step 2 of 2
              </Typography>

              <Grid container spacing={1}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      sx={{ pt: 0 }}
                      onChange={handleChange("address")}
                      error={formError && formError.address ? true : false}
                      helperText={formError && formError.address}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="apartment"
                      label="Apartment, building, floor"
                      name="apartment"
                      sx={{ pt: 0 }}
                      onChange={handleChange("apartment")}
                      error={formError && formError.apartment ? true : false}
                      helperText={formError && formError.apartment}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={8} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      sx={{ pt: 0 }}
                      onChange={handleChange("city")}
                      error={formError && formError.city ? true : false}
                      helperText={formError && formError.city}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="postal_code"
                      label="Postal Code"
                      name="postal_code"
                      sx={{ pt: 0 }}
                      onChange={handleChange("postal_code")}
                      error={formError && formError.postal_code ? true : false}
                      helperText={formError && formError.postal_code}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="state"
                      name="state"
                      placeholder="Select State"
                      value={values.state?.name || ""}
                      inputProps={{
                        readOnly: true,
                      }}
                      onClick={handleOpenState}
                      error={formError && formError.state ? true : false}
                      helperText={formError && formError.state}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                    <StateSearchable
                      name={"state"}
                      options={stateData}
                      value={values.state}
                      open={openStateSearchable}
                      onClose={handleOpenState}
                      anchorEl={stateAnchorEl}
                      handleOnChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="country"
                      name="country"
                      placeholder="Select Country"
                      value={values.country?.label || ""}
                      inputProps={{
                        readOnly: true,
                      }}
                      onClick={handleOpenCountry}
                      error={formError && formError.country ? true : false}
                      helperText={formError && formError.country}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                    <CountrySearchable
                      name={"country"}
                      options={countries}
                      open={openCountrySearchable}
                      onClose={handleOpenCountry}
                      anchorEl={countryAnchorEl}
                      handleOnChange={handleOnChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                    <PhoneInput
                      value={values.mobile_no}
                      country={"au"}
                      containerClass={
                        formError && formError.mobile_no
                          ? "error-number-input"
                          : ""
                      }
                      onChange={(event, val) => onChangeMobile(event, val)}
                      countryCodeEditable={false}
                      enableSearch={true}
                    />
                    {formError && formError.mobile_no && (
                      <FormHelperText sx={{ ml: 2 }} error id="phone-error">
                        {formError.mobile_no}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InputLabel
                        className="textfield-label subscribe-textfield-label"
                        required
                      >
                        Student Password
                      </InputLabel>
                      <BootstrapTooltip title={passwordTooltip} arrow>
                        <QuestionMark className="helper-icon" />
                      </BootstrapTooltip>
                    </Box>
                    <TextField
                      required
                      fullWidth
                      type={values.showPassword ? "text" : "password"}
                      id="login_password"
                      // label="Student Password"
                      placeholder="Student Password"
                      name="login_password"
                      sx={{ pt: 0 }}
                      onChange={handleChange("login_password")}
                      error={
                        formError && formError.login_password ? true : false
                      }
                      helperText={formError && formError.login_password}
                      InputLabelProps={{
                        style: {
                          color: "#b2b2b2",
                          marginTop: "-3.5px",
                          maxWidth: "calc(100% - 55px)",
                        },
                        className: "signup-password-field",
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setValues({
                                  ...values,
                                  showPassword: !values.showPassword,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InputLabel
                        className="textfield-label subscribe-textfield-label"
                        required
                      >
                        Parent Portal Password
                      </InputLabel>
                      <BootstrapTooltip title={parentPasswordTooltip} arrow>
                        <QuestionMark className="helper-icon" />
                      </BootstrapTooltip>
                    </Box>
                    <TextField
                      required
                      fullWidth
                      type={values.showParentPassword ? "text" : "password"}
                      id="setting_password"
                      // label="Parent Portal Password"
                      placeholder="Parent Portal Password"
                      name="setting_password"
                      sx={{ pt: 0 }}
                      onChange={handleChange("setting_password")}
                      error={
                        formError && formError.setting_password ? true : false
                      }
                      helperText={formError && formError.setting_password}
                      InputLabelProps={{
                        style: {
                          color: "#b2b2b2",
                          marginTop: "-3.5px",
                          maxWidth: "calc(100% - 55px)",
                        },
                        className: "signup-password-field",
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setValues({
                                  ...values,
                                  showParentPassword:
                                    !values.showParentPassword,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showParentPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* Second Section */}
          <Grid
            item
            xs={12}
            sm={10}
            md={4}
            component={Paper}
            square
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              mt: 0,
              maxHeight: "750px",
            }}
            className="signup-second-page"
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <Typography
              variant="h6"
              sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
            >
              Put Your Children In The Hands Of A Master Educator And Transform
              Their Future Potential Today.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justify: "center",
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <img
                  src="/images/check_mark_green_black_bg.png"
                  alt="check_mark"
                  className="signup-pricing-check-mark"
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  Explicit Teaching
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <img
                  src="/images/check_mark_green_black_bg.png"
                  alt="check_mark"
                  className="signup-pricing-check-mark"
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  On Demand Learning
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <img
                  src="/images/check_mark_green_black_bg.png"
                  alt="check_mark"
                  className="signup-pricing-check-mark"
                  style={{ height: "10px", width: "10px" }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  Capability & Confidence
                </Typography>
              </Box>
            </Box> */}
              <Grid container sx={{ mt: 3 }}>
                <Grid item md={4} sm={12} xs={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "15px",
                      marginTop: "10px",
                    }}
                  >
                    Selected Plan
                  </Typography>
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                  <FormControl
                    fullWidth
                    error={formError && formError.plan ? true : false}
                  >
                    <InputLabel id="selected_plan">Plan</InputLabel>
                    <Select
                      labelId="selected_plan"
                      id="pricing_plan"
                      value={values.plan || ""}
                      label="Plan"
                      onChange={handleChangePlan}
                    >
                      {/* {memberShipPlanData?.map((plan: any) => (
                      <MenuItem value={plan.plan_value} key={plan.id}>
                        {plan.name}
                      </MenuItem>
                    ))} */}

                      {subscriptionPlanList?.map((plan: any) => (
                        <MenuItem value={plan.trial_alias} key={plan.id}>
                          {plan.name}
                        </MenuItem>
                      ))}
                    </Select>

                    {formError && formError.plan && (
                      <FormHelperText sx={{ ml: 2 }} error id="plan-error">
                        {formError.plan}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              {/*  */}
              <Grid container sx={{ mt: 3 }}>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid item md={12} sm={12} xs={12}>
                    Plan
                  </Grid>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: "bold" }}
                  >
                    {/* <span>Family Membership Annual Payment</span> */}
                    <span>{planData?.name}</span>
                    <span style={{ marginLeft: "35px" }}>$0 due Today</span>
                  </Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  {/* $2,496/year (plus applicable taxes) after your trial */}$
                  {planAmount}/{planData?.interval_unit} after your trial
                </Grid>
              </Grid>

              {/*  */}
              <Grid container sx={{ mt: 3 }}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "15px",
                      marginTop: "10px",
                    }}
                  >
                    Promo Code
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      id="promo_code"
                      label="Enter Promo Code If Applicable"
                      className="Add-coupon-textfield"
                      value={values?.promo_code}
                      onChange={handleChange("promo_code")}
                      sx={{ pt: 0, mt: 1, pr: 0 }}
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!codeApplyLoading ? (
                              values?.promo_code && (
                                <Button
                                  variant="contained"
                                  onClick={handleApplyDiscountCode}
                                  sx={{
                                    backgroundColor: "#99FD31",
                                    color: "rgb(0, 0, 0)",
                                    fontWeight: "bold",
                                    lineHeight: "15px",
                                    boxShadow: "none",
                                  }}
                                >
                                  Apply Promo Code
                                </Button>
                              )
                            ) : (
                              <CircularProgress
                                color={"inherit"}
                                size={20}
                                sx={{ mr: 1 }}
                              />
                            )}
                          </InputAdornment>
                        ),
                        className: "input-props-section",
                      }}
                      InputLabelProps={{
                        style: { color: "#b2b2b2", marginTop: "-3.5px" },
                      }}
                    />
                    {couponData && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          marginTop: "10px",
                          fontWeight: "bold",
                          color: "rgb(153,255,0)",
                          background: "#000000",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        {/* <span>
                        You will be charged total amount of {totalAmount} with{" "}
                        {discountOff} discount after trial period ends.
                      </span> */}

                        {planData?.interval_unit == "Year" ||
                        planData?.interval_unit == "Month" ? (
                          <span>
                            Congratulations. Your membership is now only $
                            {totalAmount} per{" "}
                            {planData?.interval_unit.toLocaleLowerCase()} after
                            your trial period ends.
                          </span>
                        ) : (
                          <span>
                            Congratulations. Your Family Lifetime Membership is
                            now only ${totalAmount} after your trial period
                            ends.
                          </span>
                        )}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container sx={{ mt: 3 }}>
                {/* <Grid item md={6} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item md={12} sm={12} xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InputLabel className="textfield-label">
                          Select Payment Gateway*
                        </InputLabel>
                      </Box>
                      <RadioGroup
                        row
                        onChange={handleChangePaymentMethod(
                          "paymentGatewayType"
                        )}
                        value={paymentGatewayType}
                      >
                        <FormControlLabel
                          value={"stripe"}
                          control={<Radio />}
                          label="Stripe"
                        />
                        <FormControlLabel
                          value={"paypal"}
                          control={<Radio />}
                          label="Paypal"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </Grid> */}
                <Grid item md={1} sm={1} xs={1}>
                  <Grid container sx={{ mt: 3 }}>
                    <Grid item md={12} sm={12} xs={12}>
                      <img
                        src="/images/payment-checkmark.png"
                        alt="check_mark"
                        style={{ height: "30px", width: "30px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={5}
                  sm={8}
                  xs={8}
                  className="secure-ssl-text-section"
                >
                  <Grid container sx={{ mt: 3 }}>
                    <Grid item md={12} sm={12} xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        Secure SSL Payment
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      Payment data stored on secure server
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {paymentGatewayType == "stripe" && (
                <Grid container spacing={1}>
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ marginTop: "15px" }}
                    className="customCardDesign"
                  >
                    <Grid
                      item
                      md={12}
                      sm={12}
                      xs={12}
                      className="signup-card-details"
                    >
                      <CardElement />
                      <Typography
                        variant="body1"
                        sx={{ my: 1, mx: 1, fontSize: "10px" }}
                      >
                        Why? We ask for a payment method so that your
                        subscription can continue without interuption after your
                        trial period ends.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mb: 2,
                  mt: 2,
                  backgroundColor: "#99FD31",
                  color: "rgb(0, 0, 0)",
                  fontWeight: "bold",
                }}
                disabled={loading ? true : false}
              >
                START MY FREE TRIAL
                {loading && <CircularProgress color={"primary"} size={20} />}
              </Button>
              <Grid container>
                <Grid item sx={{ fontSize: "10px" }}>
                  {planData?.interval_unit == "Year" ||
                  planData?.interval_unit == "Month" ? (
                    <Typography component="span" variant="caption">
                      14 days free trial from today then just $
                      {couponData ? totalAmount : planAmount}/
                      {planData?.interval_unit.toLowerCase()}. Cancel through
                      your dashboard or by email (
                      <Link
                        sx={{ color: "#1976d2" }}
                        href="mailto:support@my5mt.com"
                      >
                        support@my5mt.com
                      </Link>
                      ). I agree to the{" "}
                      <Link
                        href="/termsandconditions"
                        target="blank"
                        sx={{ color: "#1976d2" }}
                      >
                        {" "}
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacypolicy"
                        target="blank"
                        sx={{ color: "#1976d2" }}
                      >
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  ) : (
                    <Typography component="span" variant="caption">
                      14 days free trial from today then a single payment of $
                      {couponData ? totalAmount : planAmount}. I agree to the{" "}
                      <Link
                        href="/termsandconditions"
                        target="blank"
                        sx={{ color: "#1976d2" }}
                      >
                        {" "}
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacypolicy"
                        target="blank"
                        sx={{ color: "#1976d2" }}
                      >
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </SignUpLayout>
  );
}

function SignUpPricingSecond() {
  let stripePromise: any;
  stripePromise = loadStripe(Config.stripe_publish_key);
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default SignUpPricingSecond;
