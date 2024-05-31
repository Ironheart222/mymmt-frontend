import * as React from 'react';
import { Box, Button, Container, CssBaseline, Stack } from '@mui/material';
import Router from "next/router";
import Topbar from '../components/header/topbar';
import Auth from "../config/auth";
import { useAppDispatch, useAppSelector } from '../store/store';
import { getCurrWeekLesson } from '../store/thunk/lessonThunk';
import { ApolloClientType, WeeklyLessonData } from '../store/Interface';
import { userLogout } from '../helpers/helper';
import WeekLessonLayout from '../components/lesson/week-lesson-layout';
import { logout } from '../store/slices/userSlice';

function Dashboard() {
	
	const dispatch = useAppDispatch();
	const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
	const { currWeeklessonData } = useAppSelector((state) => state.childLessonReducer);
	let [currWeekLesson, setCurrWeekLesson] = React.useState<WeeklyLessonData>({
		week_no: 0,
		lesson: []
	});

	React.useEffect(() => {
		let child_id = localStorage.getItem('child_id');
		if (child_id) {
			dispatch(getCurrWeekLesson({ _request: child_id, userClient }));
		} else {
			// userLogout();
			dispatch(logout());
			Router.replace("/");
		}
	}, []);

	React.useEffect(() => {
		setCurrWeekLesson(currWeeklessonData?.data);
	}, [currWeeklessonData]);

	return (
		<Box>
			<CssBaseline />
			<Topbar id={1} />
			{/* <Box>
				{
					currWeekLesson && (
						<WeekLessonLayout
							className={'main-content'}
							selectedWeek={currWeekLesson.week_no} />
					)
				}
			</Box> */}
		</Box>
	);
}

export default Auth(Dashboard);
