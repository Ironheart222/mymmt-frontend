import React from "react";
import { useRouter } from "next/router";

const parentRoutes = [
  "/parentportal",
  "/parentportal/subscription-plan",
  "/parentportal/affiliate",
  "/parentportal/payment-method",
  "/parentportal/resources",
  "/parentportal/resource-detail",
];

const signUpRoutes = ["/signup1", "/signup2", "/#!/signup1", "/#!/signup2"];

const Auth = (WrappedComponent: any) => {
  return (props: any) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const accessToken = localStorage.getItem("user_token");
      const childId = localStorage.getItem("child_id");
      const isChild = localStorage.getItem("is_child");
      const pathName = window.location.pathname;

      const slicedString = pathName.substring(
        0,
        pathName.lastIndexOf("/") ? pathName.lastIndexOf("/") : pathName.length
      );
      // console.log("slicedString", slicedString);

      // If there is no access token we redirect to "/" page.
      if (!accessToken) {
        Router.replace("/");
        return null;
      } else if (isChild === "false" && !parentRoutes.includes(slicedString)) {
        Router.replace("/parentportal");
        return null;
      } else if (
        isChild === "true" &&
        !childId &&
        window.location.pathname !== "/select-profile" &&
        window.location.pathname !== "/termsandconditions" &&
        window.location.pathname !== "/privacypolicy" &&
        window.location.pathname !== "/#!/termsandconditions" &&
        window.location.pathname !== "/#!/privacypolicy" &&
        !parentRoutes.includes(slicedString) &&
        !signUpRoutes.includes(slicedString)
      ) {
        Router.replace("/select-profile");
        return null;
      }
      console.log("auth.tsx: line no 35");
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default Auth;
