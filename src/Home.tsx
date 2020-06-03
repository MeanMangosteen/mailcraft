import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Transition } from "react-transition-group";

export const Home = () => {
  const [inProp, setInProp] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setInProp(true);
    }, 1000);
  });

  return (
    <HomeContainer>
      <Transition in={inProp} timeout={300}>
        {(state) => (
          <Fade state={state}>
            <Text>Do you have sleepless nights?</Text>
            <Text>Are you tired of being overweight?</Text>
            <Text>Dreams not coming true?</Text>
          </Fade>
        )}
      </Transition>
      {/* <button onClick={() => setInProp(true)}>Click to Enter</button> */}
    </HomeContainer>
  );
};

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Fade = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
  display: ${(props: { state: any }) =>
    props.state === "exited" ? "none" : "block"};
`;

const EnterTextWithStyle = ({ children }) => {
  const [childCount, setChildCount] = useState(0);
  const [tickingClock, setTickingClock] = useState<any>();
  const [visibleChildren, setVisibleChildren] = useState(
    Array(children.length).fill(false) // the indexes represent each child, the value: whether it's visible.
  );

  const handleShowTime = useCallback(() => {
    visibleChildren[childCount] = true;
    setVisibleChildren([...visibleChildren]);

    const newChildCount = childCount + 1;
    if (newChildCount > children.length) {
      clearInterval(tickingClock);
    } else {
      setChildCount(childCount + 1);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {}, 2000);
    setTickingClock(interval);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
