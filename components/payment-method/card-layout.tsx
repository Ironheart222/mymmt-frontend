import * as React from 'react';
import { Badge, Box, CircularProgress, Grid, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeletePaymentMethod from './delete-card';
import AddCardDetailModal from '../model/add-card-details-model';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { detchPaymentMethod, setCardAsDefault } from '../../store/thunk/subscription';
import { ApolloClientType } from '../../store/Interface';

interface PropType {
    paymentMethod: any,
    defaultMethod: boolean
}

const CardLayout = (props: PropType) => {
   
    const { paymentMethod, defaultMethod } = props;

    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)

    const [deletePopup, setDeletePopup] = React.useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
    const [defaultLoading, setDefaultLoading] = React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<string>('');
    const [editPopup, setEditPopup] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDeletePopup = (paymentMethod: any) => {
        handleClose();
        if (paymentMethod && Object.keys(paymentMethod).length > 0) {
            setDeleteId(paymentMethod.id ? paymentMethod.id : '');
        }
        setDeletePopup(!deletePopup);
    };

    const toggleEditPopup = () => {
        handleClose();
        setEditPopup(!editPopup);
    };

    const deleteCallBack = () => {
        setDeleteLoading(true);
        if (deleteId) {
            dispatch(detchPaymentMethod({
                _request: deleteId, userClient, result: (response: any) => {
                    toggleDeletePopup(null);
                    setDeleteLoading(false);
                }
            }))
        }
    }

    const setAsDefault = () => {
        setDefaultLoading(true);
        if (paymentMethod && Object.keys(paymentMethod).length > 0) {
            let id = paymentMethod.id;
            dispatch(setCardAsDefault({_request: id, userClient, result: (response: any) => {
                handleClose();
                setDefaultLoading(false);
            }}))
        }
    }

    const cardBoxContent = () => {
        return (
            <Box className="cardBox">
                <CreditCardTwoToneIcon sx={{ mr: 2 }} />
                <Stack sx={{ flexGrow: 1 }} direction={"column"} spacing={0.5}>
                    <Stack direction={"row"}>
                        <span style={{ fontWeight: 'bold', color: "#000", marginRight: "8px" }}>{paymentMethod.card.brand.toUpperCase()}</span>
                        {/* <span style={{ fontWeight: 'bold', color: "#606B76", float: "right" }}>**** **** {paymentMethod.card.last4}</span> */}
                        <Box sx={{ display: {xs: 'none',sm: 'flex'}, fontSize: "16px", color: "#000", marginRight: "4px", paddingTop: "1px" }}>
                            **** 
                        </Box>
                        <span style={{ fontWeight: 'bold', color: "#606B76", float: "right" }}>
                            {paymentMethod.card.last4}
                        </span>
                    </Stack>
                    <span style={{ fontWeight: 'bold', fontSize: "12px", color: "rgba(108,108,132,1)" }}> Expires on {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}</span>
                </Stack>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    PaperProps={{
                        style: {
                            width: '20ch',
                        },
                    }}
                >
                    <span style={{ fontWeight: 'bold', color: "#606B76", marginLeft: "16px", marginBottom: "12px" }}>ACTIONS</span>
                    <MenuItem onClick={setAsDefault} sx={{ mt: 1 }} disabled={defaultMethod}>
                        { defaultLoading && (<CircularProgress size={12} sx={{mr: 1}}/>) }
                        <span style={{ fontWeight: 'bold', fontSize: "14px", color: "#808080" }}>Set as default</span>
                    </MenuItem>
                    <MenuItem onClick={toggleEditPopup}>
                        <span style={{ fontWeight: 'bold', fontSize: "14px", color: "rgb(99,91,255)" }}>Edit</span>
                    </MenuItem>
                    <MenuItem onClick={() => toggleDeletePopup(paymentMethod)}>
                        <span style={{ fontWeight: 'bold', fontSize: "14px", color: "rgb(223,27,65)" }}>Delete</span>
                    </MenuItem>
                </Menu>
            </Box>
        )
    }

    return (
        <Box>
            {
                deletePopup &&
                (
                    <DeletePaymentMethod
                        open={deletePopup}
                        handleClose={toggleDeletePopup}
                        onDelete={deleteCallBack}
                        loading={deleteLoading} />
                )
            }
            {
                editPopup &&
                (
                    <AddCardDetailModal
                        onClose={toggleEditPopup}
                        open={editPopup}
                        paymentMethods={paymentMethod} />
                )
            }
            {
                defaultMethod ? (
                    <Badge className="default-badge" badgeContent={"default"}>
                        {cardBoxContent()}
                    </Badge>
                ) : cardBoxContent()
            }

        </Box>
    )

}

export default CardLayout;