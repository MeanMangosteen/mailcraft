import React from "react";
import styled, { keyframes } from "styled-components";
import { centerContent } from "./utils";
import { ReactComponent as WorkInProgressSVG } from "./images/work-in-progress.svg";
import { FcHome } from "react-icons/fc";
import { BaseNavLink } from "./NavBar/NavBar";

export const Insights = () => {
  return (
    <InsightsContainer>
      <StyledWIPSVG />
      <BackHomeContainer to="/">
        Back Home
        <HomeIcon />
      </BackHomeContainer>
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  ${centerContent}
  flex-direction: column;
  margin: 15%;
`;

const HomeIcon = styled(FcHome)`
  margin-left: 1rem;
  font-size: 120%;
  filter: drop-shadow(1px 1px 1px black);
`;

const BackHomeContainer = styled(BaseNavLink)`
  ${centerContent}
  font-size: 5rem;

  box-shadow: 2px 2px 3px 2px #ccc;
  border-radius: 6px;
  padding: 0.5rem;

  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

const rotateLeft = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const rotateRight = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }

`;

const StyledWIPSVG = styled(WorkInProgressSVG)`
  flex-grow: 1;
  width: 100%;
  .left-cog {
    transform-origin: center center;
    transform-box: fill-box;

    will-change: transform;
    animation: ${rotateRight} infinite 4s linear;
  }

  .right-cog {
    transform-origin: center center;
    transform-box: fill-box;

    will-change: transform;
    animation: ${rotateLeft} infinite 6s linear;
  }
`;
