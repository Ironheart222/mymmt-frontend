import * as React from 'react';
import { Container, InputAdornment, Button, TextField, CssBaseline, Paper, Box, Grid, FormHelperText, CircularProgress, IconButton, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Lock, Email, Person, VisibilityOff, Visibility, QuestionMark } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../../config/theme_config';
import { InputLabel } from '@mui/material';
import Router, { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../store/store";
import Validations from '../../helpers/validations';
import { registerUser } from '../../store/thunk/userThunk';
import { ApolloClientType, CountryType, StateType } from '../../store/Interface';
import { countries } from '../../helpers/country-data';
import { states } from '../../helpers/state-data';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import RegisterSideBar from '../../components/Register-sidebar';
import { styled } from '@mui/material/styles';
import StateSearchable from '../../components/searchable-dropdown/state-searchable';
import CountrySearchable from '../../components/searchable-dropdown/country-searchable';

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
	first_name?: string,
	last_name?: string,
	email?: string,
	confirm_email?: string,
	mobile_no?: string,
	// street_1?: string,
	// street_2?: string,
	// apartment_no?: string,
	// suburb?: string,
	country?: CountryType,
	state?: StateType,
	// postal_code?: string,
	login_password?: string,
	setting_password?: string,
	country_code?: string,
	refferal_code?: string,
	term_condition?: string
}

const passwordTooltip = "This password allows access to the learning portal"
const parentPasswordTooltip = "This password allows access to the learning portal as well as the account settings area."

export default function SignInSide() {
	const dispatch = useAppDispatch();
	const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);

	const router = useRouter();
	const { refferal_code }: any = router.query;

	React.useEffect(() => {
		if (localStorage.getItem("user_token")) {
			// dispatch(setLoading(true));
			Router.replace('/dashboard');
		}
	}, []);

	const [values, setValues] = React.useState({
		first_name: '',
		last_name: '',
		email: '',
		confirm_email: '',
		mobile_no: '',
		// street_1: '',
		// street_2: '',
		// apartment_no: '',
		// suburb: '',
		country: {
			code: 'AU',
			label: 'Australia',
			phone: '61',
		},
		state: {
			id: "",
			latitude: "",
			longitude: "",
			name: "",
			state_code: "",
			type: ""
		},
		// postal_code: "",
		login_password: '',
		setting_password: '',
		country_code: '',
		refferal_code: '',
		showPassword: false,
		showParentPassword: false,
		term_condition: false,
	});
	const [formError, setFormError] = React.useState<FormData>({});
	const notificationInfo = useAppSelector((state) => state.notificationReducer);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [stateData, setStateData] = React.useState<StateType[]>([]);
	const [openCountrySearchable, setOpenCountrySearchable] = React.useState<boolean>(false);
	const [openStateSearchable, setOpenStateSearchable] = React.useState<boolean>(false);
	const [countryAnchorEl, setCountryAnchorEl] = React.useState<null | HTMLElement>(null);
	const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(null);

	React.useEffect(() => {
		if (refferal_code) {
			setValues({ ...values, refferal_code: refferal_code });
		}
	}, [refferal_code])

	React.useEffect(() => {
		if (values.country) {
			let selectCountry = states.find((value: any) => value.name.toLowerCase() == values.country.label.toLowerCase());
			setStateData(selectCountry ? selectCountry.states : []);
		}
		setValues({
			...values,
			state: {
				id: "",
				latitude: "",
				longitude: "",
				name: "",
				state_code: "",
				type: ""
			}
		});
	}, [values.country])

	React.useEffect(() => {
		if (notificationInfo) {
			setLoading(false)
		}
	}, [notificationInfo]);

	const handleChange = (prop: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (prop == "term_condition") {
			setValues({ ...values, [prop]: event.target.checked });
		} else {
			setValues({ ...values, [prop]: event.target.value });
		}
	};

	const onChangeMobile = (event: any, value: any) => {
		let countryObj = countries.find(val => val.label === value.name);
		setValues({
			...values,
			"country": countryObj && Object.keys(countryObj).length > 0 ? countryObj : values.country,
			"country_code": value.countryCode,
			"mobile_no": event
		});
	}

	const handleOnChange = (name: string, value: any) => {
		setValues({
			...values,
			[name]: value
		})
	}

	const handleRedirection = () => {
		Router.replace("/login");
	}

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleOpenCountry = (event: any) => {
		setOpenCountrySearchable(!openCountrySearchable);
		setCountryAnchorEl(event?.currentTarget || null);
	}

	const handleOpenState = (event: any) => {
		setOpenStateSearchable(!openStateSearchable);
		setStateAnchorEl(event?.currentTarget || null);
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let reqParams = {
			first_name: values.first_name.trim(),
			last_name: values.last_name.trim(),
			email: values.email.trim(),
			confirm_email: values.confirm_email.trim(),
			mobile_no: values.mobile_no.trim(),
			// street_1: values.street_1.trim(),
			// street_2: values.street_2.trim(),
			// apartment_no: values.apartment_no.trim() ? values.apartment_no.trim() : null,
			// suburb: values.suburb.trim(),
			country: values.country && Object.keys(values.country).length > 0 ? values.country.label : null,
			state: values.state && Object.keys(values.state).length > 0 ? values.state.name : null,
			// postal_code: values.postal_code.trim(),
			login_password: values.login_password.trim(),
			setting_password: values.setting_password.trim(),
			refferral_code: values.refferal_code.trim(),
			country_code: values.country_code,
			term_condition: values.term_condition
		}
		
		let allError = Validations.validateRegisterForm(reqParams);;
		
		if (
			Object.entries(allError).length === 0 &&
			allError.constructor === Object
		) {
			setLoading(true);
			dispatch(registerUser({ _request: reqParams, userClient }));
		}
		setFormError(allError);

	};


	return (
		<ThemeProvider theme={mdTheme}>
			<Grid container component="main" sx={{ height: '100vh' }}>
				<CssBaseline />
				<RegisterSideBar />
				<Grid item xs={12} sm={12} md={6} component={Paper} className="login-form-container" elevation={6} square>
					<Box
						sx={{
							my: 4,
							mx: 2,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Container className="register-container" >
							<Typography component="h1" variant="h5" className="header-title">
								Create New Account
							</Typography>
							{/* <Typography component="p" className="header-text">
								Welcome! Create Account With Your Data And Get Instant Access To 1,000+ Maths Videos And Lesson
							</Typography> */}
							<Box component="form" className="form-element" noValidate onSubmit={handleSubmit} >
								{/* First Name */}
								<Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>First Name</InputLabel>
										<TextField
											required
											fullWidth
											value={values.first_name}
											onChange={handleChange('first_name')}
											autoComplete="first_name"
											placeholder="Enter your first name"
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
								</Grid>
								{/* Last Name */}
								<Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>Last Name</InputLabel>
										<TextField
											required
											fullWidth
											value={values.last_name}
											onChange={handleChange('last_name')}
											autoComplete="last_name"
											placeholder="Enter your last name"
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
								</Grid>
								{/* Mobile/Cell/Phone Number AND Email Address && Confirm Email */}
								<Grid container spacing={1}>
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>
											Mobile/Cell/Phone Number
										</InputLabel>
										<PhoneInput
											value={values.mobile_no}
											country={'au'}
											containerClass={formError && formError.mobile_no ? "error-number-input" : ""}
											onChange={(event, val) => onChangeMobile(event, val)}
											countryCodeEditable={false}
											enableSearch={true}
										/>
										{
											formError && formError.mobile_no && (
												<FormHelperText sx={{ ml: 2 }} error id="country-error">
													{formError.mobile_no}
												</FormHelperText>
											)
										}
									</Grid>
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>
											Email Address(please ensure this is correct)
										</InputLabel>
										<TextField
											required
											fullWidth
											type="email"
											name='email'
											value={values.email}
											onChange={handleChange('email')}
											autoComplete="none"
											placeholder="Email address"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Email />
													</InputAdornment>
												),
											}}
											autoFocus
											error={formError && (formError.email || formError.confirm_email) ? true : false}
											helperText={formError && formError.email}
										/>
									</Grid>
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>
											Confirm email
										</InputLabel>
										<TextField
											required
											fullWidth
											type="email"
											name='confirm email'
											value={values.confirm_email}
											onChange={handleChange('confirm_email')}
											autoComplete="none"
											placeholder="Confirm email address"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Email />
													</InputAdornment>
												),
											}}
											autoFocus
											error={formError && formError.confirm_email ? true : false}
											helperText={formError && formError.confirm_email}
										/>
									</Grid>
								</Grid>
								{/* Apartment,Suite,Unit, etc. */}
								{/* <Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label">
											Apartment,Suite,Unit, etc.(if applicable)
										</InputLabel>
										<TextField
											fullWidth
											id="apartment_no"
											name="apartment_no"
											placeholder="Ex. 3rd Floor"
											value={values.apartment_no}
											onChange={handleChange('apartment_no')}
											autoFocus
										// error={formError && formError.apartment_no ? true : false}
										// helperText={formError && formError.apartment_no}
										/>
									</Grid>
								</Grid> */}
								{/* Street Name and Number */}
								{/* <Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>Street name and number</InputLabel>
										<TextField
											required
											fullWidth
											id="street_1"
											name="street 1"
											placeholder="Ex.123 Main Street"
											value={values.street_1}
											onChange={handleChange('street_1')}
											autoFocus
											error={formError && formError.street_1 ? true : false}
											helperText={formError && formError.street_1}
										/>
										<TextField
											required
											fullWidth
											sx={{ mt: 2 }}
											id="street 2"
											name="street 2"
											value={values.street_2}
											onChange={handleChange('street_2')}
											autoFocus
										/>
									</Grid>
								</Grid> */}
								{/* Suburb */}
								{/* <Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>Suburb</InputLabel>
										<TextField
											required
											fullWidth
											id="suburb"
											name="suburb"
											placeholder="Suburb"
											value={values.suburb}
											onChange={handleChange('suburb')}
											autoFocus
											error={formError && formError.suburb ? true : false}
											helperText={formError && formError.suburb}
										/>
									</Grid>
								</Grid> */}
								{/* Country AND State */}
								<Grid container spacing={1}>
									<Grid item md={6} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>Country</InputLabel>
										<TextField
											required
											fullWidth
											id="country"
											name="country"
											placeholder="Country"
											value={values.country?.label || ""}
											inputProps={{
												readOnly: true
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
											handleOnChange={handleOnChange} />
										{/* <Autocomplete
											options={countries}
											size='small'
											className='country-state-selector'
											fullWidth
											value={values.country ? values.country : null}
											getOptionLabel={(option) => option.label}
											onChange={handleOnChange('country')}
											isOptionEqualToValue={(option, value) => option?.code === value?.code}
											renderOption={(props, option) => (
												<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
													<img
														loading="lazy"
														width="20"
														src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
														srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
														alt=""
													/>
													{option.label} ({option.code}) +{option.phone}
												</Box>
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													inputProps={{
														...params.inputProps,
													}}
													error={formError && formError.country ? true : false}
													helperText={formError && formError.country}
												/>
											)}
										/> */}
									</Grid>
									<Grid item md={6} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>State</InputLabel>
										<TextField
											required
											fullWidth
											id="state"
											name="state"
											placeholder="State"
											value={values.state?.name || ""}
											inputProps={{
												readOnly: true
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
											handleOnChange={handleOnChange} />
										{/* <Autocomplete
											options={stateData}
											size='small'
											className='country-state-selector'
											fullWidth
											value={values.state ? values.state : null}
											getOptionLabel={(option) => option.name}
											onChange={handleOnChange('state')}
											isOptionEqualToValue={(option, value) => option?.id === value?.id}
											renderOption={(props, option) => (
												<Box component="li" {...props}>
													({option.state_code}) {option.name}
												</Box>
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													inputProps={{
														...params.inputProps,
													}}
													autoComplete="none"
													name="state"
													error={formError && formError.state ? true : false}
													helperText={formError && formError.state}
												/>
											)}
										/> */}
									</Grid>
								</Grid>
								{/* Postal/Zip Code */}
								{/* <Grid container spacing={1} >
									<Grid item md={6} sm={12} xs={12}>
										<InputLabel className="textfield-label" required>
											Postal/Zip Code
										</InputLabel>
										<TextField
											required
											fullWidth
											id="postal_code"
											name="postal code"
											placeholder="Postal Code"
											value={values.postal_code}
											onChange={handleChange('postal_code')}
											autoFocus
											error={formError && formError.postal_code ? true : false}
											helperText={formError && formError.postal_code}
										/>
									</Grid>
								</Grid> */}
								{/* Student Password AND Parent Portal Password */}
								<Grid container spacing={1}>
									<Grid item md={6} sm={12} xs={12}>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<InputLabel className="textfield-label" required>
												Student Password
											</InputLabel>
											<BootstrapTooltip title={passwordTooltip} arrow>
												<QuestionMark className="helper-icon" />
											</BootstrapTooltip>
										</Box>
										<TextField
											required
											fullWidth
											// name="login_password"
											placeholder="Enter Password"
											// id="login_password"
											type={values.showPassword ? 'text' : 'password'}
											value={values.login_password}
											onChange={handleChange('login_password')}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Lock />
													</InputAdornment>
												),
												endAdornment: (
													< InputAdornment position="end" >
														<IconButton
															aria-label="toggle password visibility"
															onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
															onMouseDown={handleMouseDownPassword}
															edge="end"
														>
															{values.showPassword ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												)
											}}
											autoFocus
											error={formError && formError.login_password ? true : false}
											helperText={formError && formError.login_password}
										/>
									</Grid>
									<Grid item md={6} sm={12} xs={12}>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<InputLabel className="textfield-label" required>
												Parent Portal Password
											</InputLabel>
											<BootstrapTooltip title={parentPasswordTooltip} arrow>
												<QuestionMark className="helper-icon" />
											</BootstrapTooltip>
										</Box>
										<TextField
											required
											fullWidth
											// name="setting_password"
											placeholder="Enter Setting Password"
											type={values.showParentPassword ? 'text' : 'password'}
											// id="setting_password"
											value={values.setting_password}
											onChange={handleChange('setting_password')}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Lock />
													</InputAdornment>
												),
												endAdornment: (
													< InputAdornment position="end" >
														<IconButton
															aria-label="toggle password visibility"
															onClick={() => setValues({ ...values, showParentPassword: !values.showParentPassword })}
															onMouseDown={handleMouseDownPassword}
															edge="end"
														>
															{values.showParentPassword ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												)
											}}

											autoFocus
											error={formError && formError.setting_password ? true : false}
											helperText={formError && formError.setting_password}
										/>
									</Grid>
								</Grid>
								{/* Refferal Code */}
								<Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<InputLabel className="textfield-label">Referral Code</InputLabel>
										<TextField
											required
											fullWidth
											id="referral_code"
											name="referral code"
											autoComplete="referral code"
											placeholder="Ex. ZDX23G2E"
											value={values.refferal_code}
											onChange={handleChange('refferal_code')}
											autoFocus
										// error={formError && formError.address ? true : false}
										// helperText={formError && formError.address}
										/>
									</Grid>
								</Grid>
								{/* Terma AND Condition */}
								<Grid container spacing={1}>
									<Grid item md={12} sm={12} xs={12} sx={{ mt: 2 }}>
										<FormControlLabel
											control={
												<Checkbox checked={values.term_condition} onChange={handleChange('term_condition')} name="termandcondition" />
											}
											label="By checking this box you agree to the Privacy Policy and Terms and Conditions of My5MT.com"
										/>
										{
											formError && formError.term_condition && (
												<FormHelperText error id="country-error">
													{formError.term_condition}
												</FormHelperText>
											)
										}
									</Grid>
								</Grid>

								<Grid container spacing={1} >
									<Grid item md={12} sm={12} xs={12}>
										<Button
											type="submit"
											fullWidth
											variant="contained"
											sx={{ mt: 2, pt: 1, pb: 1 }}
											disabled={loading ? true : false}
										>
											Create New Account
											{loading && <CircularProgress color={"primary"} size={20} />}
										</Button>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item xs>
									</Grid>
									<Grid item sx={{ mt: 1, cursor: "pointer" }} onClick={handleRedirection}>
										<Typography component="span" variant="caption" >Already a Member? </Typography>
										<Typography component="span" variant="caption" className="register-link">
											{"Login here"}
										</Typography>
									</Grid>
								</Grid>
							</Box>
						</Container>
					</Box>
				</Grid>
			</Grid >
		</ThemeProvider >
	);
}