import React, {
  useContext,
  useReducer,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  const readMail = useCallback((uids: string[]) => {
    axios
      .post("http://localhost:4000/read-mail", { uids })
      .then(() => {
        console.log("Read success");
      })
      .catch((err) => {
        console.log("Read fail");
      });
  }, []);

  const trashMail = useCallback((uids: string[]) => {
    axios
      .post("http://localhost:4000/trash-mail", { uids })
      .then(() => {
        console.log("trash success");
      })
      .catch((err) => {
        console.log("trash fail");
      });

  }, []);

  const spamMail = useCallback((uids: string[]) => {
    axios
      .post("http://localhost:4000/spam-mail", { uids })
      .then(() => {
        console.log("spam success");
      })
      .catch((err) => {
        console.log("spam fail");
      });
  }, []);
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

  return { mail: state, setMail, readMail, spamMail, trashMail };
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
