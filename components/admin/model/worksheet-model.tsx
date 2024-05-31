import * as React from 'react';
import { Button, Box, Typography, InputLabel, CircularProgress, Dialog, DialogContent, DialogActions, TextField, DialogTitle } from '@mui/material';
import Validations from '../../../helpers/validations';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { ApolloClientType, WorksheetData } from '../../../store/Interface';
import { addUpdateWorksheet, getWorksheetById } from '../../../store/thunk/admin/lesson';
import Link from 'next/link';
import { GetWorksheetDataById } from '../../../store/slices/admin/lessonSlice';

interface PropType {
    onClose: () => void,
    open: boolean,
    editId: string,
    stage_no: number
}

interface FormValues {
    title: string,
    description: string,
    file: File | null,
    fileURL?: string,
}

interface FormError {
    title?: string,
    description?: string,
    file?: string,
    fileURL?: string
}

let initialFormValue: WorksheetData = {
    worksheet_id: 0,
    worksheet_name: "",
    worksheet_description: "",
    worksheet_url: "",
    stage_no: "",
    is_delete: false,
    created_date: new Date(0),
    updated_date: new Date(0)
}

const fileType = [
    "application/pdf",
    // "application/msword",
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

export default function WorksheetModel(props: PropType) {
    const { onClose, open, editId, stage_no } = props

    const dispatch = useAppDispatch();
    const { adminClient, uploadClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const { worksheetDataById } = useAppSelector((state) => state.lessonReducer);

    let initialValue: FormValues = {
        title: '',
        description: '',
        file: null,
    }

    const [values, setValues] = React.useState<FormValues>(initialValue);
    const [formError, setFormError] = React.useState<FormError>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false)
        }
    }, [notificationInfo])

    React.useEffect(() => {
        if (editId) {
            dispatch(getWorksheetById({ worksheetId: +editId, adminClient }));
        } else {
            dispatch(GetWorksheetDataById(initialFormValue));
            // setValues(initialValue);
        }
    }, [editId]);

    React.useEffect(() => {
        if (worksheetDataById) {
            setValues({
                ...values,
                title: worksheetDataById.worksheet_name,
                description: worksheetDataById.worksheet_description,
                fileURL: worksheetDataById.worksheet_url,
            })
        }
    }, [worksheetDataById]);

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const handleChangeFile = (event: any) => {

        if (event && event.target.files[0]) {
            
            if (!fileType.includes(event.target.files[0].type)) {
                setFormError({
                    ...formError,
                    file: "You can only upload PDF file!"
                })
            } else if (event.target.files[0].size > 50 * 1024 * 1024) {
                setFormError({
                    ...formError,
                    file: "The file must be smaller than 50Mb"
                })
            } else {
                setValues({
                    ...values,
                    file: event.target.files[0]
                });

                setFormError({
                    ...formError,
                    file: ""
                });
            }

        } else {
            setFormError({
                ...formError,
                file: ""
            });
        }
    }

    const handleSubmit = () => {
        let reqParams = {
            worksheet_id: editId ? editId : "",
            title: values.title.trim(),
            description: values.description.trim(),
            file: values.file,
            fileURL: values.fileURL,
            stage_no: +stage_no
        }
        // if (editId) {
        //     Object.assign(reqParams,{file: values.file})
        // }
        let allError = Validations.validateWorksheetForm(reqParams);

        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            setLoading(true);
            dispatch(addUpdateWorksheet({ _request: reqParams, adminClient, uploadClient, onClose }));
        }
        setFormError(allError);
    }

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
                style: {
                    borderRadius: "8px",
                }
            }}>

            <DialogTitle sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" color={"#000000"}>
                    Upload Worksheet
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box component="form" className="form-element" noValidate sx={{ mt: 2 }}>

                    <InputLabel className="textfield-label">Title*</InputLabel>
                    <TextField
                        required
                        fullWidth
                        id="title"
                        name="title"
                        value={values.title}
                        onChange={handleChangeInput}
                        autoComplete="title"
                        placeholder="Enter title"
                        autoFocus
                        error={formError && formError.title ? true : false}
                        helperText={formError && formError.title}
                    />


                    <InputLabel className="textfield-label">Description</InputLabel>
                    <TextField
                        required
                        fullWidth
                        multiline
                        maxRows={3}
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={handleChangeInput}
                        autoComplete="description"
                        placeholder="Enter description"
                        autoFocus
                    // error={formError && formError.description ? true : false}
                    // helperText={formError && formError.description}
                    />

                    {/* {
                        !editId && (
                            <> */}
                    <InputLabel className="textfield-label">Attachments*</InputLabel>
                    <TextField
                        required
                        fullWidth
                        type="file"
                        inputProps={{ accept: ".doc,.docx,.pdf" }}
                        // value={values.email}
                        onChange={handleChangeFile}
                        placeholder="Worksheet"
                        autoFocus
                        error={formError && formError.file ? true : false}
                        helperText={formError && formError.file}
                    />
                    {
                        values && values.fileURL && (
                            <Typography variant='body1' component={"p"} sx={{ mt: 1 }}>
                                <strong>URL: </strong>
                                <Link href={values.fileURL}>
                                    <a target="_blank">
                                        {values.fileURL}
                                    </a>
                                </Link>
                            </Typography>
                        )
                    }
                    {/* </>
                        )
                    } */}



                </Box>
            </DialogContent>

            <DialogActions sx={{ pr: 3, my: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Button type="button" color="inherit" variant="text" onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading ? true : false}
                >
                    {editId ? "Update" : "Upload"}
                    {loading && <CircularProgress color={"primary"} size={20} />}
                </Button>

            </DialogActions>

        </Dialog>
    )
}