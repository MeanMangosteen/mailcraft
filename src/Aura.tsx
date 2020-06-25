import React, { useState } from "react";
import styled from "styled-components";

export const Aura = ({ children }) => {
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
    <AuraContainer>
      <LuckyDuckyAura
        onMouseMove={handleMouse}
        onMouseLeave={() => setMousePos(undefined)}
      >
        <MegaWrapper mouse={mousePos}>{children}</MegaWrapper>
      </LuckyDuckyAura>
    </AuraContainer>
  );
};

const AuraContainer = styled.div``;

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
`;

const MegaWrapper = styled.div`
  padding: 6rem;
  background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(farthest-side at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(255,0,0,1) 0%, rgba(255,185,33,1) 0%, rgba(246,233,227,1) 67%, rgba(255,255,255,0) 100%)`
      : undefined};
  box-shadow: inset 0px 0px 9px 10px #ffffff;
`;
