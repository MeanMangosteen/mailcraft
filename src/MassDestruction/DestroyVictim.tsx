import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import queryString from "query-string";
import { useMail } from "../reducers/mail";
import styled, { css } from "styled-components";
import { MailCard } from "./MailCard";
import { RiSpam2Line } from "react-icons/ri";
import { AiOutlineRead } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { centerContent } from "../utils";
import { Loading } from "../Loading";

// TODO: come back to page based scrolling
export const DestroyVictim = () => {
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail, readMail, spamMail, trashMail } = useMail();
  const [victimEmails, setVictimEmails] = useState<any[]>([]);
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [selected, setSelected] = useState<Object>({});
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);
  const [opInProgress, setOpInProgress] = useState<boolean>(false);
  console.log("here");

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
              mail={mail}
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
    setOpInProgress(true);
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
      setOpInProgress(false);
    });
  };

  const handleSpam = () => {
    /** All selected emails will be marked as 'spam' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    spamMail(uids, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      setOpInProgress(false);
    });
  };

  const handleTrash = () => {
    /** All selected emails will be marked as 'trash' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    trashMail(uids, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      setOpInProgress(false);
    });
  };

  if (opInProgress) return <Loading />;
  // OMGTODO: remove slice
  return (
    <MassDestructionContainer>
      <CardsContainer>{mailPages.slice(0, 2)}</CardsContainer>
      <ControlsContainer>
        <Button
          onClick={handleSpam}
          className="something"
          style={{
            background: "hsla(35, 100%, 95%, 1)",
          }}
        >
          <SpamIcon />
          Spam
        </Button>
        <Button
          onClick={handleRead}
          style={{
            background: "hsla(178, 60%, 91%, 1)",
          }}
        >
          <ReadIcon />
          Read
        </Button>
        <Button
          onClick={handleTrash}
          style={{
            background: "hsla(350, 100%, 95%, 1)",
          }}
        >
          <TrashIcon />
          Trash
        </Button>
        <SelectedInfo
          total={victimEmails.length}
          selected={
            Object.values(selected).filter((selected) => !!selected).length
          }
        />
      </ControlsContainer>

      {missionSuccessful && <Redirect to="/declutter" />}
    </MassDestructionContainer>
  );
};

const SelectedInfo = ({ selected, total }) => {
  return (
    <SelectedInfoContainer>{`${selected}/${total} selected`}</SelectedInfoContainer>
  );
};
const SelectedInfoContainer = styled.div`
  margin-left: 2rem;
  font-weight: bold;
`;
const iconStyles = css`
  font-size: 2.8rem;
  margin-right: 1rem;
`;

const SpamIcon = styled(RiSpam2Line)`
  ${iconStyles}
`;

const ReadIcon = styled(AiOutlineRead)`
  ${iconStyles}
`;

const TrashIcon = styled(FiTrash2)`
  ${iconStyles}
  font-size: 2.5rem;
`;

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

  background: #f9f9f9;
  box-shadow: 10px 0 10px -2px #888;
  border-radius: 60% 60% 0 0;
`;

const Button = styled.div`
  ${centerContent}
  flex-basis: 15rem;

  margin: 1rem;
  padding: 1.5rem;

  background: white;
  font-weight: bold;

  border: 2px #b5b5b5 solid;
  border-radius: 20px;
  box-shadow: 0px 10px 13px -7px #000000;

  &:hover {
    transform: scale(1.05);
  }
  transition: transform 0.2s ease-in-out;
`;
