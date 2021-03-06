import React from "react";
import styled, { keyframes } from "styled-components";
import { centerContent } from "./utils";
export const Loading = ({ color = "" }) => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <Spinner color={color}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Spinner>
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

const SpinnerWrapper = styled.div`
  position: relative;
`;

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  ${centerContent};
  width: 100%;
  height: 100%;
`;

const Spinner = styled.div<{ color?: string }>`
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  & div {
    flex-grow: 1;
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100px;
    height: 100px;
    margin: 8px;
    border: ${({ color }) => `8px solid ${color || "#000"}`};
    border-radius: 50%;
    animation: ${Spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ color }) =>
      `${color || "#000"} transparent transparent transparent`};
  }
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
