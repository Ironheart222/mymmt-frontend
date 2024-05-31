import * as React from "react";
import {
  IconButton,
  Button,
  Box,
  Typography,
  InputAdornment,
  InputLabel,
  CircularProgress,
  Drawer,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Stack,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarToday from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ApolloClientType } from "../../../store/Interface";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import Validations from "../../../helpers/validations";
import { addDiscountCode } from "../../../store/thunk/admin/discountThunk";

const StageArray = ["stage 2", "stage 3"];

export enum AmountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

interface GeneralData {
  code: string;
  amount: string;
  amount_type: AmountType;
  currency: string;
}

interface SettingsData {
  is_expiry_date: boolean;
  expiry_date: Date | null;
  is_duration_in_months: boolean;
  duration_in_months: string;
  duration: string;
}

interface PlanType {
  plan_id: string;
  name: string;
  trial_alias: string;
}
interface PlanData {
  is_plan: boolean;
  subscription_plan: PlanType;
}

interface FormError {
  code?: string;
  amount?: string;
  amount_type?: AmountType;
  currency?: string;
  expiry_date?: string;
  is_expiry_date?: boolean;
  is_duration_in_months?: boolean;
  duration_in_months?: string;
  subscription_plan?: string;
}

interface PropType {
  open: boolean;
  toggleModel: () => void;
}

/* let plan = [
  {
    plan_id: "prod_Lpajrh9Ig0MEFr",
    name: "Single Membership",
  },
  {
    plan_id: "prod_Lpb8CFfIQhL92X",
    name: "Family Membership",
  },
]; */

let currency = ["INR", "USD", "AED", "AMD", "EUR"];

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

export default function AddDiscountModel(props: PropType) {
  const { toggleModel, open } = props;

  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);
  const { subscriptionPlanList } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );

  const [generalData, setGeneralData] = React.useState<GeneralData>({
    code: "",
    amount: "",
    amount_type: AmountType.PERCENTAGE,
    currency: "",
  });

  const [settingsData, setSettingsData] = React.useState<SettingsData>({
    is_expiry_date: false,
    expiry_date: null,
    is_duration_in_months: false,
    duration_in_months: "",
    // duration: "repeating",
    duration: "once",
  });

  const [planData, setPlanData] = React.useState<PlanData>({
    is_plan: false,
    subscription_plan: {
      plan_id: "",
      name: "",
      trial_alias: "",
    },
  });

  const [formError, setFormError] = React.useState<FormError>({
    code: "",
    amount: "",
    expiry_date: "",
    duration_in_months: "",
    subscription_plan: "",
    currency: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [planList, setPlanList] = React.useState<any>([]);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  React.useEffect(() => {
    if (subscriptionPlanList) {
      let planListData: any = [];
      subscriptionPlanList?.map((plan: any) => {
        planListData.push({
          plan_id: plan.id,
          name: plan.name,
          trial_alias: plan.trial_alias,
        });
      });
      setPlanList(planListData);
    }
  }, [subscriptionPlanList]);

  const handleChangeDate = (value: any) => {
    if (value) {
      setSettingsData({ ...settingsData, expiry_date: value });
    }
  };

  const handleChangeGeneral =
    (prop: keyof GeneralData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setGeneralData({ ...generalData, [prop]: event.target.value });
      }
    };

  const handleChangeSettings =
    (prop: keyof SettingsData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setSettingsData({ ...settingsData, [prop]: event.target.value });
      }
    };

  const handleChangePlanSwitch =
    (prop: keyof PlanData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setPlanData({ ...planData, [prop]: event.target.checked });
        if (prop == "is_plan" && !event.target.checked) {
          setPlanData({
            ...planData,
            [prop]: event.target.checked,
            subscription_plan: {
              plan_id: "",
              name: "",
              trial_alias: "",
            },
          });
          setFormError({
            ...formError,
            subscription_plan: "",
          });
        }
      }
    };

  const handleChangeSwitch =
    (prop: keyof SettingsData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setSettingsData({ ...settingsData, [prop]: event.target.checked });
        if (prop == "is_expiry_date" && !event.target.checked) {
          setSettingsData({
            ...settingsData,
            [prop]: event.target.checked,
            expiry_date: null,
          });
          setFormError({
            ...formError,
            expiry_date: "",
          });
        }

        if (prop == "is_duration_in_months" && !event.target.checked) {
          setSettingsData({
            ...settingsData,
            [prop]: event.target.checked,
            duration_in_months: "",
          });
          setFormError({
            ...formError,
            duration_in_months: "",
          });
        }
      }
    };

  const handleOnChange =
    (name: string) =>
    (event: React.SyntheticEvent<Element, Event>, value: PlanType | null) => {
      event.preventDefault();

      setPlanData({
        ...planData,
        [name]: value,
      });
    };

  const handleOnChangeGeneral =
    (name: string) =>
    (event: React.SyntheticEvent<Element, Event>, value: string | null) => {
      event.preventDefault();

      setGeneralData({
        ...generalData,
        [name]: value ? value : "",
      });
    };

  const handleChangeCheckBox =
    (prop: keyof SettingsData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Old code with monthly settings
      /* setSettingsData({
        ...settingsData,
        [prop]: event.target.checked ? "forever" : "repeating",
        duration_in_months: event.target.checked
          ? ""
          : settingsData.duration_in_months,
      }); */
      setSettingsData({
        ...settingsData,
        [prop]: event.target.checked ? "forever" : "once",
        duration_in_months: "",
      });
    };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let _request = {
      code: generalData.code.trim().toUpperCase(),
      amount:
        generalData.amount_type === AmountType.FIXED_AMOUNT
          ? Number(generalData.amount.trim())
          : 0,
      percent:
        generalData.amount_type === AmountType.PERCENTAGE
          ? Number(generalData.amount.trim())
          : 0,
      amount_type: generalData.amount_type.trim(),
      currency: "usd",
      is_expiry: settingsData.is_expiry_date,
      expiry_date: settingsData.expiry_date
        ? moment(settingsData.expiry_date).unix()
        : null,
      is_duration_in_months: settingsData.is_duration_in_months,
      // duration: settingsData.is_duration_in_months ? settingsData.duration : "",
      duration: settingsData.duration ? settingsData.duration : "",
      // duration_in_months:
      //   settingsData.duration == "repeating"
      //     ? settingsData.duration_in_months.trim()
      //     : "",
      duration_in_months: "",
      is_plan: planData.is_plan,
      plan_id: planData.subscription_plan.plan_id.trim(),
      reference_plan_id: planData.subscription_plan.trial_alias,
    };

    let allError = Validations.validateDiscountForm(_request);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(
        addDiscountCode({
          _request,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            toggleModel();
          },
        })
      );
    }
    setFormError(allError);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleModel}
      variant="temporary"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          scrollBehavior: "smooth",
          my: 2,
        }}
        component="form"
        className="form-element"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box
          sx={{
            mx: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography variant="h6">Add Discount</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleModel}>
                <CloseIcon fontSize={"small"} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mx: 4,
            minWidth: "400px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" sx={{ mx: 2 }}>
            Create a discount code for all user.
          </Typography>

          <Box
            sx={{
              mt: 4,
              mb: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box className="discount-title">
              <Typography variant="subtitle2">General</Typography>
            </Box>

            <Grid container sx={{ px: 2 }}>
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel className="textfield-label" required>
                  Code
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  id="discount_code"
                  name="discount_code"
                  autoComplete="discount_code"
                  placeholder="Discount code"
                  value={generalData.code}
                  onChange={handleChangeGeneral("code")}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  autoFocus
                  error={formError && formError.code ? true : false}
                  helperText={formError && formError.code}
                />
                <Typography
                  variant="body1"
                  sx={{ my: 2, color: "rgba(108,108,132,1)" }}
                >
                  The code your customers will enter during checkout. Uppercase
                  letters and numbers only
                </Typography>
              </Grid>

              <Grid item md={12} sm={12} xs={12} spacing={2}>
                <InputLabel className="textfield-label" required>
                  Amount
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  id="amount"
                  name="amount"
                  autoComplete="amount"
                  type="text"
                  placeholder="Amount"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {generalData.amount_type === AmountType.PERCENTAGE ? (
                          <PercentRoundedIcon fontSize="small" />
                        ) : (
                          <AttachMoneyIcon fontSize="small" />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  value={generalData.amount}
                  onChange={handleChangeGeneral("amount")}
                  autoFocus
                  error={formError && formError.amount ? true : false}
                  helperText={formError && formError.amount}
                />
                <RadioGroup
                  row
                  onChange={handleChangeGeneral("amount_type")}
                  value={generalData.amount_type}
                >
                  <FormControlLabel
                    value={AmountType.PERCENTAGE}
                    control={<Radio />}
                    label="Percentage"
                  />

                  <FormControlLabel
                    value={AmountType.FIXED_AMOUNT}
                    control={<Radio />}
                    label="Fixed amount"
                  />
                </RadioGroup>
              </Grid>

              {/* <Grid item md={12} sm={12} xs={12} spacing={2}>
                                {
                                    generalData.amount_type == AmountType.FIXED_AMOUNT && (
                                        <>
                                            <InputLabel className="textfield-label" required>
                                                Currency
                                            </InputLabel>
                                            <Autocomplete
                                                disablePortal
                                                fullWidth
                                                size='small'
                                                value={generalData.currency ? generalData.currency : null}
                                                onChange={handleOnChangeGeneral("currency")}
                                                autoHighlight
                                                loading
                                                disableClearable={!currency ? true : false}
                                                options={currency ? currency : []}
                                                getOptionLabel={(option) => option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        placeholder='Select currency'
                                                        error={formError && formError.currency ? true : false}
                                                        helperText={formError && formError.currency}
                                                    />
                                                }
                                            />
                                            <Typography variant='body1' sx={{ my: 2, color: "rgba(108,108,132,1)" }}>
                                                Three-letter ISO code for the currency of the Fixed amount.
                                            </Typography>
                                        </>
                                    )
                                }
                            </Grid> */}
            </Grid>

            <Box className="discount-title" sx={{ my: 2 }}>
              <Typography variant="subtitle2">Plan Settings</Typography>
            </Box>

            <Grid
              container
              rowSpacing={4}
              className="form-element"
              sx={{ px: 2 }}
            >
              <Grid item md={12} sm={12} xs={12} columnSpacing={4}>
                <Stack
                  direction={"row"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    Discount applies to specific subscription plan?
                  </Typography>
                  <AntSwitch
                    defaultChecked
                    checked={planData.is_plan}
                    onChange={handleChangePlanSwitch("is_plan")}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Stack>
                {planData.is_plan && (
                  <>
                    <InputLabel className="textfield-label">
                      Select Plan
                    </InputLabel>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      size="small"
                      value={
                        planData.subscription_plan
                          ? planData.subscription_plan
                          : null
                      }
                      onChange={handleOnChange("subscription_plan")}
                      autoHighlight
                      loading
                      disableClearable={!planList ? true : false}
                      options={planList ? planList : []}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.plan_id === value.plan_id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={
                            formError && formError.subscription_plan
                              ? true
                              : false
                          }
                          helperText={formError && formError.subscription_plan}
                        />
                      )}
                    />
                  </>
                )}
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(108,108,132,1)", mt: 2 }}
                >
                  Select which plan(s) the discount applies to.
                  <br />
                  Discounts apply to all plan if left unchecked.
                </Typography>
              </Grid>
            </Grid>

            <Box className="discount-title" sx={{ my: 2 }}>
              <Typography variant="subtitle2">Settings</Typography>
            </Box>

            <Grid
              container
              rowSpacing={4}
              className="form-element"
              sx={{ px: 2 }}
            >
              <Grid item md={12} sm={12} xs={12} columnSpacing={4}>
                <Stack
                  direction={"row"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    Discount has an expiry date?
                  </Typography>
                  <AntSwitch
                    defaultChecked
                    checked={settingsData.is_expiry_date}
                    onChange={handleChangeSwitch("is_expiry_date")}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Stack>
                {settingsData.is_expiry_date && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      minDate={new Date()}
                      showToolbar={false}
                      value={settingsData.expiry_date}
                      onChange={(value: any) => handleChangeDate(value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle clear text"
                              onClick={() =>
                                setSettingsData({
                                  ...settingsData,
                                  expiry_date: null,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          required
                          fullWidth
                          id="expiry_date"
                          placeholder="Expiry date"
                          name="expiry_date"
                          sx={{ my: 1.5 }}
                          error={true}
                          helperText={formError && formError.expiry_date}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(108,108,132,1)" }}
                >
                  Schedule the discount to deactivate in the future.
                </Typography>
              </Grid>
              <Grid item md={12} sm={12} xs={12} columnSpacing={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settingsData.duration == "forever"}
                      onChange={handleChangeCheckBox("duration")}
                      name="duration"
                    />
                  }
                  label="Discount applies forever"
                />
              </Grid>
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                columnSpacing={4}
                sx={{ display: "none" }}
              >
                {/* REMOVED THIS FIELD SECTION AS PER NEW CHANGES */}
                <Stack
                  direction={"row"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    Discount applies every month?
                  </Typography>
                  <AntSwitch
                    defaultChecked
                    checked={settingsData.is_duration_in_months}
                    onChange={handleChangeSwitch("is_duration_in_months")}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Stack>
                {settingsData.is_duration_in_months && (
                  <>
                    <TextField
                      required
                      fullWidth
                      disabled={
                        settingsData.duration == "repeating" ? false : true
                      }
                      id="duration_in_months"
                      name="duration_in_months"
                      type="text"
                      placeholder="Enter months"
                      sx={{ my: 1.5, display: "none" }}
                      value={settingsData.duration_in_months}
                      onChange={handleChangeSettings("duration_in_months")}
                      error={
                        formError && formError.duration_in_months ? true : false
                      }
                      helperText={formError && formError.duration_in_months}
                    />
                  </>
                )}
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(108,108,132,1)" }}
                >
                  Set the months duration of the discount when applied to a
                  subscription plan.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"center"} sx={{ mx: 6, mb: 2 }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading ? true : false}
          >
            Publish Discount
            {loading && <CircularProgress size={20} />}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
