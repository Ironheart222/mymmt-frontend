import * as React from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props: any) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme: any) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

interface Props {
    open: boolean,
    handleClose: (id: string|null) => void,
    onDelete: () => void,
    loading: boolean
}

const DeletePaymentMethod = (props: any) => {

    let { handleClose, open, onDelete, loading } = props;

    return (
        <BootstrapDialog
            onClose={() => handleClose(null)}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={"xs"}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClose(null)}>
                Remove Card
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    This card will no longer be usable after removing from your payment method list.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => handleClose(null)}>
                    Cancel
                </Button>
                <Button 
                    variant='contained' 
                    autoFocus 
                    sx={{background: "rgb(223 27 65)", color: "#fff", borderRadius: "8px"}} 
                    onClick={onDelete}
                    disabled={loading ? true : false}
                    >
                    {loading ? <CircularProgress size={20} /> : "Remove"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )

}

export default DeletePaymentMethod;