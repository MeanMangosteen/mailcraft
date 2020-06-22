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
        mouse={mousePos}
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
  /* padding: 8rem; */
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `linear-gradient(
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
    ), radial-gradient(at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,133,133,1) 0%, rgba(255,255,255,0) 40%)`
      : `linear-gradient(
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
      rgba(255, 255, 255, 1) 100%)`};
/* position: relative;
    &::before{
      content: ""; // ::before and ::after both require content
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,133,133,1) 0%, rgba(255,255,255,0) 40%)`
      : undefined};
    background-image: linear-gradient(120deg, #eaee44, #33d0ff);
    opacity: .7;
    background: rgb(255,255,255);
background: radial-gradient(circle, rgba(255,255,255,0) 29%, rgba(255,255,255,1) 100%);
    }

  background-blend-mode: screen;

  background: ${({ mouse }: { mouse: any }) =>
    `radial-gradient(at ${mouse && mouse.x}% ${
      mouse && mouse.y
    }%, rgba(255,133,133,1) 0%, rgba(255,255,255,0) 40%)`}; */
    box-shadow: inset 0px 0px 9px 10px #ffffff;
`;

const MegaWrapper = styled.div`
  padding: 8rem;
  /* background: rgb(255, 255, 255);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 29%,
    rgba(255, 255, 255, 1) 100%
  ); */
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,133,133,1) 0%, rgba(255,255,255,0) 40%)`
      : undefined};
`;
