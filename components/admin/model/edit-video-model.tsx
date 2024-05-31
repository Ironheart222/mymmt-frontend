import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, CircularProgress, InputLabel, SelectChangeEvent, Typography } from '@mui/material';
import { ApolloClientType, VideoData, VideoParam } from '../../../store/Interface';
import Validations from '../../../helpers/validations';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { editVideoData } from '../../../store/thunk/admin/lesson';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
    open: boolean,
    onClose: (value: VideoData | null) => void,
    videoData: VideoData | null,
    stageNo: string,
    pageNo: number
}

interface FormValidation {
    title?: string;
}

export default function EditVideoModel(props: Props) {

    let { open, onClose, videoData, stageNo, pageNo } = props;

    const dispatch = useAppDispatch();
    const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);

    const [videoInfo, setVideoInfo] = React.useState<VideoParam>({
        video_id: "",
        title: "",
        description: "",
        stage_no: ""
    });
    const [formError, setFormError] = React.useState<FormValidation>({});
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);
        }
    }, [notificationInfo]);

    React.useEffect(() => {
        if (videoData) {            
            let stateInput: VideoParam = {
                video_id: videoData.id,
                title: videoData.title,
                description: videoData.description,
                stage_no: stageNo
            }
            setVideoInfo(stateInput);
        }
    }, [videoData]);

    const handleInputChange = (prop: keyof VideoParam) => (event: | SelectChangeEvent<string>
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

            setVideoInfo({
                ...videoInfo,
                [prop]: event.target.value
            })
            
    };

    const handleInputEditor = (val: any) => {
        setVideoInfo({
            ...videoInfo,
            description: !isEditorEmpty(val) ? val : ""
        })
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
        let _request = {
            video_id: videoInfo.video_id,
            title: videoInfo.title.trim(),
            description: videoInfo.description.trim(),
            stage: stageNo,
            page_no: pageNo
        }
        let allError = Validations.validateEditVideoForm(_request);
        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            setLoading(true);
            let result = 
            Promise.resolve(
                dispatch(editVideoData({_request, adminClient}))
            ).then(res => {                
                onClose(null);
            })
        }
        setFormError(allError);
    }

    function isEditorEmpty(value: string) {
        if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            return true;
        }
        return false;
    }


    return (
        <div>
            <Dialog open={open} onClose={() => onClose(null)} fullWidth={true}>
                <DialogTitle>Edit Video</DialogTitle>
                <DialogContent>
                    <Typography variant='subtitle2' component={"p"}>
                        You can edit video title and description
                    </Typography>
                    <Box>
                        <InputLabel className="textfield-label">Title</InputLabel>
                        <TextField
                            autoFocus
                            id="title"
                            placeholder='Enter Title'
                            type="text"
                            value={videoInfo.title}
                            onChange={handleInputChange("title")}
                            fullWidth
                            variant="outlined"
                            error={formError && formError.title ? true : false}
                            helperText={formError && formError.title}
                        />
                        <InputLabel className="textfield-label">Description</InputLabel>
                        <ReactQuill theme="snow" value={videoInfo.description} onChange={handleInputEditor} modules={{ toolbar: [{'list': 'ordered'}] }} />
                        {/* <TextField
                            autoFocus
                            id="description"
                            type="text"
                            value={videoInfo.description}
                            onChange={handleInputChange("description")}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Description/>
                                    </InputAdornment>
                                ),
                            }}
                        /> */}
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button size='small' className='model-button' onClick={() => onClose(null)}>Cancel</Button>
                    <Button
                        type="button"
                        className='model-button'
                        size='small'
                        onClick={(e) => handleSubmit(e)}
                        disabled={loading ? true : false}
                    >
                        {loading ? (<CircularProgress color={"primary"} size={20} />) : "Update"}
                        {/* Send Link */}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
