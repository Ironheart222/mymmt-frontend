import { Box, Container } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../../../components/admin/dashboard/dashboard-layout";
import { RevenueTable } from "../../../components/admin/reports/revenue-table";
import AdminAuth from "../../../config/admin-auth";

function RevenueReport() {

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Revenue Reports | Admin
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
                    <RevenueTable />
                </Container>
            </Box>
        </DashboardLayout>
    )
}

export default AdminAuth(RevenueReport);