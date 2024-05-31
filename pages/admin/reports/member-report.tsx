import { Box, Container } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../../../components/admin/dashboard/dashboard-layout";
import { MemberTable } from "../../../components/admin/reports/member-table";
import AdminAuth from "../../../config/admin-auth";

function MemberReport() {

    return (
        <DashboardLayout>
            <Head>
                <title>
                   Members Report | Admin
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
                    <MemberTable />
                </Container>
            </Box>
        </DashboardLayout>
    )
}

export default AdminAuth(MemberReport);