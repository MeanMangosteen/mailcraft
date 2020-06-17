import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { SwitchTransition, Transition } from "react-transition-group";

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
        <Button style={{ backgroundImage: `url(${Images.CleanRoom})` }}>
          <ButtonText>Declutter</ButtonText>
          {/* <img src={Images.CleanRoom} /> */}
        </Button>
        <Button
          style={{
            backgroundImage: `url(${Images.Buddha})`,
            backgroundSize: "cover",
          }}
        >
          <ButtonText>Insights</ButtonText>
        </Button>
      </ButtonContainer>
    </PictureContainer>
  </EpisodeContainer>
);

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-evenly;
`;

const Button = styled.div`
  margin: 1rem;
  background: purple;
  border-radius: 2rem;
  color: white;
  background-position: center;
  background-size: contain;
  height: 20rem;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const ButtonText = styled.div`
  margin: 1rem;
  font-size: 2.5rem;
`;

const EpisodeContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  height: 100%;

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
  padding: 3rem;
  align-self: stretch;
  justify-self: stretch;
  display: flex;
  justify-content: center;
  align-items: center;
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
