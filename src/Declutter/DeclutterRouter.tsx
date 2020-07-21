import React, { useState, useContext, useEffect } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { Leftovers } from "../Leftovers/Leftovers";
import { UserContext } from "../App";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { centerContent } from "../utils";
import { Loading } from "../Loading";
import { useMail } from "../reducers/mail";

export const DeclutterRouter = () => {
  const [currStage, setCurrStage] = useState<"stage1" | "stage2" | "success!">(
    "stage1"
  );
  const location = useLocation();
  const userCtx = useContext(UserContext);
  const { mail } = useMail();

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
  } else if (!mail) {
    stageToDisplay = <Loading />;
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

  return (
    <>
      {stageToDisplay}
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
    </>
  );
};

const Stage1 = ({}) => {
  const [introComplete, setIntroComplete] = useState<boolean>(true);
  const compToDisplay = introComplete ? (
    <ChooseVictim />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle onFinish={() => setIntroComplete(true)}>
        <StylishItem>
          <Text>Stage I:</Text>
        </StylishItem>
        <StylishItem>
          <Text>Mass Destruction</Text>
        </StylishItem>
      </ShowTextWithStyle>
    </StageIntroContainer>
  );

  // <SwitchTransition mode={"out-in"}>
  //   <Transition timeout={0} key={introComplete ? 1 : 0}>
  //   </Transition>
  // </SwitchTransition>
  return <>{compToDisplay}</>;
};

const Stage2 = ({}) => {
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const compToDisplay = introComplete ? (
    <Leftovers />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle onFinish={() => setIntroComplete(true)}>
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
          <Text>Congratulations!</Text>
        </StylishItem>
        <StylishItem>
          <Text>Your life just got a little cleaner.</Text>
        </StylishItem>
        <StylishItem>
          <Text>
            The author wants to hear from you. Leave whatever's on your mind.
          </Text>
        </StylishItem>
      </ShowTextWithStyle>
    </StageIntroContainer>
  );
};

const StageIntroContainer = styled.div`
  ${centerContent}
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;
