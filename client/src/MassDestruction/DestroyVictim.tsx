import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Redirect } from "react-router-dom";
import queryString from "query-string";
import { useMail } from "../reducers/mail";
import styled, { css } from "styled-components";
import { RiSpam2Line } from "react-icons/ri";
import { AiOutlineRead } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { centerContent, CSSDividerBottom } from "../utils";
import { ToggleViewIcon } from "./ToggleViewIcon";
import { GridView } from "./GridView";
import { ListView } from "./ListView";

export const DestroyVictim = () => {
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail, readMail, spamMail, trashMail } = useMail();
  const [victimEmails, setVictimEmails] = useState<any[]>([]);
  const [selected, setSelected] = useState<Object>({});
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    /**
     * We have the victim. Filter the mail to get all the mail from that victim only
     */
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;
    const filteredMail = mail.filter(
      (m) => m["body[]"].from.value[0].address.split("@")[1] === qParams["victim"]
    );
    setVictimEmails(filteredMail);
    /**
     * We had mail before and now we don't. Time to call it
     * mission successful and move on to our next victim.
     */
    if (!filteredMail.length) setMissionSuccessful(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail]);

  useEffect(() => {
    // Set all card to be initially selected
    const newSelected = {};
    for (let i = 0; i < victimEmails.length; i++) {
      newSelected[i] = true;
    }
    setSelected({ ...newSelected });
  }, [victimEmails]);

  const handleCardClick = useCallback(
    (index) => () => {
      // Toggle card selected state
      selected[index] = !selected[index];
      setSelected({ ...selected });
    },
    [selected]
  );

  const handleRead = useCallback(() => {
    /** All selected emails will be marked as 'read' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    readMail(uids, false, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }, [readMail, selected, victimEmails]);

  const handleSpam = useCallback(() => {
    /** All selected emails will be marked as 'spam' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    spamMail(uids, false, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }, [selected, spamMail, victimEmails]);

  const handleTrash = useCallback(() => {
    /** All selected emails will be marked as 'trash' */
    const uids = Object.keys(selected)
      .filter((cardIdx) => selected[cardIdx])
      .map((cardIdx) => {
        return victimEmails[cardIdx].uid;
      });

    trashMail(uids, false, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }, [selected, trashMail, victimEmails]);

  return (
    <MassDestructionContainer>
      <SenderContainer>
        <SenderText>{qParams["victim"]}</SenderText>
      </SenderContainer>
      {view === "list" ? (
        <ListView
          victimEmails={victimEmails}
          onItemClick={handleCardClick}
          selected={selected}
        />
      ) : (
        <GridView
          victimEmails={victimEmails}
          onCardClick={handleCardClick}
          selected={selected}
        />
      )}
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
        <Peripherals>
          <SelectedInfo
            total={victimEmails.length}
            selected={
              Object.values(selected).filter((selected) => !!selected).length
            }
          />
          <ToggleViewIcon
            onClick={() => setView(view === "list" ? "grid" : "list")}
          />
        </Peripherals>
      </ControlsContainer>

      {missionSuccessful && <Redirect to="/declutter" />}
    </MassDestructionContainer>
  );
};

const SenderContainer = styled.div`
  ${centerContent}
  font-size: 2rem;
  position: absolute;
  ${CSSDividerBottom({ width: "30%", IHaveSetRelativePosition: true })}
  left: 50%;
  top: 0;

  box-shadow: 0px 0 10px 0px #888;
  border-radius: 0% 0% 100% 100%;
  width: 50%;
  z-index: 2;
  transform: translateX(-50%);
  border-radius: 0px 0px 100px 100px;
  background: white;
  border: 1px solid #adadad;
`;

const SenderText = styled.div`
  max-width: 80vw;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  font-weight: bold;
`;

const Peripherals = styled.div`
  position: relative;
`;

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

const MassDestructionContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 90% 10%;
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
