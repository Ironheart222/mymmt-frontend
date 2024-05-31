import {
  Lock,
  Email,
  VisibilityOff,
  Visibility,
  Person,
  QuestionMark,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Box } from "@mui/system";
import * as React from "react";
import Validations from "../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  editParentProfile,
  getParentById,
  updatePassword,
} from "../../store/thunk/parentThunk";
import {
  ApolloClientType,
  CountryType,
  StateType,
} from "../../store/Interface";
import { styled } from "@mui/material/styles";

import { countries } from "../../helpers/country-data";
import { states } from "../../helpers/state-data";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import EditEmailModel from "./edit-email-model";
import CountrySearchable from "../searchable-dropdown/country-searchable";
import StateSearchable from "../searchable-dropdown/state-searchable";

interface Props {
  open: boolean;
  onClose: (value: string | null) => void;
  editID: string;
}

interface FormData {
  parent_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_no?: string;
  street_1?: string;
  street_2?: string;
  apartment_no?: string;
  suburb?: string;
  country?: CountryType;
  state?: StateType;
  country_code?: string;
  postal_code?: string;
}

interface PasswordFormData {
  loginPassword?: string;
  parentPassword?: string;
  currParentPassword?: string;
  showLoginPassword?: boolean;
  showParentPassword?: boolean;
  showCurrParenPassword?: boolean;
}

interface FormError {
  parent_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_no?: string;
  street_1?: string;
  street_2?: string;
  apartment_no?: string;
  suburb?: string;
  country?: string;
  state?: string;
  country_code?: string;
  postal_code?: string;
}

interface PasswordError {
  login_password?: string;
  parent_password?: string;
  curr_parent_password?: string;
}

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

const learningPassTooltip =
  "This password allows access to the learning portal";
const parentPassTooltip =
  "This password allows access to the learning portal as well as the parent portal.";
const currParentPassTooltip =
  "You will need to enter your current Parent Portal password to change any passwords";

export default function EditParentProfileModel(props: Props) {
  let { open, onClose, editID } = props;

  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { parentProfileData } = useAppSelector((state) => state.parentReducer);
  const notificationInfo = useAppSelector((state) => state.notificationReducer);

  const [values, setValues] = React.useState<FormData>({
    parent_id: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_no: "",
    street_1: "",
    street_2: "",
    apartment_no: "",
    suburb: "",
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
    // postal_code: ''
  });
  const [passwordForm, setPasswordForm] = React.useState<PasswordFormData>({
    loginPassword: "",
    showLoginPassword: false,
    parentPassword: "",
    showParentPassword: false,
    currParentPassword: "",
    showCurrParenPassword: false,
  });
  const [formError, setFormError] = React.useState<FormError>({});
  const [passwordError, setPasswordError] = React.useState<PasswordError>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resetLoading, setResetLoading] = React.useState<boolean>(false);
  const [stateData, setStateData] = React.useState<StateType[]>([]);
  const [openEditEmailModel, setOpenEditEmailModel] =
    React.useState<boolean>(false);
  const [openCountrySearchable, setOpenCountrySearchable] =
    React.useState<boolean>(false);
  const [openStateSearchable, setOpenStateSearchable] =
    React.useState<boolean>(false);
  const [countryAnchorEl, setCountryAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  React.useEffect(() => {
    dispatch(getParentById({ _request: "", client: userClient }));
  }, [userClient]);

  React.useEffect(() => {
    if (parentProfileData) {
      let countryObj = countries.find(
        (value: any) =>
          value.label.toLowerCase() == parentProfileData.country.toLowerCase()
      );

      let stateObj = states
        .find(
          (value: any) =>
            value.name.toLowerCase() == parentProfileData.country.toLowerCase()
        )
        .states.find(
          (value: any) =>
            value.name.toLowerCase() == parentProfileData.state.toLowerCase()
        );

      let inputData: FormData = {
        parent_id: parentProfileData.parent_id,
        first_name: parentProfileData.first_name,
        last_name: parentProfileData.last_name,
        email: parentProfileData.email,
        mobile_no: parentProfileData.mobile_no,
        street_1: parentProfileData.street_1,
        street_2: parentProfileData.street_2,
        apartment_no: parentProfileData.apartment_no,
        suburb: parentProfileData.suburb,
        country: countryObj
          ? countryObj
          : {
              code: "",
              label: "",
              phone: "",
            },
        state: stateObj,
        country_code: parentProfileData.country_code,
        postal_code: parentProfileData.postal_code,
      };
      setValues({ ...inputData });
    }
  }, [parentProfileData]);

  React.useEffect(() => {
    if (values.country) {
      let selectCountry = states.find(
        (value: any) =>
          value.name.toLowerCase() == values.country?.label.toLowerCase()
      );
      setStateData(selectCountry ? selectCountry.states : []);
    }
  }, [values.country]);

  const toggleEditEmail = () => {
    setOpenEditEmailModel(!openEditEmailModel);
  };

  const handleChange =
    (prop: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChangePasswordForm =
    (prop: keyof PasswordFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm({ ...passwordForm, [prop]: event.target.value });
    };

  const onChangeMobile = (event: any, value: any) => {
    setValues({ ...values, country_code: value.countryCode, mobile_no: event });
  };

  const handleOnChange = (name: string, value: any) => {
    if (name == "country") {
      setValues({
        ...values,
        [name]: value,
        state: {
          id: "",
          latitude: "",
          longitude: "",
          name: "",
          state_code: "",
          type: "",
        },
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleOpenCountry = (event: any) => {
    setOpenCountrySearchable(!openCountrySearchable);
    setCountryAnchorEl(event?.currentTarget || null);
  };

  const handleOpenState = (event: any) => {
    setOpenStateSearchable(!openStateSearchable);
    setStateAnchorEl(event?.currentTarget || null);
  };

  const result = (response: any) => {
    if (response.status === "true") {
      dispatch(getParentById({ _request: "", client: userClient }));
    }
    onClose(null);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleUpdatePassword = () => {
    let _request = {
      new_login_password: passwordForm.loginPassword,
      new_parent_password: passwordForm.parentPassword,
      current_parent_password: passwordForm.currParentPassword,
    };

    let allError = Validations.validatePasswordForm(_request);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setResetLoading(true);
      Promise.resolve(dispatch(updatePassword({ _request, userClient }))).then(
        (res) => {
          setResetLoading(false);
        }
      );
    }
    setPasswordError(allError);
  };

  const handleSubmit = () => {
    let reqParams = {
      parent_id: values.parent_id,
      first_name: values.first_name?.trim(),
      last_name: values.last_name?.trim(),
      email: values.email?.trim(),
      mobile_no: values.mobile_no?.trim(),
      street_1: values.street_1?.trim(),
      street_2: values.street_2?.trim(),
      apartment_no: values.apartment_no?.trim(),
      suburb: values.suburb?.trim(),
      country:
        values.country && Object.keys(values.country).length > 0
          ? values.country.label
          : null,
      state:
        values.state && Object.keys(values.state).length > 0
          ? values.state.name
          : null,
      country_code: values.country_code,
      postal_code: values.postal_code,
    };

    let allError = Validations.validateEditProfileForm(reqParams);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(
        editParentProfile({
          _request: reqParams,
          client: userClient,
          onClose,
          result,
        })
      );
    }
    setFormError(allError);
  };

  return (
    <>
      <Dialog open={open} scroll={"paper"}>
        {openEditEmailModel && (
          <EditEmailModel
            open={openEditEmailModel}
            onClose={toggleEditEmail}
            parent_id={values.parent_id}
          />
        )}

        <DialogTitle>{"Edit Profile"}</DialogTitle>
        <DialogContent>
          <Box>
            <Grid container spacing={2}>
              {/* First name */}
              <Grid item md={6} sm={6} xs={12}>
                <InputLabel className="textfield-label">First Name</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange("first_name")}
                  autoComplete="first name"
                  placeholder="first name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                  error={formError && formError.first_name ? true : false}
                  helperText={formError && formError.first_name}
                />
              </Grid>
              {/* Last name */}
              <Grid item md={6} sm={6} xs={12}>
                <InputLabel className="textfield-label">Last Name</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange("last_name")}
                  autoComplete="last name"
                  placeholder="last name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                  error={formError && formError.last_name ? true : false}
                  helperText={formError && formError.last_name}
                />
              </Grid>
              {/* Email */}
              <Grid item md={6} sm={6} xs={12}>
                <InputLabel className="textfield-label">
                  <Box>
                    Email
                    <a
                      className="change-email-button"
                      onClick={toggleEditEmail}
                    >
                      change email
                    </a>
                  </Box>
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  disabled
                  id="email"
                  name="email"
                  value={values.email}
                  autoComplete="email"
                  placeholder="Enter email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                  error={formError && formError.email ? true : false}
                  helperText={formError && formError.email}
                />
              </Grid>
              {/* Mobile number */}
              <Grid item md={6} sm={6} xs={12}>
                <InputLabel className="textfield-label">
                  Mobile Number
                </InputLabel>
                <PhoneInput
                  value={values.mobile_no}
                  country={values.country_code}
                  containerClass={
                    formError && formError.mobile_no ? "error-number-input" : ""
                  }
                  onChange={(event, val) => onChangeMobile(event, val)}
                  countryCodeEditable={false}
                  enableSearch={true}
                />
                {formError && formError.mobile_no && (
                  <FormHelperText error id="country-error">
                    {formError.mobile_no}
                  </FormHelperText>
                )}
              </Grid>
              {/* Apartment,suite,unit etc.  */} {/* Street name and number  */}
              <Grid item md={6} sm={6} xs={12}>
                <div>
                  <InputLabel className="textfield-label">
                    Apartment,Suite,Unit etc.(if applicable)
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="apartment_no"
                    name="apartment_no"
                    autoComplete="apartment_no"
                    placeholder="Ex. 3rd Floor"
                    value={values.apartment_no}
                    onChange={handleChange("apartment_no")}
                    autoFocus
                  />
                </div>
                <div>
                  <InputLabel className="textfield-label">
                    Street name and number
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="street_1"
                    name="street_1"
                    value={values.street_1}
                    onChange={handleChange("street_1")}
                    placeholder="Ex.123 Main Street"
                    autoFocus
                    // error={formError && formError.street_1 ? true : false}
                    // helperText={formError && formError.street_1}
                  />
                  <TextField
                    required
                    fullWidth
                    sx={{ mt: 2 }}
                    id="street_2"
                    name="street_2"
                    value={values.street_2}
                    onChange={handleChange("street_2")}
                    autoFocus
                    autoComplete="off"
                  />
                </div>
              </Grid>
              {/* reset password grid */}
              <Grid item md={6} sm={6} xs={12}>
                <Box
                  sx={{
                    paddingTop: "16px",
                    height: "100%",
                    mt: "8px",
                    ml: "6px",
                  }}
                >
                  <Grid
                    container
                    sx={{
                      border: "1px solid grey",
                      borderRadius: "0.25rem",
                      p: "2px",
                      height: "inherit",
                    }}
                    spacing={1}
                  >
                    <Grid item md={12} sm={12} xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          required
                          fullWidth
                          placeholder="New learning portal password"
                          type={
                            passwordForm.showLoginPassword ? "text" : "password"
                          }
                          value={passwordForm.loginPassword}
                          autoComplete="new-password"
                          onChange={handleChangePasswordForm("loginPassword")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ ml: "-4px" }}
                              >
                                <Lock fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end" sx={{ m: "-2px" }}>
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setPasswordForm({
                                      ...passwordForm,
                                      showLoginPassword:
                                        !passwordForm.showLoginPassword,
                                    })
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {passwordForm.showLoginPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          autoFocus
                          error={
                            passwordError && passwordError.login_password
                              ? true
                              : false
                          }
                          helperText={
                            passwordError && passwordError.login_password
                          }
                        />
                        <BootstrapTooltip title={learningPassTooltip} arrow>
                          <QuestionMark className="helper-icon" />
                        </BootstrapTooltip>
                      </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          required
                          fullWidth
                          placeholder="New parent portal password"
                          type={
                            passwordForm.showParentPassword
                              ? "text"
                              : "password"
                          }
                          value={passwordForm.parentPassword}
                          onChange={handleChangePasswordForm("parentPassword")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ ml: "-4px" }}
                              >
                                <Lock fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end" sx={{ m: "-2px" }}>
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setPasswordForm({
                                      ...passwordForm,
                                      showParentPassword:
                                        !passwordForm.showParentPassword,
                                    })
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {passwordForm.showParentPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          autoFocus
                          error={
                            passwordError && passwordError.parent_password
                              ? true
                              : false
                          }
                          helperText={
                            passwordError && passwordError.parent_password
                          }
                        />
                        <BootstrapTooltip title={parentPassTooltip} arrow>
                          <QuestionMark className="helper-icon" />
                        </BootstrapTooltip>
                      </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          required
                          fullWidth
                          placeholder="Current parent portal password"
                          type={
                            passwordForm.showCurrParenPassword
                              ? "text"
                              : "password"
                          }
                          value={passwordForm.currParentPassword}
                          onChange={handleChangePasswordForm(
                            "currParentPassword"
                          )}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ ml: "-4px" }}
                              >
                                <Lock fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end" sx={{ m: "-2px" }}>
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setPasswordForm({
                                      ...passwordForm,
                                      showCurrParenPassword:
                                        !passwordForm.showCurrParenPassword,
                                    })
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {passwordForm.showCurrParenPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          autoFocus
                          error={
                            passwordError && passwordError.curr_parent_password
                              ? true
                              : false
                          }
                          helperText={
                            passwordError && passwordError.curr_parent_password
                          }
                        />
                        <BootstrapTooltip title={currParentPassTooltip} arrow>
                          <QuestionMark className="helper-icon" />
                        </BootstrapTooltip>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      xs={12}
                      display="flex"
                      justifyContent={"center"}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        {resetLoading ? (
                          <CircularProgress color={"inherit"} size={20} />
                        ) : (
                          <a
                            className="change-email-button"
                            onClick={handleUpdatePassword}
                          >
                            Reset Password
                          </a>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/* Suburb */} {/* Postal/Zip code */}
              <Grid item md={6} sm={6} xs={12}>
                <div>
                  <InputLabel className="textfield-label">Suburb</InputLabel>
                  <TextField
                    fullWidth
                    id="suburb"
                    name="suburb"
                    autoComplete="suburb"
                    placeholder="Suburb"
                    value={values.suburb}
                    onChange={handleChange("suburb")}
                    autoFocus
                    error={formError && formError.suburb ? true : false}
                    helperText={formError && formError.suburb}
                  />
                </div>
                <div>
                  <InputLabel className="textfield-label">
                    Postal/Zip Code
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="postal_code"
                    name="postal code"
                    placeholder="Postal Code"
                    value={values.postal_code}
                    onChange={handleChange("postal_code")}
                    autoFocus
                    error={formError && formError.postal_code ? true : false}
                    helperText={formError && formError.postal_code}
                  />
                </div>
              </Grid>
              {/* State */} {/* Country */}
              <Grid item md={6} sm={6} xs={12}>
                <div>
                  <InputLabel className="textfield-label" required>
                    State
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="state"
                    name="state"
                    placeholder="State"
                    value={values.state?.name || ""}
                    inputProps={{
                      readOnly: true,
                    }}
                    autoFocus
                    onClick={handleOpenState}
                    error={formError && formError.state ? true : false}
                    helperText={formError && formError.state}
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
                </div>
                <div>
                  <InputLabel className="textfield-label" required>
                    Country
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={values.country?.label || ""}
                    inputProps={{
                      readOnly: true,
                    }}
                    autoFocus
                    onClick={handleOpenCountry}
                    error={formError && formError.country ? true : false}
                    helperText={formError && formError.country}
                  />
                  <CountrySearchable
                    name={"country"}
                    options={countries}
                    open={openCountrySearchable}
                    onClose={handleOpenCountry}
                    anchorEl={countryAnchorEl}
                    handleOnChange={handleOnChange}
                  />
                </div>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Cancel</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="contained"
            disabled={loading ? true : false}
          >
            {loading ? (
              <CircularProgress color={"inherit"} size={20} />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
