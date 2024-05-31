import * as React from 'react';
import { IconButton, Button, Box, Typography, InputLabel, CircularProgress, Drawer, Grid, Divider, Autocomplete, TextField, Tooltip, FormHelperText } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { ApolloClientType, CoreConceptCategory, LessonData, VideoData, WorksheetData } from '../../../store/Interface';
import { addUpdateMappedLesson, getCategoryForMapping, getCategoryList, getVideoForMapping, getWorksheetForMapping, unMapWorksheet } from '../../../store/thunk/admin/lesson';
import Validations from '../../../helpers/validations';
import { Delete, Edit } from '@mui/icons-material';
import { AddUpdateMappedData, GetVideoForMappingData, GetWorksheetForMappingData, UnMapWorksheetData } from '../../../store/slices/admin/lessonSlice';

const StageArray = [
    "stage 2",
    "stage 3"
]

interface FormData {
    lesson_no: string,
    lesson_id: string,
    lesson: VideoData | null,
    worksheet: WorksheetData | null,
    stage_no: number,
    category: CoreConceptCategory | null
}

interface FormError {
    lesson_no?: string,
    lesson?: string,
    worksheet?: string,
    stage?: string,
    category?: string
}

interface PropType {
    open: boolean,
    onClose: (value: LessonData | null) => void
    lessonData: LessonData | null,
    stage_no: number,
    lesson_no: string,
}

export default function MappingDataModel(props: PropType) {
    const { onClose, open, lessonData, lesson_no, stage_no } = props;

    const dispatch = useAppDispatch();
    const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
    const { videoMappingData, worksheetMappingData, categoryList, addUpdateMappedData, unMapWorksheetData } = useAppSelector((state) => state.lessonReducer);
    const notificationInfo = useAppSelector((state) => state.notificationReducer);

    const [formValue, setFormValue] = React.useState<FormData>({
        lesson_no: lesson_no,
        lesson_id: "",
        lesson: null,
        worksheet: null,
        category: null,
        stage_no: stage_no
    });
    const [formError, setFormError] = React.useState<FormError>({
        lesson_no: "",
        lesson: "",
        worksheet: "",
        category: "",
        stage: ""
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLessonNoFocused, setIsLessonNoFocused] = React.useState(false);

    const [openACLesson, setOpenACLesson] = React.useState<boolean>(false);
    const [lessonLoading, setLessonLoading] = React.useState<boolean>(false);
    const [lessonOptions, setLessonOptions] = React.useState<readonly VideoData[]>([]);

    const [openACWorksheet, setOpenACWorksheet] = React.useState<boolean>(false);
    const [openACCategory, setOpenACCategory] = React.useState<boolean>(false);
    const [sheetLoading, setSheetLoading] = React.useState<boolean>(false);
    const [categoryLoading, setCategoryLoading] = React.useState<boolean>(false);
    const [worksheetOptions, setWorksheetOptions] = React.useState<readonly WorksheetData[]>([]);
    const [categoryOptions, setCategoryOptions] = React.useState<readonly CoreConceptCategory[]>([]);

    React.useEffect(() => {
        dispatch(GetVideoForMappingData([]));
        dispatch(GetWorksheetForMappingData([]));
    },[])

    React.useEffect(() => {
        setLessonLoading(false);
        setLessonOptions(videoMappingData ? videoMappingData : []);

        setSheetLoading(false);
        setWorksheetOptions(worksheetMappingData ? worksheetMappingData : []);

        setCategoryLoading(false);
        setCategoryOptions(categoryList ? categoryList : []);
    }, [videoMappingData,worksheetMappingData,categoryList]);

    React.useEffect(() => {
        if (!openACLesson) {
            setLessonOptions([]);
        } else {
            dispatch(getVideoForMapping({ _request: stage_no, adminClient }));
        }
        setLessonLoading(openACLesson);
    }, [openACLesson]);

    React.useEffect(() => {        
        if (!openACWorksheet) {
            setWorksheetOptions([]);
        } else {
            dispatch(getWorksheetForMapping({ _request: stage_no, adminClient }));
        }
        setSheetLoading(openACWorksheet);
    },[openACWorksheet]);

    React.useEffect(() => {        
        if (!openACCategory) {
            setCategoryOptions([]);
        } else {
            dispatch(getCategoryList({ adminClient }));
        }
        setCategoryLoading(openACCategory);
    },[openACCategory]);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);
        }
    }, [notificationInfo]);


    React.useEffect(() => {
        if (addUpdateMappedData && Object.keys(addUpdateMappedData).length > 0) {
            if (lessonData) {
                onClose(null);
            } else {
                setFormValue({
                    ...formValue,
                    lesson: lessonData ? formValue.lesson : null,
                    worksheet: null,
                    lesson_no: String(Number(formValue.lesson_no) + 1)
                })
            }
            dispatch(AddUpdateMappedData({}));
        }

    }, [addUpdateMappedData]);

    React.useEffect(() => {
        if (unMapWorksheetData && Object.keys(unMapWorksheetData).length > 0) {
            onClose(null);
            dispatch(UnMapWorksheetData({}));
        }

    }, [unMapWorksheetData]);

    React.useEffect(() => {
        if (lessonData) {
            let inputData = {
                lesson_no: String(lessonData.lesson_no),
                lesson_id: lessonData.lesson_id,
                lesson: lessonData.vdo_cipher_video,
                worksheet: lessonData.worksheet_detail,
                category: lessonData.category_detail,
                stage_no: stage_no
            }
            setFormValue(inputData);
        } else {
            setFormValue({
                ...formValue,
                lesson_no: lesson_no
            });
        }
    }, [lessonData]);

    const handleInputChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValue({
            ...formValue,
            [prop]: event.target.value
        })
    };

    const handleOnChange = (name: string) => (event: React.SyntheticEvent<Element, Event>, value: VideoData | WorksheetData | CoreConceptCategory | string | null) => {

        setFormValue({
            ...formValue,
            [name]: value ? value : null
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let _request = {
            lesson_id: formValue.lesson_id,
            lesson_no: +formValue.lesson_no,
            video_data: formValue.lesson,
            worksheet_id: formValue.worksheet ? +formValue.worksheet.worksheet_id : "",
            category_id: formValue.category ? +formValue.category.category_id : 0, 
            stage_no: formValue.stage_no
        }

        let allError = Validations.validateMappingForm(_request);

        if (Object.entries(allError).length === 0 && allError.constructor === Object) {
            setLoading(true);
            Promise.resolve(
                dispatch(addUpdateMappedLesson({ _request, adminClient }))
            ).then(res => {
                onClose(null);
            });
        }
        setFormError(allError);
    }

    const handleUnmapWorksheet = (lessonData: LessonData) => {
        if (lessonData && lessonData.lesson_id) {
            setLoading(true);
            let _request = {
                lesson_id: lessonData.lesson_id,
                stage_no: stage_no
            }
            dispatch(unMapWorksheet({ _request, adminClient }));
        }
        // setFormValue({
        //     ...formValue,
        //     worksheet: null,
        // })
    }

    const lessonNoIsFocus = () => {
        // if (!lessonData) {
            if (!isLessonNoFocused) {
                return (
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                minheight: 2
                            }}>
                            <Typography
                                variant='subtitle2'>
                                <b>#Lesson No - {formValue.lesson_no}</b>
                                <IconButton onClick={() => setIsLessonNoFocused(true)}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            </Typography>
                        </Box>
                        {
                            formError && formError.lesson_no && (
                                <FormHelperText error id="password-error">
                                    {formError.lesson_no}
                                </FormHelperText>
                            )
                        }
                    </Box>
                )
            } else {
                return (
                    <TextField
                        autoFocus
                        id="lesson_no"
                        placeholder='Enter Lesson No'
                        type="text"
                        value={formValue.lesson_no}
                        onChange={handleInputChange("lesson_no")}
                        onBlur={event => setIsLessonNoFocused(false)}
                        fullWidth
                        variant="outlined"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                setIsLessonNoFocused(false);
                            }
                        }}
                    // error={formError && formError.lesson_no ? true : false}
                    // helperText={formError && formError.lesson_no}
                    />
                )
            }
        // } else {
        //     return (
        //         <Box
        //             sx={{
        //                 display: "flex",
        //                 flexDirection: "row",
        //                 minheight: 2
        //             }}>
        //             <Typography
        //                 variant='subtitle2'>
        //                 <b>#Lesson No - {formValue.lesson_no}</b>
        //             </Typography>
        //         </Box>
        //     )
        // }

    }



    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => onClose(null)}
            variant="temporary">

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    my: 2
                }}
                component="form"
                className="form-element"
                onSubmit={handleSubmit}
                noValidate>

                <Box
                    sx={{
                        mx: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Typography variant='h6'>
                                Mapped Lesson Detail
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => onClose(null)}>
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
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                    <Box sx={{
                        mt: 2,
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                        <Box className="discount-title">
                            {lessonNoIsFocus()}
                        </Box>

                        <Grid container sx={{ px: 2 }}>

                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel className="textfield-label">Select Lesson</InputLabel>
                                <Autocomplete
                                    id="asynchronous-demo"
                                    size='small'
                                    open={openACLesson}
                                    onOpen={() => {
                                        setOpenACLesson(true);
                                    }}
                                    onClose={() => {
                                        setOpenACLesson(false);
                                    }}
                                    value={formValue.lesson ? formValue.lesson : null}
                                    onChange={handleOnChange("lesson")}
                                    isOptionEqualToValue={(option, value) => option?.title === value?.title}
                                    getOptionLabel={(option) => option?.title}
                                    options={lessonOptions}
                                    loading={lessonLoading}
                                    loadingText={"Loading..."}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={formError && formError.lesson ? true : false}
                                            helperText={formError && formError.lesson}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {lessonLoading ? <CircularProgress color="inherit" size={20} sx={{mr:4}}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <Typography variant='body1' sx={{ my: 2, color: "rgba(108,108,132,1)" }}>
                                    Select which lesson video mapped with their stage.
                                </Typography>
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel className="textfield-label">Select Worksheets</InputLabel>
                                <Autocomplete
                                    id="asynchronous-demo"
                                    open={openACWorksheet}
                                    onOpen={() => {
                                        setOpenACWorksheet(true);
                                    }}
                                    onClose={() => {
                                        setOpenACWorksheet(false);
                                    }}
                                    fullWidth
                                    size='small'
                                    onChange={handleOnChange("worksheet")}
                                    value={formValue.worksheet ? formValue.worksheet : null}
                                    isOptionEqualToValue={(option, value) => option?.worksheet_name === value?.worksheet_name}
                                    getOptionLabel={(option) => option?.worksheet_name}
                                    options={worksheetOptions}
                                    loading={sheetLoading}
                                    loadingText={"Loading..."}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={formError && formError.worksheet ? true : false}
                                            helperText={formError && formError.worksheet}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {sheetLoading ? <CircularProgress color="inherit" size={20} sx={{mr:4}}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {
                                    lessonData && (
                                        <Tooltip title="Delete" sx={{ mt: 0.5 }}>
                                            <Button
                                                color='error'
                                                startIcon={<Delete />}
                                                size="small"
                                                className='model-error-button'
                                                onClick={() => handleUnmapWorksheet(lessonData)}>
                                                Unmap worksheet
                                            </Button>
                                        </Tooltip>
                                    )
                                }
                                <Typography variant='body1' sx={{ my: 2, color: "rgba(108,108,132,1)" }}>
                                    Select which worksheet mapped with their their stage and above selected lesson.
                                </Typography>
                            </Grid>
                            
                            {
                                (stage_no == 20 || stage_no == 30) && 
                                <Grid item md={12} sm={12} xs={12}>
                                    <InputLabel className="textfield-label">Select Category</InputLabel>
                                    <Autocomplete
                                        id="asynchronous-demo"
                                        open={openACCategory}
                                        onOpen={() => {
                                            setOpenACCategory(true);
                                        }}
                                        onClose={() => {
                                            setOpenACCategory(false);
                                        }}
                                        fullWidth
                                        size='small'
                                        onChange={handleOnChange("category")}
                                        value={formValue.category ? formValue.category : null}
                                        isOptionEqualToValue={(option, value) => option?.category_tag === value?.category_tag}
                                        getOptionLabel={(option) => option?.category_name}
                                        options={categoryOptions}
                                        loading={categoryLoading}
                                        loadingText={"Loading..."}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={formError && formError.category ? true : false}
                                                helperText={formError && formError.category}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {categoryLoading ? <CircularProgress color="inherit" size={20} sx={{mr:4}}/> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    <Typography variant='body1' sx={{ my: 2, color: "rgba(108,108,132,1)" }}>
                                        Select which Category mapped with their stage and above selected lesson.
                                    </Typography>
                                </Grid>
                            }
                        </Grid>

                    </Box>

                </Box>

                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{ mx: 6, mb: 2 }}>
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        fullWidth
                        disabled={loading ? true : false}
                    >
                        Mapped Lesson
                        {loading && <CircularProgress color={"primary"} size={20} />}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    )
}