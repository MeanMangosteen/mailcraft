import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { SwitchTransition, Transition } from "react-transition-group";
import { Aura } from "../Aura";
import { Home } from "./NewHome";

type EpisodeProps = {
  state: any;
  onFinish: () => void;
};

enum Images {
  Empty = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  Insomnia = "https://i.imgur.com/wQlhbfX.jpg",
  Shredded = "https://i.imgur.com/Y4Wfd4p.jpg",
  CleanRoom = "https://i.imgur.com/G8jSfk0.jpg",
  Buddha = "https://i.imgur.com/pkrBtZX.jpg",
}

export const Episode1 = ({ state, onFinish }: EpisodeProps) => {
  const [currImage, setCurrImage] = useState(Images.Empty);
  return (
    <EpisodeContainer state={state}>
      <TextContainer>
        <ShowTextWithStyle key="ep1" onFinish={onFinish}>
          <StylishItem
            onShow={() => {
              setCurrImage(Images.Insomnia);
            }}
            // onShow={() => console.log("somefin")}
          >
            <Text>Do you have sleepless nights?</Text>
          </StylishItem>
          <StylishItem>
            <Text>Don't have the perfect body?</Text>
          </StylishItem>
          <StylishItem
            //    onShow={() => console.log("we showin baby!")}
            onShow={() => {
              setCurrImage(Images.Shredded);
            }}
          >
            <Text>Dreams not coming true?</Text>
          </StylishItem>
        </ShowTextWithStyle>
      </TextContainer>
      <PictureContainer>
        <SwitchTransition mode={"out-in"}>
          <Transition key={currImage} timeout={200}>
            {(state) => <Image src={currImage} state={state} />}
          </Transition>
        </SwitchTransition>
      </PictureContainer>
    </EpisodeContainer>
  );
};

export const Episode2 = ({ state, onFinish }: EpisodeProps) => (
  <EpisodeContainer state={state}>
    <TextContainer>
      <ShowTextWithStyle key="ep2" onFinish={onFinish}>
        <StylishItem>
          <Text>Don't listen to what they say...</Text>
        </StylishItem>
        <StylishItem>
          <Text>It's not time and effort that will get you there!</Text>
        </StylishItem>
      </ShowTextWithStyle>
    </TextContainer>
    <PictureContainer></PictureContainer>
  </EpisodeContainer>
);

export const Episode3 = ({ state, onFinish }: EpisodeProps) => (
  <EpisodeContainer state={state}>
    <TextContainer>
      <ShowTextWithStyle key="ep3" onFinish={onFinish}>
        <StylishItem>
          <Text>But a hygenic mailbox will</Text>
        </StylishItem>
        <StylishItem>
          <Text>
            Start your journey today and let Mailcraft solve all your live's
            problems!
          </Text>
        </StylishItem>
      </ShowTextWithStyle>
    </TextContainer>
    <PictureContainer>
      <ButtonContainer>
        <HomePageButton imgSrc={Images.CleanRoom} />
        <HomePageButton imgSrc={Images.Buddha} />
      </ButtonContainer>
    </PictureContainer>
  </EpisodeContainer>
);

const HomePageButton = ({ imgSrc }) => {
  const [mousePos, setMousePos] = useState<any>();
  const handleMouse = (event) => {
    const insideBox =
      event.pageX > event.currentTarget.offsetLeft &&
      event.pageY > event.currentTarget.offsetTop;

    if (insideBox) {
      const mouseX =
        ((event.pageX - event.currentTarget.offsetLeft) /
          event.currentTarget.offsetWidth) *
        100;
      const mouseY =
        ((event.pageY - event.currentTarget.offsetTop) /
          event.currentTarget.offsetHeight) *
        100;
      setMousePos({ x: mouseX, y: mouseY });
    }
  };

  return (
    <LuckyDuckyAura
      onMouseMove={handleMouse}
      onMouseLeave={() => setMousePos(undefined)}
    >
      <MegaWrapper mouse={mousePos}>
        <Button style={{ backgroundImage: `url(${imgSrc})` }}>
          <ButtonText>Declutter</ButtonText>
        </Button>
      </MegaWrapper>
    </LuckyDuckyAura>
  );
};

const LuckyDuckyAura = styled.div`
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    ),
    linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    );
  background-blend-mode: hard-light;
  width: 70%;
`;

const MegaWrapper = styled.div`
  display: flex;
  > * {
    flex-grow: 1;
  }
  padding: 6rem;
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(farthest-side at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,0,0,1) 0%, rgba(255,185,33,1) 0%, rgba(246,233,227,1) 67%, rgba(255,255,255,0) 100%)`
      : undefined};
  box-shadow: inset 0px 0px 9px 10px #ffffff;
`;

const ButtonContainer = styled.div`
  display: flex;
  /* flex-grow: 1; */
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`;

const Button = styled.div`
  /* margin: 1rem; */
  border-radius: 2rem;
  color: white;
  background-position: center;
  background-size: cover;
  height: 35rem;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const ButtonText = styled.div`
  margin: 1rem;
  font-size: 2.5rem;
  backdrop-filter: blur(8px);
  padding: 0 1rem;
  border-radius: 20%;
`;

const EpisodeContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100vh;
  /* height: 100%; */

  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PictureContainer = styled.div`
  /* max-height: 80%;
  max-width: 80%; */
  /* height: 100vh;
  padding: 3rem; */
  /* align-self: stretch;
  justify-self: stretch; */
  box-sizing: border-box;
  padding: 3rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;

const Image = styled.img`
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};

  object-fit: contain;
  height: 100%;
  width: 100%;
`;
