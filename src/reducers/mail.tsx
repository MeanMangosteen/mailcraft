import React, {
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { api } from "../utils";
import { UserContext, UnreadUidsCtx } from "../App";

export const MailContext: React.Context<{
  state: MailState;
  dispatch: React.Dispatch<MailAction>;
}> = React.createContext({
  state: {
    userProgress: 0,
    fetchProgress: 0,
    isFetching: false,
  } as MailState,
  dispatch: ((action) => {}) as React.Dispatch<MailAction>,
});

// TODO: setMail may be redundant
// TODO: rename folder to utils
type MailHookReturnType = {
  mail?: any[];
  totalUnread?: number;
  userProgress: number;
  readMail: (
    uids: string[],
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  spamMail: (
    uids: string[],
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  trashMail: (
    uids: string[],
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  fetchMail: () => void;
};
export const useMail = (): MailHookReturnType => {
  // const [fetchInProgress, setFetchInProgress] = useState<boolean>(false);
  const { state, dispatch } = useContext(MailContext);
  const userCtx = useContext(UserContext);
  const [moreToCome, setMoreToCome] = useState<boolean>(
    state.totalUnread ? state.fetchProgress < state.totalUnread : true
  );
  const [startFetch, setStartFetch] = useState<boolean>(false);
  // const unreadUids = useContext(UnreadUidsCtx);

  const fetchMail = useCallback(() => {
    setStartFetch(true);
  }, []);

  // const setup = useCallback(
  //   (totalUnread) => {
  //     dispatch({ type: "setup", totalUnread });
  //   },
  //   [dispatch]
  // );

  const fetch = useCallback(() => {
    dispatch({ type: "fetch" });
  }, [dispatch]);

  const readMail = useCallback(
    (uids: string[], callback?: (err: Error | null) => void) => {
      api
        .post("/read-mail", { uids })
        .then(() => {
          // remove mail from state
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
      dispatch({ type: "remove", uids });
    },
    [dispatch]
  );

  const trashMail = useCallback(
    (uids: string[], callback?: (err: Error | null) => void) => {
      api
        .post("/trash-mail", { uids })
        .then(() => {
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
      dispatch({ type: "remove", uids });
    },
    [dispatch]
  );

  const spamMail = useCallback(
    (uids: string[], callback?: (err: Error | null) => void) => {
      api
        .post("/spam-mail", { uids })
        .then(() => {
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
      dispatch({ type: "remove", uids });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!startFetch) return;
    if (!userCtx.loggedIn) return;
    if (state.unreadUids) return;

    // First get uids to fetch
    api
      .get("/unreadUids")
      .then((res) => {
        // unreadUids.setUids(res.data);
        dispatch({ type: "setup", unreadUids: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userCtx.loggedIn, startFetch, state.unreadUids]);

  useEffect(() => {
    if (!startFetch) return;
    if (!state.unreadUids) return;
    // if (unreadUids.fetchProgress.isFetching) return;
    if (state.isFetching) return;
    if (state.fetchProgress === state.totalUnread) {
      setMoreToCome(false);
      return;
    }

    // Now fetch those uids in chuncks
    // unreadUids.setFetchProgress({
    //   fetched: unreadUids.fetchProgress.fetched,
    //   isFetching: true,
    // });
    // isFetching.current = true;
    dispatch({ type: "fetch" });
    api
      .get("/mail", {
        params: {
          uids: JSON.stringify(
            state.unreadUids.slice(
              state.fetchProgress,
              Math.min(state.fetchProgress + 500, state.totalUnread!)
            )
          ),
        },
      })
      .then((res) => {
        // setMail(res.data);
        // unreadUids.setFetchProgress({
        //   fetched: unreadUids.fetchProgress.fetched + res.data.length,
        //   isFetching: false,
        // });
        // isFetching.current = false;
        dispatch({ type: "store", mail: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state, startFetch]);

  return {
    mail: state?.mail,
    totalUnread: state.totalUnread,
    userProgress: state.userProgress,
    fetchMail,
    readMail,
    spamMail,
    trashMail,
  };
};

type MailState = {
  mail?: any[];
  totalUnread?: number;
  userProgress: number;
  fetchProgress: number;
  isFetching: boolean;
  unreadUids?: number[];
};

type MailAction =
  | {
      type: "setup";
      unreadUids: number[];
    }
  | { type: "fetch" }
  | { type: "store"; mail: any[] }
  | { type: "remove"; uids: string[] };

export const MailProvider = ({ children }) => {
  const unreadUids = useContext(UnreadUidsCtx);

  const reducer = (state: MailState, action: MailAction): MailState => {
    switch (action.type) {
      case "setup":
        return {
          ...state,
          userProgress: 0,
          totalUnread: action.unreadUids.length,
          unreadUids: action.unreadUids,
        };
      case "fetch":
        return { ...state, isFetching: true };
      case "store":
        return {
          ...state,
          mail: state?.mail ? state.mail.concat(action.mail) : action.mail,
          fetchProgress: state.fetchProgress + action.mail.length,
          isFetching: false,
        };
      case "remove":
        const filtered = state.mail!.filter((mail) => {
          return !action.uids.includes(mail.uid);
        });

        return {
          ...state,
          mail: filtered,
          userProgress:
            state.userProgress + (state.mail!.length - filtered.length),
        };
      default:
        throw Error(
          "Something bad has happend, I have no idea why...Good luck!"
        );
    }
  };

  const [mailState, dispatch] = useReducer(reducer, {
    userProgress: 0,
    fetchProgress: 0,
    isFetching: false,
  });

  return (
    <MailContext.Provider value={{ state: mailState, dispatch }}>
      {children}
    </MailContext.Provider>
  );
};
