import * as React from 'react';
import { IconButton, Button, Box, Typography, Dialog, DialogTitle, DialogContent, Grid, Avatar, FormHelperText, CircularProgress, Divider } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addUpdateChild } from '../../store/thunk/parentThunk';
import moment from 'moment';
import { ChildData } from '../../store/slices/childSlice';
// interface State {
// 	password: string;
// 	showPassword: boolean;
// }

// interface FormErrorType {
// 	child_name: string,
// 	birth_date: string,
// 	gender: string,
// 	school_name: string,
// }

interface PropType {
	open: boolean,
	onClose: (e: any) => void
}

export default function AccountSettingsModel(props: PropType) {

	const dispatch = useAppDispatch();
	const { childData } = useAppSelector((state) => state.childReducer);
	const { userClient, userUploadClient } = useAppSelector((state) => state.apolloClientReducer);
	const inputFile = React.useRef<HTMLInputElement>(null);

	const initialValues = {
		child_id: "",
		child_name: '',
		child_age: 0,
		birth_date: null,
		school_name: '',
		class_no: 'year 3',
		stage_no: 2,
		gender: '',
		video_allowed_count: 2,
		parent_id: 0,
		profile_image_url: "",
		created_date: "",
		updated_date: "",
		keep_holidays: false
	}

	const [formError, setFormError] = React.useState<any>({
		profile_img: ""
	});
	const [formData, setFormData] = React.useState<any>(initialValues);
	const [profileImg, setProfileImg] = React.useState<any>(null);
	const notificationInfo = useAppSelector((state) => state.notificationReducer);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (notificationInfo) {
			setLoading(false);
		}
	}, [notificationInfo])

	React.useEffect(() => {
		setFormData(childData);
	}, [childData]);

	const handleOnClickImg = () => {
		// `current` points to the mounted file input element
		if (inputFile && inputFile.current) {
			inputFile.current.click();
		}
	};

	const handleChangeFile = (event: any) => {
		var file = event.target.files[0];
		if (file) {
			if (file.size > 1 * 1024 * 1024) {
				
				setFormError({
					...formError,
					profile_img: "The image must be smaller than 1Mb"
				})
				setProfileImg(null);
				return;
			}
			const reader = new FileReader();
			reader.onload = function (e) {
				if (e && e.target) {
					setFormData({ ...formData, profile_image_url: e.target.result ? e.target.result.toString() : "" })
					setFormError({
						...formError,
						profile_img: ""
					})
					// localStorage.setItem("profile_pic",e.target.result ? e.target.result.toString() : "");
				}
			};
			reader.readAsDataURL(file);
			setProfileImg(file ? file : null);
		}
	}

	const handleSubmit = () => {
		const requestData = {
			child_id: formData.child_id?.toString(),
			child_name: formData.child_name,
			birth_date: formData.birth_date ? moment(formData.birth_date).format() : null,
			gender: formData.gender,
			school_name: formData.school_name,
			class_no: childData?.class_no,
			stage_no: childData?.stage_no,
			video_allowed_count: childData?.video_allowed_count,
			past_video_no: childData?.past_video_no,
			curr_video_no: childData?.curr_video_no,
			last_changed_week: childData?.last_changed_week,
			parent_id: childData?.parent_id,
			profile_image_url: formData.profile_image_url ? formData.profile_image_url : childData?.profile_image_url,
			created_date: childData?.created_date,
			updated_date: childData?.updated_date,
			file: profileImg ? profileImg : null,
			keep_holidays: childData?.keep_holidays
		}

		setLoading(true);
		dispatch(addUpdateChild({
			_request: requestData, userUploadClient, userClient, result: (res: any) => {
				if (res.status = "true") {
					dispatch(ChildData(formData));
				}
				props.onClose(null);
			}
		}))

	};

	return (
		<Dialog
			open={props.open}
			fullWidth={true}
			maxWidth={'sm'}
			PaperProps={{
				style: {
					borderRadius: "12px"
				}
			}}>
			<DialogTitle>
				<Typography variant="h6" color={"#ffffff"} sx={{ float: "left" }}>
					Acccount Settings
				</Typography>
				<IconButton
					color="default"
					sx={{ float: "right" }}
					onClick={props.onClose}
					className="ProdcutClose-icon"
					aria-label="close">
					<CloseIcon fontSize="small" />
				</IconButton>

			</DialogTitle>

			<DialogContent>
				<Box
					sx={{
						my: 2,
					}}
					className="form-element">
					<Grid item sm={12} container spacing={5} justifyContent="center">
						<Grid item sm={5} display="flex" direction="column" alignItems={"center"}>
							<Avatar className={"edit-user-avatar"} alt="Nikunj Solanki" src={formData.profile_image_url} />
							<Button onClick={() => handleOnClickImg()} variant="text" size='small' startIcon={<EditIcon fontSize='small' />} sx={{ m: 1 }}>
								Edit
							</Button>
							<input type='file' id='file' accept="image/*" ref={inputFile} onChange={handleChangeFile} style={{ display: 'none' }} />
							{
								formError && formError.profile_img && (
									<FormHelperText error id="classno-error" sx={{ textAlign: "center" }}>
										{formError.profile_img}
									</FormHelperText>
								)
							} 
						</Grid>
						<Grid component={"form"} item sm={7} container spacing={1} direction="column">
							<Grid item>
								{/* <InputLabel className="textfield-label">Full Name</InputLabel> */}
								<Typography
									variant="body2"
									noWrap
									component="div"
									className="Pricing-subtitle"
								>
									Full Name
								</Typography>
								<Typography
									variant="h6"
									color="text.primary"
									gutterBottom
									sx={{ fontSize: "16px" }}
								>
									<strong>{formData.child_name}</strong>
								</Typography>
								<Divider />
								{/* <TextField
									required
									fullWidth
									id="name"
									name="child name"
									value={formData.child_name}
									onChange={handleChange('child_name')}
									autoComplete="child name"
									placeholder="Name"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Person />
											</InputAdornment>
										),
									}}
									error={formError && formError.child_name ? true : false}
									helperText={formError && formError.child_name}
								/> */}
							</Grid>

							<Grid item>
								<Typography
									variant="body2"
									noWrap
									component="div"
									className="Pricing-subtitle"
								>
									Date Of Birth
								</Typography>
								<Typography
									variant="h6"
									color="text.primary"
									gutterBottom
									sx={{ fontSize: "16px" }}
								>
									<strong>{moment(formData.birth_date).format("LL")}</strong>
								</Typography>
								<Divider />
								{/* <LocalizationProvider dateAdapter={AdapterDateFns}>
									<InputLabel className="textfield-label">Date Of Birth</InputLabel>
									<MobileDatePicker
										maxDate={new Date()}
										showToolbar={false}
										value={formData.birth_date}
										onChange={(value) => handldeChangeDate(value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<CalendarToday />
												</InputAdornment>
											),
										}}
										renderInput={(params: any) =>
											<TextField
												required
												fullWidth
												id="birthdate"
												placeholder='birth date'
												name="dob"
												autoFocus
												error={formError && formError.birth_date ? true : false}
												helperText={formError && formError.birth_date}
												{...params} />}
									/>
								</LocalizationProvider> */}
							</Grid>

							<Grid item>
								<Typography
									variant="body2"
									noWrap
									component="div"
									className="Pricing-subtitle"
								>
									Gender
								</Typography>
								<Typography
									variant="h6"
									color="text.primary"
									gutterBottom
									sx={{ fontSize: "16px" }}
								>
									<strong>{formData.gender?.toLocaleUpperCase() || "-"}</strong>
								</Typography>
								<Divider />
								{/* <InputLabel className="textfield-label">Gender</InputLabel>
								<RadioGroup row value={formData.gender || ""} onChange={handleChange('gender')}>
									<FormControlLabel value={genderType.MALE} control={<Radio />} label="Male" />
									<FormControlLabel value={genderType.FEMALE} control={<Radio />} label="Female" />
								</RadioGroup>
								{
									formError && formError.gender && (
										<FormHelperText error id="classno-error">
											{formError.gender}
										</FormHelperText>
									)
								} */}
							</Grid>

							<Grid item>
								<Typography
									variant="body2"
									noWrap
									component="div"
									className="Pricing-subtitle"
								>
									School Name
								</Typography>
								<Typography
									variant="h6"
									color="text.primary"
									gutterBottom
									sx={{ fontSize: "16px" }}
								>
									<strong>{formData.school_name ? formData.school_name : "-"}</strong>
								</Typography>
								<Divider />
								{/* <InputLabel className="textfield-label">School Name</InputLabel>
								<TextField
									required
									fullWidth
									id="name"
									name="name"
									value={formData.school_name}
									onChange={handleChange("school_name")}
									autoComplete="name"
									placeholder="Name"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SchoolRounded />
											</InputAdornment>
										),
									}}
									error={formError && formError.school_name ? true : false}
									helperText={formError && formError.school_name}
								/> */}
							</Grid>

							<Grid item textAlign={"center"} sx={{ mt: 2 }}>
								<Button
									variant='contained'
									onClick={() => { handleSubmit() }}
									disabled={loading ? true : false}
								>
									Save and Close
									{loading && <CircularProgress color={"primary"} size={20} />}
								</Button>
							</Grid>
						</Grid>
					</Grid>

				</Box>

			</DialogContent>

		</Dialog>
	)
}