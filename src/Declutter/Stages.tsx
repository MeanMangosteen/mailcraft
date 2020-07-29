import React, { useState } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { Leftovers } from "../Leftovers/Leftovers";
import styled, { keyframes } from "styled-components";
import { FiSend } from "react-icons/fi";
import { centerContent } from "../utils";

export const Stage1 = () => {
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

export const Stage2 = () => {
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

export const Success = () => {
  return (
    <StageIntroContainer style={{ color: "white" }}>
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
`;

const Smiley = styled(Text)`
  ${centerContent}
  transform: rotate(90deg);
  font-size: 25rem;
  line-height: 20rem;
  margin-left: 8rem;
`;
