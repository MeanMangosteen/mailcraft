import React from "react";
import styled, { keyframes, css } from "styled-components";
import { BaseLink } from "../NavBar/NavBar";

export const HomePageButton = ({ imgSrc, title, path, levitate = false }) => {
  return (
    <ButtonContainer levitate={levitate}>
      <Button style={{ backgroundImage: `url(${imgSrc})` }} to={path}>
        <ButtonText>{title}</ButtonText>
      </Button>
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
  color: white;
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
  transition: transform 250ms ease-in-out;

  /* Remove 'a' tag styling */
  /* color: inherit; */
  /* text-decoration: none !important; */
`;

const ButtonText = styled.div`
  margin: 1rem;
  font-size: 2.5rem;
  backdrop-filter: blur(8px);
  padding: 0 1rem;
  border-radius: 20%;
  /* text-decoration: none !important; */
`;
