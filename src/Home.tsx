import React, {
  useState,
  useEffect,
  useCallback as cb,
  Fragment,
  useRef,
} from "react";
import styled from "styled-components";
import { Transition } from "react-transition-group";

// const Home = () => {
//   return
// }

// const

export const HomeOld = () => {
  const [inProp, setInProp] = useState(false);
  const [openingTitleStage, setOpeningTitleStage] = useState<number>(0);
  useEffect(() => {
    setTimeout(() => {
      setInProp(true);
    }, 1000);
  });

  const Stage1 = () => (
    <ShowTextWithStyle
      onFinish={() => {
        setOpeningTitleStage(openingTitleStage + 1);
      }}
    >
      <Text>Do you have sleepless nights?</Text>
      <Text>Don't have the perfect body?</Text>
      <Text>Dreams not coming true?</Text>
    </ShowTextWithStyle>
  );

  const stage2 = () => (
    <ShowTextWithStyle
      onFinish={() => {
        setOpeningTitleStage(openingTitleStage + 1);
      }}
    >
      <Text>Don't listen to what they say...</Text>
      <Text>It's not time and effort that will get you there!</Text>
    </ShowTextWithStyle>
  );

  const stage3 = (
    <ShowTextWithStyle onFinish={() => {}}>
      <Text>But a hygenic inbox will.</Text>
      <Text>
        Start your journey today, and let Mailcraft solve all your life's
        problems!
      </Text>
    </ShowTextWithStyle>
  );

  let compToDisplay;
  switch (openingTitleStage) {
    case 0:
      compToDisplay = (
        <ShowTextWithStyle
          onFinish={() => {
            setOpeningTitleStage(openingTitleStage + 1);
          }}
        >
          <Text>Do you have sleepless nights?</Text>
          <Text>Are you tired of being overweight?</Text>
          <Text>Dreams not coming true?</Text>
        </ShowTextWithStyle>
      );
      break;
    case 1:
      compToDisplay = stage2;
      // <ShowTextWithStyle
      //   onFinish={() => {
      //     setOpeningTitleStage(openingTitleStage + 1);
      //   }}
      // >
      //   <Text>Don't listen to what they say...</Text>
      //   <Text>It's not time and effort that will get you there!</Text>
      // </ShowTextWithStyle>
      break;
    case 2:
      compToDisplay = (
        <ShowTextWithStyle onFinish={() => {}}>
          <Text>But a hygenic inbox will.</Text>
          <Text>
            Start your journey today, and let Mailcraft solve all your life's
            problems.
          </Text>
        </ShowTextWithStyle>
      );
      break;
  }
  return <HomeContainer>{<Stage1 />}</HomeContainer>;
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Fade = styled.div`
  will-change: opacity;
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
`;

type PropsType = {
  children: JSX.Element[];
  onFinish: () => void;
};

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;
const ShowTextWithStyle = ({ children, onFinish }: PropsType) => {
  const [childCount, setChildCount] = useState<number>(0);
  const [tickingClock, setTickingClock] = useState<any>();
  const [visibleChildren, setVisibleChildren] = useState(
    Array(children.length).fill(false) // the indexes represent each child, the value: whether it's visible.
  );

  useEffect(() => {
    setChildCount(0);
    setVisibleChildren(
      Array(children.length).fill(false) // the indexes represent each child, the value: whether it's visible.
    );
  }, [children]);

  useEffect(() => {
    if (childCount > children.length) return;
    setTimeout(() => {
      visibleChildren[childCount] = true;
      setVisibleChildren([...visibleChildren]);
      setChildCount(childCount + 1);
    }, 2000);
  }, [childCount, children]);

  const childs = children.map((C, idx) => {
    return (
      <Transition in={visibleChildren[idx]} timeout={0} key={idx}>
        {(state) => <Fade state={state}>{React.cloneElement(C)}</Fade>}
      </Transition>
    );
  });

  return <Fragment>{childs}</Fragment>;
};

const Container = styled.div``;
