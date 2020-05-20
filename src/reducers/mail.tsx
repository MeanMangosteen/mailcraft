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

  const readMail = useCallback(
    (uids: string[], callback: (err: Error | null) => void) => {
      axios
        .post("http://localhost:4000/read-mail", { uids })
        .then(() => {
          callback(null);
          // remove mail from state
          dispatch({ type: "remove", uids });
        })
        .catch((err) => {
          callback(err);
        });
    },
    []
  );

  const trashMail = useCallback((uids: string[]) => {
    axios
      .post("http://localhost:4000/trash-mail", { uids })
      .then(() => {
        dispatch({ type: "remove", uids });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const spamMail = useCallback((uids: string[]) => {
    axios
      .post("http://localhost:4000/spam-mail", { uids })
      .then(() => {
        dispatch({ type: "remove", uids });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    if (!cookies.logged_in) return;
    if (state) return; // We only need to run this if we're fetching for the first time

    axios
      .get("http://localhost:4000/mail")
      .then((res) => {
        setMail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cookies]);

  return { mail: state, setMail, readMail, spamMail, trashMail };
};
export const MailProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "store":
        return action.mail;
      case "remove":
        // Get all mail which isn't in the uid array
        return state.filter((mail) => {
          return !action.uids.includes(mail.uid);
        });
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
