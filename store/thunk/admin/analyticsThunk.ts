import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationFail, notificationSuccess } from '../../slices/notificationSlice';

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { queryGetMemberReportData, queryGetNewMemberData, queryGetRevenueData, queryGetRevenueReportData } from '../../query/admin/analytics';
import { adminLogout } from '../../slices/admin/adminAuthSlice';
import { MemberData, MemberReportData, RevenueData, RevenueReportData, SetMemberLoading, SetRevenueLoading } from '../../slices/admin/anlyaticsSlice';
import { setLoading } from '../../slices/loadingSlice';

export const getRevenueData = createAsyncThunk(
    'admin/get_revenue',
    async ({ _request, adminClient, }: any, { dispatch }) => {
        await queryGetRevenueData(_request, adminClient)
            .then((res) => {
                if (res?.data?.getRevenueData.status === "true") {
                    dispatch(RevenueData(res.data.getRevenueData.data));
                } else {
                    dispatch(notificationFail(res.data.getRevenueData.message));
                }
                dispatch(SetRevenueLoading(false));
            }).catch((e: any) => {
                if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
                    dispatch(adminLogout());
                }
                dispatch(SetRevenueLoading(false));
                dispatch(notificationFail(e.message));
            })
    }
);

export const getMemberData = createAsyncThunk(
    'admin/get_member',
    async ({ _request, adminClient, }: any, { dispatch }) => {
        await queryGetNewMemberData(_request, adminClient)
            .then((res) => {
                if (res?.data?.getNewlyAddedMember.status === "true") {
                    dispatch(MemberData(res.data.getNewlyAddedMember.data));
                } else {
                    dispatch(notificationFail(res.data.getNewlyAddedMember.message));
                }
                dispatch(SetMemberLoading(false));
            }).catch((e: any) => {
                dispatch(SetMemberLoading(false));
                dispatch(notificationFail(e.message));
            })
    }
);

export const getMemberReportData = createAsyncThunk(
    'admin/get_member_report',
    async ({ _request, adminClient, }: any, { dispatch }) => {
        await queryGetMemberReportData(_request, adminClient)
            .then((res) => {
                if (res?.data?.getMemberReportData.status === "true") {
                    dispatch(MemberReportData(res.data.getMemberReportData.data));
                } else {
                    dispatch(notificationFail(res.data.getMemberReportData.message));
                }
                dispatch(setLoading(false));
            }).catch((e: any) => {
                dispatch(setLoading(false));
                dispatch(notificationFail(e.message));
            })
    }
);

export const getRevenueReportData = createAsyncThunk(
    'admin/get_revenue_report',
    async ({ _request, adminClient, }: any, { dispatch }) => {
        await queryGetRevenueReportData(_request, adminClient)
            .then((res) => {
                if (res?.data?.getRevenueReportData.status === "true") {
                    
                    dispatch(RevenueReportData(res.data.getRevenueReportData.data));
                } else {
                    dispatch(notificationFail(res.data.getRevenueReportData.message));
                }
                dispatch(setLoading(false));
            }).catch((e: any) => {
                dispatch(setLoading(false));
                dispatch(notificationFail(e.message));
            })
    }
);