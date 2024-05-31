import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { ParentManagementPage } from '../../components/admin/user-management/parent-management-page';
import { DashboardLayout } from '../../components/admin/dashboard/dashboard-layout';
import AdminAuth from '../../config/admin-auth';

const ParentManagement = () => {
  
  return(
    <DashboardLayout>
    <Head>
      <title>
        Admin | User Management
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 6,
        backgroundColor: '#f4f5f7'
      }}
    >
      <Container maxWidth={false}>
        <ParentManagementPage />
        {/* <Box sx={{ mt: 3 }}> */}
          {/* <CustomerListResults /> */}
        {/* </Box> */}
      </Container>
    </Box>
  </DashboardLayout>
  )
}

// UserManagement.getLayout = (page: React.ReactElement) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default AdminAuth(ParentManagement);
