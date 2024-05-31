import Head from 'next/head';
import { Box, Card, CardContent, CardHeader, Container, Divider, Grid, Typography } from '@mui/material';
import { DashboardLayout } from '../../components/admin/dashboard/dashboard-layout';
import AdminAuth from '../../config/admin-auth';
import { NewUserBarChart } from '../../components/admin/dashboard/analytics/new-user-bar-chart';
import { RevenueChart } from '../../components/admin/dashboard/analytics/Revenu';

const Dashboard = () => {
	return (
		<DashboardLayout>
			<Head>
				<title>
					Dashboard | Admin
				</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 4,
				}}>
				<Container maxWidth={false}>
					<Typography
						sx={{ mb: 3 }}
						variant="h4">
						Dashboard
					</Typography>
					<Typography
						sx={{ mb: 3 }}
						variant="subtitle1">
						{"Welcome to My5Mt software dashboard. Here you can get an overview of your math tutor's activity"}
					</Typography>
					<Grid container spacing={3}>
						<Grid
							item
							md={12}
							lg={12}
							sm={12}
							xs={12}>
							<Typography variant='h6' sx={{mb: 1}}>
								Newly Added Member
							</Typography>
							<NewUserBarChart />
						</Grid>

						<Grid
							item
							md={12}
							lg={12}
							sm={12}
							xs={12}>
							<Typography variant='h6' sx={{mb: 1}}>
								Revenue (Profit)
							</Typography>
							<RevenueChart />
						</Grid>
					</Grid>
				</Container>
			</Box >
		</DashboardLayout >
	)
}

// Dashboard.getLayout = (page: React.ReactElement) => (
//     <DashboardLayout>
//         {page}
//     </DashboardLayout>
// );

export default AdminAuth(Dashboard);
