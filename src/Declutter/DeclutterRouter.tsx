import React, { useState, useContext } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { Leftovers } from "../Leftovers/Leftovers";
import { UserContext } from "../App";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { centerContent } from "../utils";
import { SwitchTransition, Transition } from "react-transition-group";

export const DeclutterRouter = () => {
  const [currStage, setCurrStage] = useState<"stage1" | "stage2" | "success!">(
    "stage2"
  );
  const location = useLocation();
  const userCtx = useContext(UserContext);

  // Let's start of which just direct towards MD or leftovers
  let stageToDisplay;
  if (!userCtx.loggedIn) {
    stageToDisplay = (
      <Redirect
        to={{ pathname: "/login", state: { referrer: location.pathname } }}
      />
    );
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
          <Stage1 onComplete={() => setCurrStage("stage2")} />
        </Route>
        <Route path="/declutter/leftovers">
          <Stage2 onComplete={() => setCurrStage("success!")} />
        </Route>
        <Route path="/declutter/success">
          <Success />
        </Route>
      </Switch>
    </>
  );
};

const Stage1 = ({ onComplete }) => {
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const compToDisplay = introComplete ? (
    <ChooseVictim onComplete={onComplete} />
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

const Stage2 = ({ onComplete }) => {
  const [introComplete, setIntroComplete] = useState<boolean>(true);
  const compToDisplay = introComplete ? (
    <Leftovers onComplete={onComplete} />
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
