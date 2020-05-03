import React, { useContext, useReducer, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
// import { MailContext } from "../App";

type MailAction = "store";

export const MailContext: React.Context<[
  any,
  (action) => void
]> = React.createContext([null, (action) => {}]);

// TODO: setMail may be redundant
// TODO: rename folder to utils
export const useMail = () => {
  const [state, dispatch] = useContext(MailContext);
  const [cookies] = useCookies();

  const setMail = useCallback(
    (mail) => {
      dispatch({ type: "store", mail });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!cookies.logged_in) return;

    axios
      .get("http://localhost:4000/mail")
      .then((res) => {
        setMail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cookies.logged_in, setMail]);

  return { mail: state, setMail };
};
export const MailProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "store":
        return action.mail;
      default:
        throw Error(
          "Something bad has happend, I have no idea why...Good luck!"
        );
    }
  };

  const [mailState, dispatch] = useReducer(reducer, null);

  return (
    <MailContext.Provider value={[mailState, dispatch]}>
      {children}
    </MailContext.Provider>
  );
};
