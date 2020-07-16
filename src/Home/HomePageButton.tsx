import React, { useState } from "react";
import styled from "styled-components";
import { BaseNavLink } from "../NavBar/NavBar";

export const HomePageButton = ({ imgSrc, title, path }) => {
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

  // onMouseMove={handleMouse} onMouseLeave={() => setMousePos(undefined)}
  return (
    <LuckyDuckyAura>
      <MegaWrapper mouse={mousePos}>
        <Button style={{ backgroundImage: `url(${imgSrc})` }} href={path}>
          <ButtonText>{title}</ButtonText>
        </Button>
      </MegaWrapper>
    </LuckyDuckyAura>
  );
};

const LuckyDuckyAura = styled.div`
  /* background: linear-gradient(
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
    ); */
  /* background: linear-gradient(
      90deg,
      rgba(139, 78, 180, 0) 0%,
      rgba(139, 78, 180, 1) 15%,
      rgba(139, 78, 180, 1) 85%,
      rgba(139, 78, 180, 0) 100%
    ),
    linear-gradient(
      0deg,
      rgba(139, 78, 180, 0) 0%,
      rgba(139, 78, 180, 1) 15%,
      rgba(139, 78, 180, 1) 85%,
      rgba(139, 78, 180, 0) 100%
    ); */

  &:hover {
    transform: scale(1.125);
  }
  transition: transform 250ms ease-in-out;

  background-blend-mode: hard-light;
  width: 70%;
`;

const MegaWrapper = styled.div`
  display: flex;
  > * {
    flex-grow: 1;
  }
  padding: 6rem;
  /* background: ${({ mouse }: { mouse: any }) =>
    mouse
      ? `radial-gradient(ellipse farthest-side at ${mouse && mouse.x}% ${
          mouse && mouse.y
        }%, rgba(237,146,76,0.9248074229691877) 8%, rgba(171,54,92,0.9051995798319328) 28%, rgba(115,0,134,0.8379726890756303) 38%, rgba(74,0,134,0.6474964985994398) 53%, rgba(40,0,134,0.5186449579831933) 60%, rgba(255,255,255,0) 100%)`
      : undefined}; */
  border-radius: 60% 60% 60% 60% / 90% 90% 90% 90%;
`;

const Button = styled.a`
  /* margin: 1rem; */
  border-radius: 2rem;
  color: white;
  background-position: center;
  height: 35rem;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  /* box-shadow: 5px 5px 15px 5px #000000; */
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(2px 4px 6px black);

  /* Remove 'a' tag styling */
  /* color: inherit; */
  text-decoration: none;
`;

const ButtonText = styled.div`
  margin: 1rem;
  font-size: 2.5rem;
  backdrop-filter: blur(8px);
  padding: 0 1rem;
  border-radius: 20%;
  text-decoration: none;
`;
