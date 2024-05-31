import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { ParentManagementPage } from '../../components/admin/user-management/parent-management-page';
import { DashboardLayout } from '../../components/admin/dashboard/dashboard-layout';
import AdminAuth from '../../config/admin-auth';
import { DiscountManagement } from '../../components/admin/discount-code/discount-management';
import { PlanManagement } from '../../components/admin/subscription-plan/plan-management';

const DiscountCode = () => {

  return (
    <DashboardLayout>
      <Head>
        <title>
          Admin | Subscription Plan
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6
        }}
      >
        <Container maxWidth={false}>
          <PlanManagement />
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

export default AdminAuth(DiscountCode);
