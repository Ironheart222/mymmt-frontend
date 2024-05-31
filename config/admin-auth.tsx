// HOC/withAuth.jsx
import React from 'react'
import { useRouter } from "next/router";

const AdminAuth = (WrappedComponent:any) => {
  return (props :any) => {
      
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const accessToken = localStorage.getItem("admin_token");
      
      // If there is no access token we redirect to "/" page.
      if (!accessToken) {
        Router.replace("/adminlogin");
        return null;
      } 

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default AdminAuth;