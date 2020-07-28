import React, { useState, useContext, useEffect } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { Leftovers } from "../Leftovers/Leftovers";
import { UserContext } from "../App";
import styled, { keyframes } from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { centerContent, cb } from "../utils";
import { Loading } from "../Loading";
import { useMail } from "../reducers/mail";
import { GrSend } from "react-icons/gr";
import { FiSend } from "react-icons/fi";

export const DeclutterRouter = () => {
  const [currStage, setCurrStage] = useState<"stage1" | "stage2" | "success!">(
    "stage1"
  );
  const [gameTime, setGameTime] = useState<boolean>(false);
  const location = useLocation();
  const userCtx = useContext(UserContext);
  const { mail } = useMail();
  const handleGameTime = cb(() => setGameTime(true), []);

  useEffect(() => {
    if (!mail) return; // wait for mail fetch
    // get all the email senders
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
      setCurrStage("stage2");
    }
  }, [mail]);

  // Let's start of which just direct towards MD or leftovers
  let stageToDisplay;
  if (!userCtx.loggedIn) {
    stageToDisplay = (
      <Redirect
        to={{ pathname: "/login", state: { referrer: location.pathname } }}
      />
    );
  } else if (!gameTime) {
    stageToDisplay = <Loading onGameTime={handleGameTime} />;
  } else {
    switch (currStage) {
      case "stage1":
        /**
         * location.pathname = /declutter/mass-destruction
         * urlPieces = ["", "declutter", "mass-destruction"]
         */
        const urlPieces = location.pathname.split("/");
        stageToDisplay =
          urlPieces.length > 3 && urlPieces[2] === "mass-destruction" ? ( // Pre-existing path in the address bar. Use it.
            <Redirect to={location} />
          ) : (
            <Redirect
              key={location.pathname}
              to="/declutter/mass-destruction"
            />
          );
        break;
      case "stage2":
        stageToDisplay = (
          <Redirect key={location.pathname} to="/declutter/leftovers" />
        );
        break;
      case "success!":
        stageToDisplay = (
          <Redirect key={location.pathname} to="/declutter/success" />
        );
        break;
    }
  }

  const routes = (
    <Switch>
      <Route
        path="/declutter/mass-destruction/destroy"
        component={DestroyVictim}
      />
      <Route path="/declutter/mass-destruction">
        <Stage1 />
      </Route>
      <Route path="/declutter/leftovers">
        <Stage2 />
      </Route>
      <Route path="/declutter/success">
        <Success />
      </Route>
    </Switch>
  );

  return (
    <>
      {stageToDisplay}
      {mail && routes}
    </>
  );
};

const Stage1 = ({}) => {
  const [introComplete, setIntroComplete] = useState<boolean>(
    sessionStorage.getItem("stage1IntroComplete") === "true"
  );
  const compToDisplay = introComplete ? (
    <ChooseVictim />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle
        onFinish={() => {
          setIntroComplete(true);
          sessionStorage.setItem("stage1IntroComplete", "true");
        }}
      >
        <StylishItem>
          <Text>Stage I:</Text>
        </StylishItem>
        <StylishItem>
          <Text>Mass Destruction</Text>
        </StylishItem>
      </ShowTextWithStyle>
    </StageIntroContainer>
  );

  return <>{compToDisplay}</>;
};

const Stage2 = ({}) => {
  const [introComplete, setIntroComplete] = useState<boolean>(
    sessionStorage.getItem("stage2IntroComplete") === "true"
  );
  const compToDisplay = introComplete ? (
    <Leftovers />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle
        onFinish={() => {
          setIntroComplete(true);
          sessionStorage.setItem("stage2IntroComplete", "true");
        }}
      >
        <StylishItem>
          <Text>Stage II:</Text>
        </StylishItem>
        <StylishItem>
          <Text>Leftovers</Text>
        </StylishItem>
      </ShowTextWithStyle>
    </StageIntroContainer>
  );

  return <>{compToDisplay}</>;
};

const Success = () => {
  return (
    <StageIntroContainer>
      <ShowTextWithStyle>
        <StylishItem>
          <Smiley>: )</Smiley>
        </StylishItem>
        <StylishItem>
          <Text>Congratulations!</Text>
        </StylishItem>
        <StylishItem>
          <Text>Your life just got a little cleaner.</Text>
        </StylishItem>
        <StylishItem>
          <Text>The author wants to hear from you. Leave a message.</Text>
        </StylishItem>
        <MessageBox />
      </ShowTextWithStyle>
      <Background />
    </StageIntroContainer>
  );
};

const MessageBox = () => {
  return (
    <MessageBoxContainer>
      <MessageBoxInput placeholder="Anything at all..." />
      <SendIcon />
    </MessageBoxContainer>
  );
};

const SendIcon = styled(FiSend)`
  color: white;
  font-size: 7rem;
  margin-left: 3rem;

  transition: transform 0.2s ease-out;
  &:hover {
    transform: scale(1.15);
  }
`;

const MessageBoxInput = styled.textarea`
  width: 50%;
  height: 100%;
  border: none;
  border-radius: 30px;
  font-size: 5rem;
  resize: none;
  margin-left: 10rem;
`;
const MessageBoxContainer = styled.div`
  ${centerContent}
  height: 21rem;
  width: 100%;
`;

const StageIntroContainer = styled.div`
  ${centerContent}
  width: 100%;
  height: 100%;
`;

const Zoom = keyframes`
0%{
  
  transform: scale(0);
}

100%{
  transform: scale(12.5);
}
`;

const Background = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(
    circle closest-side,
    rgba(132, 17, 255, 1) 0%,
    rgba(233, 63, 251, 1) 16%,
    rgba(255, 247, 0, 1) 42%,
    rgba(255, 34, 0, 1) 69%,
    rgba(252, 70, 107, 0) 100%
  );
  top: 0;
  left: 0;
  z-index: -1;
  animation: ${Zoom} 1.5s ease-out forwards;
`;

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
  /* background-attachment: fixed;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text; */
  color: white;
`;

const Smiley = styled(Text)`
  ${centerContent}
  transform: rotate(90deg);
  font-size: 25rem;
  line-height: 20rem;
  margin-left: 8rem;
`;
