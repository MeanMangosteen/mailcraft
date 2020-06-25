import React, { useState } from "react";
import styled from "styled-components";

export const Playground = () => {
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
    <PlaygroundContianer>
      <LuckyDuckyAura
        onMouseMove={handleMouse}
        onMouseLeave={() => setMousePos(undefined)}
      >
        <MegaWrapper mouse={mousePos}>
          <LuckyDucky>Some content</LuckyDucky>
        </MegaWrapper>
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
  /* box-shadow: inset 0px 0px 9px 10px #ffffff; */
  background-blend-mode: hard-light;
`;
const MegaWrapper = styled.div`
  &::after {
    content: "";
  }
  padding: 8rem;
  /* background: rgb(255, 255, 255);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 29%,
    rgba(255, 255, 255, 1) 100%
  ); */
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(farthest-side at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,0,0,1) 0%, rgba(255,185,33,1) 0%, rgba(246,233,227,1) 67%, rgba(255,255,255,0) 100%)`
      : undefined};
  box-shadow: inset 0px 0px 9px 10px #ffffff;
`;

// background: radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(255,80,80,1) 3%, rgba(255,255,255,0) 9%);

// background: radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(255,80,80,1) 12%, rgba(255,255,255,0) 23%);
