import React from "react";
import styled, { keyframes, css } from "styled-components";
import { BaseLink } from "../NavBar/NavBar";

export const HomePageButton = ({ imgSrc, title, path, levitate = false }) => {
  return (
    <ButtonContainer levitate={levitate}>
      <Button style={{ backgroundImage: `url(${imgSrc})` }} to={path}></Button>
      <ButtonText>{title}</ButtonText>
    </ButtonContainer>
  );
};

const Levitate = keyframes`
  0% {
    transform: translate3d(0, -1.5%, 0);
  }

  66% {
    transform: translate3d(0, 1.5%, 0);
  }

  100% {
    transform: translate3d(0, -1.5%, 0);
  }
`;

const ButtonContainer = styled.div<{ levitate?: boolean }>`
  position: relative;
  background-blend-mode: hard-light;
  width: 70%;
  display: flex;
  > * {
    flex-grow: 1;
  }
  padding: 6rem;

  will-change: transform;
  animation: ${({ levitate }) =>
    levitate &&
    css`
      ${Levitate} 2s ease-in-out infinite
    `};
`;

const Button = styled(BaseLink)`
  border-radius: 2rem;
  background-position: center;
  height: 35rem;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(2px 4px 6px black);

  &:hover {
    transform: scale(1.125);
  }
  transition: transform 250ms ease-out;
  transition-delay: 50ms;

  /* Remove 'a' tag styling */
  /* color: inherit; */
  /* text-decoration: none !important; */
`;

const ButtonText = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  /* filter: drop-shadow(0px 2px 2px hsl(0, 89%, 59%));
  color: hsl(0, 97%, 43%);
  color: white;
  -webkit-text-stroke: 1.5px #ff6060; */

  margin: 1rem;
  font-size: 2.5rem;
  padding: 0 1rem;
  border-radius: 20%;

  color: #6800d8;
  font-weight: bold;
  font-size: 3rem;

  transition: transform 200ms ease-in;
  ${ButtonContainer}:hover & {
    transform: translate(-50%, -50%) scale(0.75);
  }
`;
