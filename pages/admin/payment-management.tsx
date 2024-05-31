import { Box, Container } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../../components/admin/dashboard/dashboard-layout";
import { PaymentCollection } from "../../components/admin/payment/payment-collection";
import AdminAuth from "../../config/admin-auth";

function PaymentManagement() {

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Payment Management | Admin
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4
                }}
            >
                <Container maxWidth={false}>
                    <PaymentCollection />
                </Container>
            </Box>
        </DashboardLayout>
    )
}

export default AdminAuth(PaymentManagement);