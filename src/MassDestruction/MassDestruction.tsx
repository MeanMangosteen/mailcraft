import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useMail } from "../reducers/mail";
import styled from "styled-components";
import { MailCard } from "./MailCard";

const MassDestructionContainer = styled.div`
  display: grid;
  grid-template-rows: auto 10%;
`;

const CardsContainer = styled.div`
  overflow-y: scroll;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 0 10px -2px #888;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin: 1rem;
  padding: 1.5rem;
  flex-basis: 15rem;
  font-weight: bold;
  border: 3px black solid;
`;
// TODO: come back to page based scrolling
/*
A note was the designed was.
Basically detect whether we're scrolling up or down.#
Which increments or decrements a page number
Each page of mail cards has a ref
When the page number changes, we scrollIntoView() that page ^^
*/
const MassDestruction = () => {
  // const [refs, setRefs] = useState<any[]>([]);
  // const [page, setPage] = useState<number>(0);
  // const [scrollCurr, setScrollCurr] = useState<any>(0);
  // const [scrollPrev, setScrollPrev] = useState<any>(0);
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail, readMail, spamMail, trashMail } = useMail();
  const [victimEmails, setVictimEmails] = useState<any[]>([]);
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [selected, setSelected] = useState<Object>({});

  useEffect(() => {
    // Filter all mail down to the ones from the victim
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;
    const filteredMail = mail.filter(
      (m) => m.envelope.from[0].address.split("@")[1] === qParams["victim"]
    );
    setVictimEmails(filteredMail);
    for (let i = 0; i < filteredMail.length; i++) {
      selected[i] = true;
    }
    setSelected({ ...selected });
  }, [mail]);

  useEffect(() => {
    // Use the filtered mail and convert to pages
    const newMailPages: any[] = [];
    const numMailPerPage = 9;
    for (let i = 0; i <= (victimEmails?.length || -1); i += numMailPerPage) {
      const mailCards = victimEmails
        ?.slice(i, i + numMailPerPage)
        .map((mail, idx) => {
          return (
            <MailCard
              selected={selected[i + idx]}
              index={i + idx}
              key={idx}
              subject={mail["envelope"].subject}
              html={mail["body[]"].html}
              onClick={handleCardClick}
            />
          );
        });
      // const ref = React.createRef<any>();
      // refs.push(ref);
      const page = <PageContainer /* ref={ref} */>{mailCards}</PageContainer>;
      newMailPages.push(page);
    }
    setMailPages([...newMailPages]);
    // setRefs([...refs]);
  }, [victimEmails, selected]);

  const handleCardClick = (index) => (event) => {
    console.log(index, event, "hi!");
    selected[index] = !selected[index];
    setSelected({ ...selected });
  };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  // }, []);

  // useEffect(() => {
  //   if (scrollCurr < scrollPrev) {
  //     // scrolling up
  //     setPage(page - 1);
  //   } else if (scrollCurr > scrollPrev) {
  //     // scrolling down
  //     setPage(page + 1);
  //   }
  //   setScrollPrev(scrollCurr);
  // }, [scrollCurr]);

  // useEffect(() => {
  //   // Scrolls the page into view. Has debouncing issues.
  //   console.log("page", page);
  //   refs[page]?.current.scrollIntoView({ behavior: "smooth" });
  // }, [page, refs]);

  // const handleScroll = (e) => {
  //   // note we don't have access to state here, but we can setState
  //   const window: any = e.currentTarget;

  //   setScrollCurr(window?.scrollY);
  // };

  const handleRead = () => {
    const uids = Object.keys(selected).map((idx) => {
      return victimEmails[idx].uid;
    });

    readMail(uids, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      // OMGTODO: delete the callback
    });
  };

  const handleSpam = () => {
    const uids = Object.keys(selected).map((idx) => {
      return victimEmails[idx].uid;
    });

    spamMail(uids);
  };
  const handleTrash = () => {
    const uids = Object.keys(selected).map((idx) => {
      return victimEmails[idx].uid;
    });

    trashMail(uids);
  };
  // SOTODO: remove slice
  return (
    <MassDestructionContainer>
      <CardsContainer>{mailPages.slice(0, 2)}</CardsContainer>
      <ControlsContainer>
        <Button onClick={handleRead}>Read</Button>
        <Button onClick={handleSpam}>Spam</Button>
        <Button onClick={handleTrash}>Trash</Button>
      </ControlsContainer>
    </MassDestructionContainer>
  );
};

const PageContainer = styled.div`
  /* display: flex;
  flex-wrap: wrap; */
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

export { MassDestruction };
