import { Box, Container } from "@mui/material"
import Head from "next/head"
import { DashboardLayout } from "../../../components/admin/dashboard/dashboard-layout"
import { ParentResourcesPage } from "../../../components/admin/parent-resources/parent-resources-page"

const ParentResources = () => {

    return (
      <DashboardLayout>
        <Head>
          <title>
            Lesson Management | Admin
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
            <ParentResourcesPage/>
          </Container>
        </Box>
      </DashboardLayout>
    )
  }

export default ParentResources 