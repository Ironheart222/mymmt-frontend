import * as React from 'react';
import { IconButton, InputAdornment, Button, Box, Typography, InputLabel, Dialog, DialogTitle, DialogContent, Grid, TextField, SelectChangeEvent, FormHelperText, OutlinedInput, CircularProgress } from '@mui/material';
import { Person } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import { ApolloClientType } from '../../../store/Interface';
import Validations from '../../../helpers/validations';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { Lock, Email, VisibilityOff, Visibility } from '@mui/icons-material';
import { updateAdminDetail } from '../../../store/thunk/admin/adminAuthThunk';

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
    onClose: (event: any) => void
}

export default function EditProfile(props: PropType) {

    let { open, onClose } = props;

    const dispatch = useAppDispatch();
    const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
    const { adminProfileData, updateAdminData } = useAppSelector((state) => state.adminReducer);
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);
        }
    }, [notificationInfo])

    const [formData, setFormData] = React.useState<State>({
        name: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        showOldPassword: false,
        showNewPassword: false  
    });
    const [formError, setFormError] = React.useState<Partial<FormValidation>>();

    React.useEffect(()=>{
        if (adminProfileData) {
            setFormData({
                ...formData,
                name: adminProfileData.name,
                email: adminProfileData.email
            });
        }
    },[adminProfileData]);

    const handleChange = (prop: keyof State) => (event: | SelectChangeEvent<string>
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        setFormData({
            ...formData,
            [prop]: event.target.value
        })
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = () => {
        const requestData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            old_password: formData.oldPassword,
            new_password: formData.newPassword
        }

        let error: Partial<FormValidation> = Validations.validateAdminEditForm(requestData);
        
        if (
            Object.entries(error).length === 0 &&
            error.constructor === Object
        ) {
            setLoading(true);
            dispatch(updateAdminDetail({_request: requestData,adminClient,props}))
            
        }
        setFormError(error);

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
                <Typography variant="h6" sx={{ float: "left" }}>
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
                    <Grid component={"form"} container spacing={1} direction="column">
                        <Grid item>
                            <InputLabel className="textfield-label">Full Name</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                name="child name"
                                value={formData.name}
                                onChange={handleChange('name')}
                                autoComplete="child name"
                                placeholder="Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                                error={formError && formError.name ? true : false}
                                helperText={formError && formError.name}
                            />
                        </Grid>

                        <Grid item>
                            <InputLabel className="textfield-label">Email Address</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                autoComplete="email"
                                placeholder="Email address"
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

                        <Grid item>
                            <InputLabel className="textfield-label">Old Password</InputLabel>
                            <OutlinedInput
                                required
                                fullWidth
                                type={formData.showOldPassword ? 'text' : 'password'}
                                placeholder="Old Password"
                                value={formData.oldPassword}
                                onChange={handleChange('oldPassword')}
                                error={formError && formError.old_password ? true : false}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton edge="start">
                                            <Lock />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setFormData({ ...formData, showOldPassword: !formData.showOldPassword})}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {formData.showOldPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {
                                formError && formError.old_password && (
                                    <FormHelperText error id="password-error">
                                        {formError.old_password}
                                    </FormHelperText>
                                )
                            }
                        </Grid>

                        <Grid item>
                            <InputLabel className="textfield-label">New Password</InputLabel>
                            <OutlinedInput
                                required
                                fullWidth
                                type={formData.showNewPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange('newPassword')}
                                error={formError && formError.new_password ? true : false}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton edge="start">
                                            <Lock />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setFormData({ ...formData, showNewPassword: !formData.showNewPassword})}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            { formData.showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {
                                formError && formError.new_password && (
                                    <FormHelperText error id="password-error">
                                        {formError.new_password}
                                    </FormHelperText>
                                )
                            }
                        </Grid>

                        <Grid item textAlign={"end"} sx={{ mt: 1 }}>
                            <Button variant='contained' onClick={() => {
                                handleSubmit()
                            }} 
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