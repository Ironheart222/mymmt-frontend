import * as React from 'react';
import { IconButton, InputAdornment, Button, Box, Typography, InputLabel, Dialog, DialogTitle, DialogContent, Grid, TextField, SelectChangeEvent, FormHelperText, OutlinedInput, CircularProgress, MenuItem, Autocomplete } from '@mui/material';
import NativeSelect from '@mui/material/Select';
import { LocationOn, Person } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import { ApolloClientType, ParentParam, StateType } from '../../../store/Interface';
import Validations from '../../../helpers/validations';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { Email } from '@mui/icons-material';
import { editParentProfile, getParentById } from '../../../store/thunk/parentThunk';
import { getParentList } from '../../../store/thunk/admin/adminAuthThunk';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { countries } from '../../../helpers/country-data';
import { states } from '../../../helpers/state-data';
import StateSearchable from '../../searchable-dropdown/state-searchable';
import CountrySearchable from '../../searchable-dropdown/country-searchable';

interface State {
    name: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    showOldPassword: boolean;
    showNewPassword: boolean;
}

interface FormValidation {
    name: string,
    email: string,
    old_password: string,
    new_password: string,
}

interface PropType {
    open: boolean,
    onClose: (event: any) => void,
    editId: string
}

export default function EditParentModel(props: PropType) {

    let { open, onClose, editId } = props;

    const dispatch = useAppDispatch();
    const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
    const { parentProfileData } = useAppSelector((state) => state.parentReducer);
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [stateData, setStateData] = React.useState<StateType[]>([]);
    const [openCountrySearchable, setOpenCountrySearchable] = React.useState<boolean>(false);
    const [openStateSearchable, setOpenStateSearchable] = React.useState<boolean>(false);
    const [countryAnchorEl, setCountryAnchorEl] = React.useState<null | HTMLElement>(null);
    const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(null);

    const [values, setValues] = React.useState<any>({
        parent_id: '',
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        street_1: '',
        street_2: '',
        apartment_no: '',
        suburb: '',
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
        country_code: '',
        postal_code: ''
    });
    const [formError, setFormError] = React.useState<Partial<ParentParam>>({});

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);

        }
    }, [notificationInfo]);

    React.useEffect(() => {
        if (editId) {
            dispatch(getParentById({ _request: editId, client: adminClient }))
        }
    }, [editId]);

    React.useEffect(() => {
        if (parentProfileData) {
            let countryObj = countries.find((value: any) => value.label.toLowerCase() == parentProfileData.country.toLowerCase());

            let stateObj = states.find((value: any) => value.name.toLowerCase() == parentProfileData.country.toLowerCase()).states.find((value: any) => value.name.toLowerCase() == parentProfileData.state.toLowerCase());

            let inputData: any = {
                parent_id: parentProfileData.parent_id,
                first_name: parentProfileData.first_name,
                last_name: parentProfileData.last_name,
                email: parentProfileData.email,
                mobile_no: parentProfileData.mobile_no,
                street_1: parentProfileData.street_1,
                street_2: parentProfileData.street_2,
                apartment_no: parentProfileData.apartment_no,
                suburb: parentProfileData.suburb,
                country: countryObj ? countryObj : {
                    code: "",
                    label: "",
                    phone: "",
                },
                state: stateObj,
                country_code: parentProfileData.country_code,
                postal_code: parentProfileData.postal_code
            }
            setValues(inputData);
        }
    }, [parentProfileData]);

    React.useEffect(() => {
        if (values.country) {
            let selectCountry = states.find((value: any) =>
                value.name.toLowerCase() == values.country?.label.toLowerCase()
            );
            setStateData(selectCountry ? selectCountry.states : []);
        }
    }, [values.country])

    const handleChange = (prop: keyof ParentParam) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSelectChange = (prop: keyof ParentParam) => (event: any) => {
        setValues({ ...values, [prop]: event.target.value });
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
                    type: ""
                }
            })
        } else {
            setValues({
                ...values,
                [name]: value,
            })
        }
    }

    const handleOpenCountry = (event: any) => {
        setOpenCountrySearchable(!openCountrySearchable);
        setCountryAnchorEl(event?.currentTarget || null);
    }

    const handleOpenState = (event: any) => {
        setOpenStateSearchable(!openStateSearchable);
        setStateAnchorEl(event?.currentTarget || null);
    }

    const onChangeMobile = (event: any, value: any) => {
        setValues({ ...values, "country_code": value.countryCode, "mobile_no": event });
    }

    const result = (response: any) => {
        if (response.status === "true") {
            dispatch(getParentList(adminClient));
        }
        onClose(null);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let _request = {
            parent_id: values.parent_id,
            first_name: values.first_name?.trim(),
            last_name: values.last_name?.trim(),
            email: values.email?.trim(),
            mobile_no: values.mobile_no?.trim(),
            street_1: values.street_1?.trim(),
            street_2: values.street_2?.trim(),
            apartment_no: values.apartment_no?.trim(),
            suburb: values.suburb?.trim(),
            country: values.country && Object.keys(values.country).length > 0 ? values.country.label : null,
            state: values.state && Object.keys(values.state).length > 0 ? values.state.name : null,
            country_code: values.country_code,
            postal_code: values.postal_code
        }

        let allError = Validations.validateEditProfileForm(_request);
        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            setLoading(true);
            dispatch(editParentProfile({ _request, client: adminClient, result }));
        }
        setFormError(allError);

    };

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'sm'}
            PaperProps={{
                style: {
                    borderRadius: "10px"
                }
            }}>
            <DialogTitle>
                <Typography component="p" variant="h6" sx={{ float: "left" }}>
                    Edit Profile
                </Typography>
                <IconButton
                    color="default"
                    sx={{ float: "right" }}
                    onClick={onClose}
                    aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>

            </DialogTitle>

            <DialogContent>
                <Box className="form-element">
                    <Grid component={"form"} noValidate onSubmit={handleSubmit} container spacing={1} direction="column">
                        {/* First Name */}
                        <Grid item md={6} sm={6} xs={12} >
                            <InputLabel className="textfield-label" required>
                                First Name
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="first_name"
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange('first_name')}
                                autoComplete="first name"
                                placeholder="First name"
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
                        {/* Last Name */}
                        <Grid item md={6} sm={6} xs={12} >
                            <InputLabel className="textfield-label" required>
                                Last Name
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="last_name"
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange('last_name')}
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
                        <Grid item md={6} sm={6} xs={12}  >
                            <InputLabel className="textfield-label" required>
                                Email
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
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
                        {/* Mobile Number */}
                        <Grid item md={6} sm={6} xs={12} >
                            <InputLabel className="textfield-label" required>Mobile Number</InputLabel>
                            <PhoneInput
                                value={values.mobile_no}
                                country={values.country_code}
                                containerClass={formError && formError.mobile_no ? "error-number-input" : ""}
                                onChange={(event, val) => onChangeMobile(event, val)}
                                countryCodeEditable={false}
                                enableSearch={true}
                            />
                            {
                                formError && formError.mobile_no && (
                                    <FormHelperText error id="country-error">
                                        {formError.mobile_no}
                                    </FormHelperText>
                                )
                            }
                        </Grid>
                        {/* Apartment, Suite, Unit, etc. */}
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel className="textfield-label" required>Apartment,Suite,Unit, etc.</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="apartment_no"
                                name="apartment_no"
                                autoComplete="apartment_no"
                                placeholder="Ex. 3rd Floor"
                                value={values.apartment_no}
                                onChange={handleChange('apartment_no')}
                                autoFocus
                                error={formError && formError.apartment_no ? true : false}
                                helperText={formError && formError.apartment_no}
                            />
                        </Grid>
                        {/* Street Name And Number */}
                        <Grid item md={6} sm={6} xs={12} >
                            <InputLabel className="textfield-label" required>Street name and number </InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="street_1"
                                name="street_1"
                                value={values.street_1}
                                onChange={handleChange('street_1')}
                                placeholder="Ex.123 Main Street"
                                autoFocus
                                error={formError && formError.street_1 ? true : false}
                                helperText={formError && formError.street_1}
                            />
                            <TextField
                                required
                                fullWidth
                                sx={{ mt: 2 }}
                                id="street_2"
                                name="street_2"
                                value={values.street_2}
                                onChange={handleChange('street_2')}
                                autoFocus
                                error={formError && formError.street_2 ? true : false}
                                helperText={formError && formError.street_2}
                            />
                        </Grid>
                        {/* Suburb */}
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel className="textfield-label" required>Suburb</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="suburb"
                                name="suburb"
                                autoComplete="suburb"
                                placeholder="Suburb"
                                value={values.suburb}
                                onChange={handleChange('suburb')}
                                autoFocus
                                error={formError && formError.suburb ? true : false}
                                helperText={formError && formError.suburb}
                            />
                        </Grid>
                        {/* Postal/Zip Code  */}
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
                        {/* State */}
                        <Grid item md={6} sm={6} xs={12} >
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

                        </Grid>
                        {/* Country */}
                        <Grid item md={6} sm={6} xs={12} >
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
                        </Grid>
                        <Grid item textAlign={"end"} sx={{ mt: 1 }}>
                            <Button variant='contained' type='submit'
                                disabled={loading ? true : false}>
                                SAVE
                                {loading && <CircularProgress color={"inherit"} size={20} />}
                            </Button>
                        </Grid>
                    </Grid>

                </Box>

            </DialogContent>

        </Dialog>
    )
}