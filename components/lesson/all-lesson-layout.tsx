import * as React from 'react';
import { Backdrop, Box, Button, Card, CardActions, CardContent, Container, Grid, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { ApolloClientType, LessonData, WeeklyLessonData } from '../../store/Interface';
import VideoPlayer from '../video-player/videoplayer-library';
import { Description } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getStageLessonData, getWeeklyLessonData } from '../../store/thunk/lessonThunk';
import EyeIcon from '@mui/icons-material/RemoveRedEye';
import { setLoading } from '../../store/slices/loadingSlice';
import EmptyState from '../empty-state';

interface PropType {
	className: string,
	stage_no: string,
}

const AllLessonLayout = (props: PropType) => {
	let { className, stage_no } = props;

	let dispatch = useAppDispatch();
	const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
	const { stageLessonData, addLessonHistoryData } = useAppSelector((state) => state.childLessonReducer);
	// let loadingInfo = useAppSelector((state) => state.loadingReducer);

	const [lessonData, setLessonData] = React.useState<LessonData[]>();
	const [view, setView] = React.useState('list');
	const [breakPoint, setBreakPoint] = React.useState({
		main: {
			xs: 12,
			sm: 12,
			md: 12
		},
		item: {
			xs: 12,
			sm: 12,
			md: 12
		}
	});
	// let [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		let childId = localStorage.getItem("child_id");
		if (stage_no) {
			let param = {
				child_id: String(childId),
				stage_no: stage_no
			}
			dispatch(getStageLessonData({ _request: param, userClient }))
		}

	}, [stage_no, addLessonHistoryData]);

	React.useEffect(() => {
		if (stageLessonData && Array.isArray(stageLessonData) && stageLessonData.length > 0) {
			setLessonData(stageLessonData.data);
		}
	}, [stageLessonData]);


	React.useEffect(() => {

		let mainBreakPoints = {
			md: view === "tile" ? 4 : 12,
			sm: view === "tile" ? 6 : 12,
			xs: view === "tile" ? 12 : 12,
		}
		let itemBreakPoints = {
			md: view === "tile" ? 12 : 4,
			sm: view === "tile" ? 12 : 4,
			xs: view === "tile" ? 12 : 12,
		}
		setBreakPoint({
			main: mainBreakPoints,
			item: itemBreakPoints
		});

	}, [view]);

	const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
		setView(nextView);
	};

	return (
		<main className={className}>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 2,
					pb: 4,
				}}
			>
				<Container maxWidth="md">
					<Grid container>
						<Grid item md={10} sm={8} xs={12} alignItems="center">
							<Stack
								direction="row"
								justifyContent="center"
							>
								<Button className='video-button' disableTouchRipple disableElevation variant="contained">
									Stage 2: All Lesson
								</Button>
							</Stack>
							{/* <Typography component="h1" align="center" variant="h5" gutterBottom className="header-title dashboard-header">
								Stage 2: All Lesson
							</Typography> */}
						</Grid>
						<Grid item md={2} sm={4} xs={5} textAlign="end" display={{ xs: "none", sm: "block" }}>
							<ToggleButtonGroup
								orientation="horizontal"
								value={view}
								exclusive
								onChange={handleChange}
							>

								<ToggleButton value="list" aria-label="list">
									<ViewListIcon />
								</ToggleButton>
								<ToggleButton value="tile" aria-label="tile">
									<ViewModuleIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Container maxWidth="md" sx={{ backgroundColor: "white", pb: 4 }}>
				<Grid container spacing={4} alignItems={"center"}>

					{
						lessonData && lessonData.length > 0 ? lessonData.map((lesson: LessonData, index: number) => {
							return (
								<Grid item md={breakPoint.main.md} sm={breakPoint.main.sm} xs={breakPoint.main.xs} key={index}>
									<Card
										elevation={6}
									// sx={{ height: '100%' }}
									>
										<Grid container>
											<Grid textAlign={"center"} item md={breakPoint.item.md} sm={breakPoint.item.sm} xs={breakPoint.item.xs}>
												<VideoPlayer lessonObj={lesson} />
											</Grid>

											<Grid item md={12 - breakPoint.item.md} sm={12 - breakPoint.item.sm} xs={breakPoint.item.xs} sx={{ height: view === "tile" ? "180px" : "auto" }} display={"flex"} flexDirection={"column"}>

												<CardContent sx={{ flexGrow: 2 }}>
													<Box display={"flex"} flexDirection="row" justifyContent={"space-between"}>
														<Tooltip title={lesson.vdo_cipher_video.title}>
															<Typography sx={{ flexGrow: 1 }} component={"p"} variant={'caption'} className={view === "list" ? "text-list-title" : "text-tile-title"}>
																{lesson.vdo_cipher_video.title}
															</Typography>
														</Tooltip>
														{
															lesson.history_detail.length > 0 && lesson.history_detail[0].watched && (
																<Tooltip title="watched">
																	<EyeIcon sx={{ ml: 1, color: "#008000" }} />
																</Tooltip>
															)
														}

													</Box>

													{
														lesson.worksheet_detail &&
														<Typography component={"p"} variant={'caption'} className="text-sublabel text-with-icon">
															<Description className="description-icon" />
															{lesson.worksheet_detail.worksheet_name}
														</Typography>
													}


												</CardContent>
												{
													lesson.worksheet_detail &&
													(
														<CardActions sx={{ flexGrow: 1, alignItems: "end" }}>
															<Stack spacing={1} direction={"column"}>
																<Button
																	type="button"
																	variant="contained">
																	<a href={lesson.worksheet_detail.worksheet_url} target="_blank" rel="noopener noreferrer">
																		Lesson Worksheet
																	</a>
																</Button>
															</Stack>
														</CardActions>
													)
												}
											</Grid>
										</Grid>
									</Card>
								</Grid>
							)
						}) : null
					}
					{
						!lessonData || lessonData.length <= 0 ? (
							<Grid item md={12} sm={12} xs={12}>
								<EmptyState />
							</Grid>
						) : null
					}
				</Grid>
			</Container>

		</main>
	);
}

export default React.memo(AllLessonLayout);
