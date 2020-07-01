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
]> = React.createContext([null, (action) => {}]); // initial value of [state, dispatchFn]

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
    (uids: string[], callback?: (err: Error | null) => void) => {
      axios
        .post("http://localhost:4000/read-mail", { uids })
        .then(() => {
          callback && callback(null);
          // remove mail from state
          dispatch({ type: "remove", uids });
        })
        .catch((err) => {
          callback && callback(err);
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

  return {
    mail: state?.mail,
    info: state?.info,
    setMail,
    readMail,
    spamMail,
    trashMail,
  };
};

export const MailProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "store":
        return {
          mail: action.mail,
          info: {
            total: action.mail.length,
            read: 0,
          },
        };
      case "remove":
        const filtered = state.mail.filter((mail) => {
          return !action.uids.includes(mail.uid);
        });

        // Get all mail which isn't in the uid array
        return {
          mail: filtered,
          info: {
            ...state.info,
            read: state.info.read + (state.mail.length - filtered.length),
          },
        };
      default:
        throw Error(
          "Something bad has happend, I have no idea why...Good luck!"
        );
    }
  };

  const [mailState, dispatch] = useReducer<any>(reducer, null);

  return (
    <MailContext.Provider value={[mailState, dispatch]}>
      {children}
    </MailContext.Provider>
  );
};
