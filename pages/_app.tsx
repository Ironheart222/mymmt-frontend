import '../styles/globals.scss';
import '../styles/custom-pages.scss';
import '../styles/lesson_library.scss';
import '../styles/lesson_vault.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import 'react-quill/dist/quill.snow.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../config/theme_config';
import { NextPage } from 'next';
import { Store } from 'redux';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { ApolloProvider } from '@apollo/client';
import store, { useAppDispatch, useAppSelector } from '../store/store';
import { Router, useRouter } from 'next/router'
import {
	notificationClear
} from '../store/slices/notificationSlice';
import Notification from '../components/notification';
import { UserType } from '../store/Interface';
import { setLoading } from '../store/slices/loadingSlice';
import { Backdrop } from '@mui/material';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { HistoryProvider } from '../config/history';

type NextPageWithLayout = NextPage & {
	getLayout?: (page: React.ReactElement) => React.ReactNode;
};
type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

interface NotificationType {
	message: string;
	status: boolean;
	type: string;
}

const initialState: NotificationType = {
	message: "",
	status: false,
	type: ""
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const router = useRouter();
	console.log("router.asPath", router.asPath);
	
	const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];
	console.log("path", path);
	
	if (path) {
		console.log("path is exist", path);
		// remove (#!) from the URL
		router.replace(path);
		console.log("after replace url", path);
		
	}
	
	//routing app
	const dispatch = useAppDispatch();
	let notificationInfo = useAppSelector((state) => state.notificationReducer);
	let loadingInfo = useAppSelector((state) => state.loadingReducer);
	let { userClient, adminClient, userType } = useAppSelector((state) => state.apolloClientReducer);

	const [notificationData, setNotificationData] = useState<NotificationType>(initialState);

	const getLayout = Component.getLayout || ((page: any) => page)

	const clearNotificationMsg = () => {
		setTimeout(() => {
			dispatch(notificationClear());
		}, 3000);
		return true;
	};

	useEffect(() => {
		if (notificationInfo) {
			setNotificationData(notificationInfo);
		}
	}, [notificationInfo]);

	Router.events.on('routeChangeStart', (url) => {
		dispatch(setLoading(true));
	})
	Router.events.on('routeChangeComplete', () => {
		dispatch(setLoading(false))
	})
	Router.events.on('routeChangeError', () => dispatch(setLoading(false)))

	return (
		<>
			<Provider store={store}>
				<Script src="https://player.vdocipher.com/playerAssets/1.6.10/vdo.js"></Script>
				<ThemeProvider theme={mdTheme}>
					<ApolloProvider client={userType == UserType.USER ? userClient : adminClient}>
						{notificationData?.message && (
							<>
								<Notification
									msg={notificationData?.message}
									status={
										notificationData?.status
											? 'success'
											: 'error'
									}
								/>
								{clearNotificationMsg()}
							</>
						)}
						{loadingInfo.isLoading && (
							<div className="loader">
								<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingInfo.isLoading} >
									<div className="balls">
										<div className="ball one"></div>
										<div className="ball two"></div>
										<div className="ball three"></div>
									</div>
								</Backdrop>
							</div>
						)}
						<HistoryProvider>
							{getLayout(<Component {...pageProps} />)}
						</HistoryProvider>
					</ApolloProvider>
				</ThemeProvider>
			</Provider>
		</>
	);
}

//makeStore function that returns a new store for every request
const makeStore: MakeStore<Store<Object>> = () => store;
const wrapper = createWrapper(makeStore);

//withRedux wrapper that passes the store to the App Component
export default wrapper.withRedux(MyApp);
