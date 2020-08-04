import React, { useState, useCallback } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { Leftovers } from "../Leftovers/Leftovers";
import styled, { keyframes } from "styled-components";
import { FiSend } from "react-icons/fi";
import { centerContent, api, cb } from "../utils";
import { SwitchTransition, Transition } from "react-transition-group";
import { LoadingFeatJohnty } from "../LoadingFeatJohnty";
import { Loading } from "../Loading";

export const Stage1 = () => {
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const compToDisplay = introComplete ? (
    <ChooseVictim />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle
        onFinish={() => {
          setIntroComplete(true);
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
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const compToDisplay = introComplete ? (
    <Leftovers />
  ) : (
    <StageIntroContainer>
      <ShowTextWithStyle
        onFinish={() => {
          setIntroComplete(true);
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
  const [stage, setStage] = useState<"waiting" | "sending" | "thanking">(
    "waiting"
  );
  const handleSend = (message) => {
    setStage("sending");
    api
      .post("/sendMessage", { message })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setStage("thanking");
      });
  };

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
        {/* <MessageBox onSend={handleSend} /> */}
        <SwitchTransition>
          <Transition key={stage} timeout={200}>
            {(state) =>
              stage === "thanking" ? (
                <Fade state={state}>
                  <Text>Thank you.</Text>
                </Fade>
              ) : stage === "sending" ? (
                <Loading color="white" />
              ) : (
                <Fade state={state}>
                  <MessageBox onSend={handleSend} />
                </Fade>
              )
            }
          </Transition>
        </SwitchTransition>
      </ShowTextWithStyle>
      <Background />
    </StageIntroContainer>
  );
};

const Fade = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state?: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;
`;

const MessageBox = ({ onSend }) => {
  const [input, setInput] = useState<string>("");

  const handleChange = (e) => {
    setInput(e.target.value);
    console.log("here", e.target.value);
  };

  const handleClick = useCallback(() => {
    if (input === "") return;
    onSend(input);
  }, [input]);

  return (
    <MessageBoxContainer>
      <MessageBoxInput
        placeholder="Anything at all..."
        value={input}
        onChange={handleChange}
      />
      <SendIcon onClick={handleClick} />
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
