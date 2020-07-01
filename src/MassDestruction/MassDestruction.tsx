import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import queryString from "query-string";
import { useMail } from "../reducers/mail";
import styled from "styled-components";
import { MailCard } from "./MailCard";

// TODO: come back to page based scrolling
const MassDestruction = () => {
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail, readMail, spamMail, trashMail, info } = useMail();
  const [victimEmails, setVictimEmails] = useState<any[]>([]);
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [selected, setSelected] = useState<Object>({});
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);

  console.log("mail info", info);

  useEffect(() => {
    /**
     * We have the victim. Filter the mail to get all the mail from that victim only
     */
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;
    const filteredMail = mail.filter(
      (m) => m.envelope.from[0].address.split("@")[1] === qParams["victim"]
    );
    setVictimEmails(filteredMail);
  }, [mail]);

  useEffect(() => {
    /**
     * Go from victim's emails' html to actual components.
     *
     * We were going to implement page based scrolling
     * once upon a time. The assorting of mailcard into pages
     * is a artefact of that.
     */
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
      const page = <PageContainer>{mailCards}</PageContainer>;
      newMailPages.push(page);
    }

    /**
     * We had mail before and now we don't. Time to call it
     * mission successful and move on to our next victim.
     */
    if (mailPages.length && !newMailPages.length) setMissionSuccessful(true);
    setMailPages([...newMailPages]);
  }, [victimEmails, selected]);

  useEffect(() => {
    // Set all card to be initially selected
    const newSelected = {};
    for (let i = 0; i < victimEmails.length; i++) {
      newSelected[i] = true;
    }
    setSelected({ ...newSelected });
  }, [victimEmails]);

  const handleCardClick = (index) => (event) => {
    // Toggle card selected state
    selected[index] = !selected[index];
    setSelected({ ...selected });
  };

  const handleRead = () => {
    /** All selected emails will be marked as 'read' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
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
    /** All selected emails will be marked as 'spam' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    spamMail(uids);
  };

  const handleTrash = () => {
    /** All selected emails will be marked as 'trash' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    trashMail(uids);
  };

  // OMGTODO: remove slice
  return (
    <MassDestructionContainer>
      <CardsContainer>{mailPages.slice(0, 2)}</CardsContainer>
      <ControlsContainer>
        <Button onClick={handleRead}>Read</Button>
        <Button onClick={handleSpam}>Spam</Button>
        <Button onClick={handleTrash}>Trash</Button>
      </ControlsContainer>

      {missionSuccessful && <Redirect to="/declutter" />}
    </MassDestructionContainer>
  );
};

const PageContainer = styled.div`
  display: grid;
  grid-gap: 2rem 6rem;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

const MassDestructionContainer = styled.div`
  display: grid;
  grid-template-rows: auto 10%;
`;

const CardsContainer = styled.div`
  overflow-y: scroll;
  > * {
    flex: 0 0 32%;
  }
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

export { MassDestruction };
