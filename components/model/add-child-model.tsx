import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Close from "@mui/icons-material/Close";
import Person from "@mui/icons-material/Person";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import QuestionMark from "@mui/icons-material/QuestionMark";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Box } from "@mui/system";
import * as React from "react";
import Validations from "../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../store/store";
import NativeSelect, { SelectChangeEvent } from '@mui/material/Select';
import { addUpdateChild } from "../../store/thunk/parentThunk";
import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { genderType } from "../../pages/parentportal";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { ChildData, ChildListData } from "../../store/slices/childSlice";

interface Props {
    open: boolean,
    onClose: () => void,
    editID: string,
    setUpModel: boolean,
    completeSetupModel: () => void
}

interface FormData {
    child_id: string,
    child_name: string,
    child_age: number,
    birth_date: Date | null,
    gender?: string,
    school_name?: string,
    class_no?: string,
    stage_no?: number,
    video_allowed_count?: number,
    past_video_no?: number,
    curr_video_no?: number,
    last_changed_week?: number,
    parent_id?: number,
    profile_image_url?: string,
    created_date?: string,
    updated_date?: string,
    keep_holidays?: boolean
}

const classArray = [
    "year 3",
    "year 4"
]

const tooltipInfo = "Number of lessons allocated to your child’s dashboard each week. Can be changed at anytime. Your child can also select additional lessons directly in their profile."

const genderTooltipInfo = "This is optional. Please feel free leave blank."

const checkBoxLabel = "Check this box if you want lessons during school holidays."

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

export default function AddChildModel(props: Props) {
    let { open, onClose, editID, setUpModel, completeSetupModel } = props;

    const dispatch = useAppDispatch();
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const { childData } = useAppSelector((state) => state.childReducer);
    const { childListData } = useAppSelector((state) => state.childReducer)
    const { userClient, userUploadClient } = useAppSelector((state) => state.apolloClientReducer);
    const inputFile = React.useRef<HTMLInputElement>(null);

    const formData = {
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

    const [formValues, setFormValues] = React.useState<any>(formData);
    const [formError, setFormError] = React.useState({
        child_id: '',
        child_name: '',
        birth_date: '',
        class_no: '',
        stage_no: '',
        video_allowed_count: '',
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [profileImg, setProfileImg] = React.useState<any>(null);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);
        }
    }, [notificationInfo]);

    // React.useEffect(() => {
    //     if (editID) {
    //         dispatch(getSingleChildInfo({ _request: Number(editID), userClient }));
    //     } else {
    //         setFormValues(formData);
    //     }
    // }, [editID]);

    React.useEffect(() => {
        if (editID && childListData && childListData.length > 0) {
            let childdata = childListData.find(item => item.child_id == editID);
            setFormValues(childdata);
        }
    }, [childListData])

    const handleOnClickImg = () => {
        // `current` points to the mounted file input element
        if (inputFile && inputFile.current) {
            inputFile.current.click();
        }
    };

    const handleChangeFile = (event: any) => {
        var file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (e && e.target) {
                    setFormValues({ ...formValues, profile_image_url: e.target.result ? e.target.result.toString() : "" })
                }
            };
            reader.readAsDataURL(file);
            setProfileImg(file ? file : null);
        }
        // setProfileImg(file ? file : null);

    }

    const handleChange = (prop: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        if (prop == "class_no") {
            let stag_no = classArray.includes(event.target.value) ? 2 : 3
            setFormValues({
                ...formValues,
                "class_no": event.target.value,
                "stage_no": stag_no
            })
        } else {
            setFormValues({ ...formValues, [prop]: event.target.value });
        }
    };

    // const handleChangeCheckbox = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormValues({ ...formValues, [name]: event.target.checked })
    // }

    const handleChangeDate = (value: any) => {
        if (value) {
            setFormValues({ ...formValues, "birth_date": value });
        }
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleAddChild = () => {

        let _request = {
            child_id: String(formValues.child_id),
            child_name: formValues.child_name.trim(),
            school_name: formValues.school_name?.trim(),
            gender: formValues.gender,
            class_no: formValues.class_no,
            stage_no: formValues.stage_no,
            birth_date: formValues.birth_date ? moment(formValues.birth_date).format() : null,
            video_allowed_count: 2,
            keep_holidays: false,
            file: profileImg ? profileImg : null,
        }


        let error: any = Validations.validateAddChildForm(_request);

        if (
            Object.entries(error).length === 0 &&
            error.constructor === Object
        ) {
            setLoading(true);
            dispatch(addUpdateChild({
                _request: _request, userUploadClient, userClient, result: (res: any) => {
                    if (res.status == "true") {
                        if (childListData) {
                            let index = childListData?.findIndex(item => item.child_id == _request.child_id);
                            let arr: any = JSON.parse(JSON.stringify(childListData));
                            arr[index] = formValues;
                            dispatch(ChildListData(arr));
                            dispatch(ChildData(formValues));
                        }

                        if (setUpModel) {
                            completeSetupModel();
                        }
                    }
                    onClose();
                }
            }))
        }

        setFormError(error);
    }

    return (
        <Dialog
            open={open}
            scroll={'paper'}>

            <DialogTitle>
                {editID ? "Edit Student" : "Add Student"}
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Grid container spacing={2} sx={{ position: "relative" }}>
                        <Grid item md={6} sm={6} xs={12} sx={{ pt: 2 }} display="flex" flexDirection="column" alignItems={"center"} justifyContent={"center"}>
                            <Avatar className={"edit-user-profile"} alt="Nikunj Solanki" src={formValues.profile_image_url} />
                            <Button onClick={() => handleOnClickImg()} variant="text" size='small' startIcon={<EditIcon fontSize='small' />} sx={{ m: 1 }}>
                                Edit
                            </Button>
                            <Button disabled className='exit-portal' variant="text" size='small' sx={{ m: 1, border: "1px solid black" }}>
                                Add a Profile Picture Above
                            </Button>
                            <input type='file' id='file' accept="image/*" ref={inputFile} onChange={handleChangeFile} style={{ display: 'none' }} />
                        </Grid>
                        {/* Name && School Name*/}
                        <Grid item md={6} sm={6} xs={12} >
                            <div>
                                <InputLabel className="textfield-label" required>Name</InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    name="child_name"
                                    value={formValues.child_name}
                                    autoComplete="name"
                                    placeholder="Name"
                                    onChange={handleChange('child_name')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoFocus
                                    error={formError && formError.child_name ? true : false}
                                    helperText={formError && formError.child_name}
                                />
                            </div>
                            <div>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <InputLabel className="textfield-label">
                                        School Name
                                    </InputLabel>
                                    <BootstrapTooltip title={genderTooltipInfo} arrow>
                                        <QuestionMark className="helper-icon" />
                                    </BootstrapTooltip>
                                </Box>
                                <TextField
                                    required
                                    fullWidth
                                    id="school_name"
                                    name="school_name"
                                    value={formValues.school_name}
                                    autoComplete="school name"
                                    placeholder="Xyz School"
                                    onChange={handleChange('school_name')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SchoolRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoFocus
                                />
                            </div>
                        </Grid>
                        {/* Date of birth */}
                        <Grid item md={6} sm={6} xs={12}>
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <InputLabel className="textfield-label" required>Date Of Birth</InputLabel>
                                    <MobileDatePicker
                                        openTo="year"
                                        inputFormat="dd/MM/yyyy"
                                        views={['year', 'month', 'day']}
                                        minDate={new Date("01/01/2000")}
                                        maxDate={new Date()}
                                        showToolbar={false}
                                        value={formValues.birth_date}
                                        onChange={(value: any) => handleChangeDate(value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday fontSize='small' />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle clear text"
                                                        onClick={() =>
                                                            setFormValues({
                                                                ...formValues,
                                                                birth_date: null
                                                            })}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        <Close fontSize='small' />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        renderInput={(params: any) =>
                                            <TextField
                                                {...params}
                                                required
                                                fullWidth
                                                id="birth_date"
                                                placeholder='Birth Date'
                                                name="birth_date"
                                                error={formError && formError.birth_date ? true : false}
                                                helperText={formError && formError.birth_date}
                                            />}
                                    />
                                </LocalizationProvider>
                            </div>
                        </Grid>
                        {/* Gender */}
                        <Grid item md={6} sm={6} xs={12}>
                            <div>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <InputLabel className="textfield-label">
                                        Gender
                                    </InputLabel>
                                    <BootstrapTooltip title={genderTooltipInfo} arrow>
                                        <QuestionMark className="helper-icon" />
                                    </BootstrapTooltip>
                                </Box>
                                <RadioGroup row
                                    onChange={handleChange('gender')}
                                    value={formValues.gender}
                                >
                                    <FormControlLabel
                                        value={genderType.MALE}
                                        control={<Radio />}
                                        label="Male" />
                                    <FormControlLabel
                                        value={genderType.FEMALE}
                                        control={<Radio />}
                                        label="Female" />
                                    <FormControlLabel
                                        value={genderType.NA}
                                        control={<Radio />}
                                        label="N/A" />
                                </RadioGroup>
                            </div>
                        </Grid>
                        {/* Class */}
                        <Grid item md={6} sm={6} xs={12}>
                            <div>
                                <InputLabel
                                    disabled={formValues.child_id ? true : false}
                                    className="textfield-label" required={formValues.child_id ? false : true}>
                                    Class
                                </InputLabel>
                                <NativeSelect
                                    className='classname'
                                    fullWidth
                                    disabled={formValues.child_id ? true : false}
                                    value={formValues.class_no}
                                    error={formError && formError.class_no ? true : false}
                                    onChange={handleChange('class_no')}>
                                    <MenuItem value={'year 3'}>Year 3</MenuItem>
                                    <MenuItem value={'year 4'}>Year 4</MenuItem>
                                    <MenuItem value={'year 5'}>Year 5</MenuItem>
                                    <MenuItem value={'year 6'}>Year 6</MenuItem>
                                </NativeSelect>
                                {
                                    formError && formError["class_no"] && (
                                        <FormHelperText error id="classno-error">
                                            {formError.class_no}
                                        </FormHelperText>
                                    )
                                }
                                <FormHelperText sx={{fontSize: "smaller"}}>
                                    Please select correctly. This cannot be changed.
                                </FormHelperText>
                            </div>
                        </Grid>
                        {/* Stage */}
                        <Grid item md={6} sm={6} xs={12}>
                            <div>
                                <InputLabel disabled className="textfield-label">Stage</InputLabel>
                                <NativeSelect
                                    className='stage'
                                    fullWidth
                                    disabled
                                    value={formValues.stage_no}>
                                    <MenuItem value={2}>Stage 2</MenuItem>
                                    <MenuItem value={3}>Stage 3</MenuItem>
                                </NativeSelect>
                            </div>
                        </Grid>

                        {/* <Grid item md={6} sm={6} xs={12}>

                            <div>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <InputLabel className="textfield-label" required>
                                        Lesson Per Week
                                    </InputLabel>
                                    <BootstrapTooltip title={tooltipInfo} arrow>
                                        <QuestionMark className="helper-icon" />
                                    </BootstrapTooltip>
                                </Box>
                                <NativeSelect
                                    className='video-allowed-per-week'
                                    fullWidth
                                    disabled
                                    value={String(formValues.video_allowed_count)}
                                    error={formError && formError.video_allowed_count ? true : false}
                                    onChange={handleChange('video_allowed_count')}
                                >
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                </NativeSelect>
                                {
                                    formError && formError["video_allowed_count"] && (
                                        <FormHelperText error id="video-count-error">
                                            {formError["video_allowed_count"]}
                                        </FormHelperText>
                                    )
                                }
                            </div>

                        </Grid> */}

                        {/* <Grid item md={12} sm={12} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formValues.keep_holidays} onChange={handleChangeCheckbox('keep_holidays')} name="allowinholidays" />
                                }
                                label={checkBoxLabel}
                            />
                        </Grid> */}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    type="button"
                    onClick={handleAddChild}
                    variant="contained"
                    disabled={loading ? true : false}
                >
                    {loading ? (<CircularProgress color={"inherit"} size={20} />) : "Save and Close"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}