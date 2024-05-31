import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GraphQLScalarType } from "graphql";

export interface ResponseData {
  status: String;
  messagecode: String;
  message: String;
  data: any;
}

export interface ParentParam {
  parent_id: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email: string;
  street_1: string;
  street_2: string;
  apartment_no: string;
  suburb: string;
  country_code: string;
  country: string;
  state: string;
  is_active: boolean;
  is_delete: boolean;
  is_varified: boolean;
  postal_code: string;
  product?: any;
  subscription_detail?: SubscriptionMaster[];
}
export interface ApolloClientType {
  userClient: ApolloClient<NormalizedCacheObject>;
  adminClient: ApolloClient<NormalizedCacheObject>;
  uploadClient: ApolloClient<NormalizedCacheObject>;
}
export interface ThunkParam {
  _request: any;
  userClient: ApolloClient<NormalizedCacheObject>;
}

export interface ModelThunkParam {
  _request: any;
  uploadClient: ApolloClient<NormalizedCacheObject>;
  adminClient: ApolloClient<NormalizedCacheObject>;
  onClose: () => void;
}

export interface LoginParam {
  email_id: string;
  password: string;
}
export interface RegisterParam {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  street_1: string;
  street_2: string;
  apartment_no: string;
  suburn: string;
  country: string;
  state: string;
  postal_code: string;
  login_password: string;
  setting_password: string;
  country_code: string;
}

export interface TrialRegisterParam {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  street_1: string;
  street_2: string;
  apartment_no: string;
  suburn: string;
  country: string;
  state: string;
  postal_code: string;
  login_password: string;
  setting_password: string;
  country_code: string;
}

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface StateType {
  id: string;
  latitude: string;
  longitude: string;
  name: string;
  state_code: string;
  type: string;
}

export interface ChildParam {
  child_id: string;
  child_name: string;
  child_age: number;
  birth_date: Date;
  school_name: string;
  class_no: string;
  stage_no: number;
  gender: string;
  video_allowed_count: number;
  past_video_no: number;
  curr_video_no: number;
  last_changed_week: number;
  parent_id: number;
  profile_image_url: string;
  created_date: string;
  updated_date: string;
  file?: any;
  keep_holidays?: boolean;
}

export interface ParentSetting {
  password: string;
}

export interface LinkExpire {
  token: string;
}

export interface EmailVerification {
  token: string;
  is_verify: boolean;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  password: string;
  token: string;
  password_type?: PasswordType;
}

export enum UserType {
  ADMIN = "1",
  USER = "2",
}

export interface AdminProfile {
  name: string;
  email: string;
  password: string;
  created_date: object;
  update_date: object;
  active: boolean;
}

export interface CalendarParam {
  title: string;
  start_date: string;
  end_date: string;
}

export interface VacationList {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  year: number;
  created_date: String;
  updated_date: string;
  active: boolean;
}

export interface WorksheetParam {
  title: string;
  description: string;
  file: File;
}

export interface ResourceDocumentsParam {
  file: File;
}

export interface CoreConceptCategory {
  category_id: number;
  category_name: string;
  category_tag: string;
  is_active: boolean;
  is_delete: boolean;
  lesson_detail: any[];
}

export interface WorksheetData {
  worksheet_id: number;
  worksheet_name: string;
  worksheet_description: string;
  worksheet_url: string;
  stage_no: string;
  is_delete: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface LessonData {
  lesson_id: string;
  lesson_no: number;
  vdo_cipher_video: VideoData;
  worksheet_detail: WorksheetData;
  history_detail: [LessonHistoryData];
  category_detail: CoreConceptCategory | null;
  stage_no: number;
  created_date: Date;
  updated_date: Date;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  upload_time: string;
  length: string;
  status: string;
  public: string;
  ipGeoRules: string;
  whitelisthref: string;
  poster: string;
  tags: [];
  otp?: string;
  playbackInfo?: string;
}

export interface MappedData {
  lesson_id: string;
  video_data: JSON;
  worksheet_id: number;
  category_id: number;
  stage_no: number;
}

export interface LessonHistoryData {
  length: number;
  lesson_history_id: number;
  child_id: number;
  week_no: number;
  lesson_id: number;
  year: number;
  watched: boolean;
  created_date: Date;
  update_date: Date;
  lesson_detail: LessonData;
}

export interface WeeklyLessonData {
  week_no: number;
  lesson: [LessonData] | [];
}

export enum PasswordType {
  LOGIN_PASSWORD = "login_password",
  SETTING_PASSWORD = "setting_password",
}

export interface ParentSideBarType {
  icon: JSX.Element;
  name: string;
  subname?: string;
  href: any;
}

export interface DialogDetails {
  title: string;
  body_content: string;
  id: string;
}

export interface VideoParam {
  video_id: string;
  title: string;
  description: string;
  stage_no: string;
}

export interface SidebarData {
  stage_no: number;
  total_week: number;
  curr_week: number;
}

export interface DiscountCode {
  discount_id: string;
  plan_id: string;
  coupon_id: string;
  currency: string;
  discount_code: string;
  amount: number;
  percent: number;
  amount_type: string;
  expiry_date: string;
  redemption_limit: number;
  is_expired: boolean;
  is_active: boolean;
  is_delete: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface CouponCode {
  id: string;
  object: string;
  amount_off: number;
  created: number;
  currency: string;
  duration: string;
  duration_in_months: number;
  livemode: boolean;
  max_redemptions: number;
  metadata: {};
  name: string;
  percent_off: number;
  redeem_by: number;
  times_redeemed: number;
  valid: boolean;
}

export interface VaultVideoData {
  id: string;
  title: string;
  description: string;
  upload_time: number;
  length: number;
  status: string;
  public: number;
  ipGeoRules: null;
  whitelisthref: null;
  posters: {
    width: number;
    height: number;
    posterUrl: string;
  }[];
  poster: string;
  tags: string[];
  otp: string;
  playbackInfo: string;
}

export interface AffiliateDataType {
  referral_point: number;
  referral_link: string;
}

export interface SubscriptionMaster {
  sub_master_id: number;
  parent_id: number;
  stripe_customer_id: string;
  plan_id: string;
  subscription_id: string;
  discount_id: string;
  invoice_id: string;
  quantity: number;
}
