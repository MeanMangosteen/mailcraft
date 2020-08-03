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
  stage: "mass destruction" | "leftovers" | "success!";
  readMail: (
    uids: string[],
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  spamMail: (
    uids: string[],
    mailbox?: string,
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  trashMail: (
    uids: string[],
    mailbox?: string,
    callback?: ((err: Error | null) => void) | undefined
  ) => void;
  fetchMail: () => void;
  leftovers: {
    undoLastOp: () => void;
    deathToll: number;
  };
};
export const useMail = (): MailHookReturnType => {
  const { state, dispatch } = useContext(MailContext);
  const userCtx = useContext(UserContext);
  const [startFetch, setStartFetch] = useState<boolean>(false);
  const [currStage, setCurrStage] = useState<MailHookReturnType["stage"]>(
    "mass destruction"
  );

  const fetchMail = useCallback(() => {
    setStartFetch(true);
  }, []);

  useEffect(() => {
    if (!state.totalUnread) return; // We need this. We shall be patient.
    if (state.fetchProgress < state?.totalUnread) return; // Wait for all mail to fetch. We shall be patient

    const mail = state.mail!;
    // Get all the email senders
    const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
    // Tally the no. emails sent by each sender
    const count = {};
    senders.map((m) => {
      if (count[m]) {
        count[m]++;
      } else {
        count[m] = 1;
      }
    });

    // if all senders have a count of 3 or less move to the leftovers stage
    let massDestructionComplete = true;
    Object.values(count).forEach((count: any) => {
      if (count > 3) massDestructionComplete = false;
    });

    if (!mail.length) {
      // We've addressed all the mail
      setCurrStage("success!");
    } else if (massDestructionComplete) {
      setCurrStage("leftovers");
    }
  }, [state.mail]);

  const undoLastOp = useCallback(() => {
    dispatch({ type: "userScrewedUp" });
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
      dispatch({
        type: "remove",
        uids,
        preserveCorpse: currStage === "leftovers",
        causeOfDeath: "read",
      });
    },
    [dispatch, currStage]
  );

  const trashMail = useCallback(
    (
      uids: string[],
      mailbox?: string,
      callback?: (err: Error | null) => void
    ) => {
      api
        .post("/trash-mail", { uids, mailbox })
        .then(() => {
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
      dispatch({
        type: "remove",
        uids,
        preserveCorpse: currStage === "leftovers",
        causeOfDeath: "trash",
      });
    },
    [dispatch, currStage]
  );

  const spamMail = useCallback(
    (
      uids: string[],
      mailbox?: string,
      callback?: (err: Error | null) => void
    ) => {
      api
        .post("/spam-mail", { uids, mailbox })
        .then(() => {
          callback && callback(null);
        })
        .catch((err) => {
          callback && callback(err);
        });
      dispatch({
        type: "remove",
        uids,
        preserveCorpse: currStage === "leftovers",
        causeOfDeath: "spam",
      });
    },
    [dispatch, currStage]
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
    if (state.isFetching) return;
    if (state.fetchProgress === state.totalUnread) return; // We've fetched all there is to fetch

    // Now fetch those uids in chuncks
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
    stage: currStage,
    fetchMail,
    readMail,
    spamMail,
    trashMail,
    leftovers: {
      undoLastOp,
      deathToll: state.mailMorgue.length,
    },
  };
};

type MailState = {
  mail?: any[];
  mailMorgue: any[];
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
  | {
      type: "remove";
      uids: string[];
      preserveCorpse?: boolean;
      causeOfDeath: "read" | "spam" | "trash";
    }
  | { type: "userScrewedUp" };

export const MailProvider = ({ children }) => {
  const [mailState, dispatch] = useReducer(reducer, {
    userProgress: 0,
    fetchProgress: 0,
    isFetching: false,
    mailMorgue: [],
  });

  return (
    <MailContext.Provider value={{ state: mailState, dispatch }}>
      {children}
    </MailContext.Provider>
  );
};

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
      let ohThePoorThings: any[] = [];
      const filtered = state.mail!.filter((mail) => {
        const bitesDust = action.uids.includes(mail.uid);
        if (bitesDust) {
          mail.causeOfDeath = action.causeOfDeath;
          ohThePoorThings.push(mail);
        }
        return !bitesDust; // We only want the good crop
      });

      return {
        ...state,
        mail: filtered,
        userProgress:
          state.userProgress + (state.mail!.length - filtered.length),
        mailMorgue: action.preserveCorpse
          ? [...ohThePoorThings, ...state.mailMorgue]
          : state.mailMorgue,
      };
    case "userScrewedUp":
      const luckyBastard = state.mailMorgue[0];
      return {
        ...state,
        mail: [luckyBastard, ...state.mail!],
        mailMorgue: [...state.mailMorgue.slice(1)],
        userProgress: state.userProgress - 1,
      };
    default:
      throw Error("Something bad has happend, I have no idea why...Good luck!");
  }
};
