import * as React from 'react';
import { OutlinedInput, IconButton, SwipeableDrawer, InputAdornment, Button, Box, Typography, InputLabel, FormHelperText, CircularProgress, Backdrop, Drawer } from '@mui/material';
import { Lock, VisibilityOff, Visibility } from '@mui/icons-material';
import Router from "next/router";
import Validations from '../../helpers/validations';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { parentAuthentication } from '../../store/thunk/parentThunk';
import { ApolloClientType } from '../../store/Interface';
import { ParentAuthData } from '../../store/slices/parentSlice';
import CloseIcon from "@mui/icons-material/Close";
import ParentForgotPassword from './parent-forgot-password';
import { logout } from '../../store/slices/userSlice';

interface State {
	password: string;
	showPassword?: boolean;
}

interface passwordValidation {
	password?: string | undefined;
}

export default function ParentSettingsModel(props: any) {
	const { onClose, onOpen, open, toggleWelcomeModel } = props

	const dispatch = useAppDispatch();
	const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)
	const notificationInfo = useAppSelector((state) => state.notificationReducer);
	const { parentAuthData } = useAppSelector((state) => state.parentReducer);
	const [loading, setLoading] = React.useState<boolean>(false);

	const [values, setValues] = React.useState({
		password: '',
		showPassword: false,
	});
	const [passwordError, setPasswordError] = React.useState<passwordValidation>();
	const [openForgotModel, setOpenForgotModel] = React.useState<boolean>(false);

	let childId = localStorage.getItem("child_id");
	let isChild = localStorage.getItem("is_child");

	React.useEffect(() => {
		if (parentAuthData && Object.keys(parentAuthData).length) {
			onClose();
			setLoading(false);
			dispatch(ParentAuthData({}));
		}
	}, [parentAuthData])

	React.useEffect(() => {
		if (notificationInfo) {
			setLoading(false);
		}
	}, [notificationInfo])

	const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleClose = () => {
		if (isChild == "true") {
			Router.replace("/select-profile");
		} else {
			toggleWelcomeModel();
		}
	}

	const toggleForgotPassword = () => {
		setOpenForgotModel(!openForgotModel);
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let reqParams: State = {
			password: values.password.trim()
		}
		let allError = Validations.validateParentAuthForm(reqParams);
		if (
			Object.entries(allError).length === 0 &&
			allError.constructor === Object
		) {
			setLoading(true);
			dispatch(parentAuthentication({ _request: reqParams, userClient, result: (res: any) => {
				if (res.status == "false") {
					setPasswordError({
						password: res.message
					})
					setLoading(false);
				}
			} }));
		}
		setPasswordError(allError);
	}

	return (
		<>
			<ParentForgotPassword
				open={openForgotModel}
				onClose={toggleForgotPassword} />
			<Drawer
				anchor="right"
				open={open}
				onClose={onClose}
			// onOpen={onOpen}
			>
				<div>
					<IconButton sx={{ float: "right", mt: 3, mx: 3 }} onClick={handleClose}>
						<CloseIcon fontSize={"small"} />
					</IconButton>
				</div>

				<Box
					maxWidth={"xs"}
					sx={{
						my: 4,
						mx: 4,
						maxWidth: "400px",
						display: 'flex',
						flexDirection: 'column',
					}}>

					<Typography component="h1" variant="h6" className="header-subtext">
						{/* Are you a Parents? */}
						Please enter your parental access password to enter the Parent Portal.
					</Typography>
					{/* <Typography component="p" className="header-text">
						Password to enter the parents only area.
					</Typography> */}
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
						<InputLabel className="textfield-label">Password</InputLabel>
						<OutlinedInput
							required
							fullWidth
							placeholder='Password'
							type={values.showPassword ? 'text' : 'password'}
							value={values.password}
							onChange={handleChange('password')}
							startAdornment={
								<InputAdornment position="start">
									<Lock />
								</InputAdornment>
							}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{values.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							error={passwordError && passwordError.password ? true : false}
						/>
						{
							passwordError && passwordError.password && (
								<FormHelperText error id="password-error">
									{passwordError.password}
								</FormHelperText>
							)
						}
						<Box textAlign={"end"} sx={{ mt: 1 }}>
							<Typography onClick={toggleForgotPassword} component="span" variant="caption" className='forgot-password-link'>
								{"Forgot Password?"}
							</Typography>
						</Box>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							// onClick={(event: any) => handleSubmit(event)}
							sx={{ mb: 2, pt: 1, pb: 1, mt: 4 }}
							disabled={loading ? true : false}
						>
							Access Parents Settings
							{loading && <CircularProgress color={"primary"} size={20} />}
						</Button>
					</Box>
				</Box>

			</Drawer>

		</>
	)
}