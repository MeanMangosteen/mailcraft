import React, { useState } from "react";
import styled from "styled-components";

export const Playground = () => {
  const [mousePos, setMousePos] = useState<any>();
  const handleMouse = (event) => {
    const insideBox =
      event.pageX > event.target.offsetLeft &&
      event.pageY > event.target.offsetTop;

    if (insideBox) {
      console.log("inside box!");
      const mouseX =
        ((event.pageX - event.target.offsetLeft) / event.target.offsetWidth) *
        100;
      const mouseY =
        ((event.pageY - event.target.offsetTop) / event.target.offsetHeight) *
        100;
      setMousePos({ x: mouseX, y: mouseY });
    }
  };

  console.log("mouse pos: ", mousePos);
  return (
    <PlaygroundContianer>
      <LuckyDuckyAura
        onMouseMove={handleMouse}
        onMouseLeave={() => setMousePos(undefined)}
      >
        <LuckyDucky />
      </LuckyDuckyAura>
    </PlaygroundContianer>
  );
};

const PlaygroundContianer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LuckyDucky = styled.div`
  height: 300px;
  width: 400px;
  background: cornflowerblue;
  box-shadow: 0px 0px 20px 4px white;
`;

const LuckyDuckyAura = styled.div`
  padding: 8rem;
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
  background-blend-mode: screen;
`;
