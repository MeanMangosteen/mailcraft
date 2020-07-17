import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import QueryString from "query-string";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { api } from "./utils";

const OAuth = () => {
  const location = useLocation();
  const queryParams = QueryString.parse(location.search);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [cookies, setCookies] = useCookies();

  useEffect(() => {
    api
      .post("/OAuthConfirm", {
        code: queryParams.code,
      })
      .then(() => {
        setShouldRedirect(true);
        setCookies("logged_in", true, { path: "/" });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, [queryParams.code]);

  return (
    <div>{shouldRedirect ? <Redirect to={cookies.redirect} /> : null}</div>
  );
};

export { OAuth };
