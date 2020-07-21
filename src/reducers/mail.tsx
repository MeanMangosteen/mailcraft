import React, { useContext, useReducer, useEffect, useCallback } from "react";
import { api } from "../utils";
import { UserContext } from "../App";

type MailAction = "store";

export const MailContext: React.Context<[
  any,
  (action) => void
]> = React.createContext([null, (action) => {}]); // initial value of [state, dispatchFn]

// TODO: setMail may be redundant
// TODO: rename folder to utils
export const useMail = () => {
  const [state, dispatch] = useContext(MailContext);
  const userCtx = useContext(UserContext);

  const setMail = useCallback(
    (mail) => {
      dispatch({ type: "store", mail });
    },
    [dispatch]
  );

  const readMail = useCallback(
    (uids: string[], callback?: (err: Error | null) => void) => {
      api
        .post("/read-mail", { uids })
        .then(() => {
          // remove mail from state
          dispatch({ type: "remove", uids });
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
    },
    [dispatch]
  );

  const trashMail = useCallback(
    (uids: string[], callback: (err: Error | null) => void) => {
      api
        .post("/trash-mail", { uids })
        .then(() => {
          dispatch({ type: "remove", uids });
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
    },
    [dispatch]
  );

  const spamMail = useCallback(
    (uids: string[], callback: (err: Error | null) => void) => {
      api
        .post("/spam-mail", { uids })
        .then(() => {
          dispatch({ type: "remove", uids });
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!userCtx.loggedIn) return;
    if (state?.mail) return; // We only need to run this if we're fetching for the first time

    api
      .get("/mail")
      .then((res) => {
        setMail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setMail, state]);

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
            progress: 0,
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
            progress:
              state.info.progress + (state.mail.length - filtered.length),
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
