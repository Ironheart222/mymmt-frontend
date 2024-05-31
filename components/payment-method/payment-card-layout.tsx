import { Box, Stack } from "@mui/material";
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';

export default function PaymentCardLayout(props: any) {
    let { paymentMethod, selectedId, onSelect } = props;

    return (
        <Box className={paymentMethod.id == selectedId ? "card-content-wrapper selected-card" : "card-content-wrapper"} onClick={() => onSelect(paymentMethod.id)}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <span className="check-icon"></span>
                <Stack sx={{ flexGrow: 1 }} direction={"column"}>
                    <span style={{ fontWeight: 'bold', fontSize: "16px", color: "#000", marginRight: "8px" }}>
                        {paymentMethod.card.brand.toUpperCase()}
                    </span>
                    <Stack direction={"row"}>
                        <span style={{ fontSize: "16px", color: "#000", marginRight: "4px", paddingTop: "1px" }}>
                            **** **** ****
                        </span>
                        <span style={{ fontWeight: 'bold', color: "#606B76", float: "right" }}>
                            {paymentMethod.card.last4}
                        </span>
                    </Stack>
                    {/* <span style={{ fontWeight: 'bold', fontSize: "12px", color: "rgba(108,108,132,1)" }}> Expires on 02/22</span> */}
                </Stack>
                <CreditCardRoundedIcon />
            </Box>
        </Box>
    )
}