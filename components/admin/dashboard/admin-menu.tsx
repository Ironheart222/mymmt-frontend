import { ChartBar as ChartBarIcon } from "../../../icons/chart-bar";
import { ShoppingBag as ShoppingBagIcon } from "../../../icons/shopping-bag";
import { Users as UsersIcon } from "../../../icons/users";
import { CalendarTodayRounded, Report } from "@mui/icons-material";
import { Stage2 } from "../../../icons/stage-2";
import { Stage3 } from "../../../icons/stage-3";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Subscription } from "../../../icons/subscription";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const menuItems = [
  {
    href: "/admin/dashboard",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/admin/parent-management",
    icon: <UsersIcon fontSize="small" />,
    title: "Parent Management",
  },
  {
    href: "/admin/lesson-management",
    icon: <SchoolIcon fontSize="small" />,
    title: "Lesson Management",
    children: [
      {
        href: "/admin/lesson-management/stage-2",
        icon: <Stage2 fontSize="small" />,
        title: "Stage 2",
      },
      {
        href: "/admin/lesson-management/stage-3",
        icon: <Stage3 fontSize="small" />,
        title: "Stage 3",
      },
      {
        href: "/admin/lesson-management/core-concepts-stage-2",
        icon: <PlayCircleIcon fontSize="small" />,
        title: "Core Concepts Stage 2",
      },
      {
        href: "/admin/lesson-management/core-concepts-stage-3",
        icon: <PlayCircleIcon fontSize="small" />,
        title: "Core Concepts Stage 3",
      },
      {
        href: "/admin/lesson-management/top-20-challenges-stage-2",
        icon: <PictureAsPdfIcon fontSize="small" />,
        title: "Top 20 challenges Stage 2",
      },
      {
        href: "/admin/lesson-management/top-20-challenges-stage-3",
        icon: <PictureAsPdfIcon fontSize="small" />,
        title: "Top 20 challenges Stage 3",
      },
      {
        href: "/admin/lesson-management/category-list",
        icon: <FormatListBulletedIcon fontSize="small" />,
        title: "Category List",
      },
    ],
  },
  {
    href: "/admin/plan-management",
    icon: <Subscription fontSize="small" />,
    title: "Plan Management",
  },
  {
    href: "/admin/discount-code",
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Discount Code",
  },
  {
    href: "/admin/payment-management",
    icon: <PaymentsIcon fontSize="small" />,
    title: "Payment Management",
  },
  {
    href: "/admin/reports",
    icon: <AssessmentRoundedIcon fontSize="small" />,
    title: "Reports",
    children: [
      {
        href: "/admin/reports/member-report",
        icon: <AssignmentIcon fontSize="small" />,
        title: "New Member Report",
      },
      {
        href: "/admin/reports/revenue-report",
        icon: <AssignmentIcon fontSize="small" />,
        title: "Revenue Report",
      },
    ],
  },
  {
    href: "/admin/parent-resources",
    icon: <CalendarTodayRounded fontSize="small" />,
    title: "Parent Resources",
  },
  // {
  //   href: '/admin/plan-management',
  //   icon: (<UserIcon fontSize="small" />),
  //   title: 'Plan Management'
  // },
  // {
  //   href: '/admin/reports',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Reports'
  // },
  // {
  //   href: '/admin/discount-code',
  //   icon: (<LockIcon fontSize="small" />),
  //   title: 'Discount Code'
  // },
  // {
  //   href: '/admin/calender',
  //   icon: (<UserAddIcon fontSize="small" />),
  //   title: 'Calender'
  // },
];
