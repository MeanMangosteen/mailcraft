import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import QueryString from "query-string";
import Axios from "axios";
import { useCookies } from "react-cookie";

const OAuth = () => {
  const location = useLocation();
  const queryParams = QueryString.parse(location.search);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [cookies, setCookies] = useCookies();

  useEffect(() => {
    Axios.post("http://localhost:4000/OAuthConfirm", {
      code: queryParams.code,
    })
      .then(() => {
        setShouldRedirect(true);
        setCookies("logged_in", true);
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
