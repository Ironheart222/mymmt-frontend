import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { DialogDetails } from "../../../store/Interface";

interface PropType {
    modelOpen: boolean
    onClose: () => void
    dialogDetails: DialogDetails
    onDelete: (id: string) => void
    loading: boolean
}

export default function ConfirmationModel(props: PropType) {
    const { modelOpen, onClose, dialogDetails, onDelete, loading } = props;

    if (!Object.keys(dialogDetails).length) {
        onClose();
    }

    return (
        <Dialog
            open={modelOpen}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
                style: {
                    borderRadius: "8px"
                }
            }}>

            <DialogTitle>
                <Typography variant="h6" color={"#000000"}>
                    {dialogDetails?.title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1" component={"span"} color={"#000000"}>
                    {dialogDetails?.body_content}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button 
                    type="button" 
                    color="inherit" 
                    variant="text" 
                    onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    type="button" 
                    color="error" 
                    variant="contained"
                    disabled={loading ? true : false} 
                    onClick={() => onDelete(dialogDetails?.id)}>
                    DELETE
                    {loading && <CircularProgress size={20} />}
                </Button>
            </DialogActions>

        </Dialog>
    )
}