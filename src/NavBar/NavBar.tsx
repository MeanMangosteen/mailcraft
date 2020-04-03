import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { GiWheelbarrow, GiMicroscope } from "react-icons/gi";

interface NavBarProps {}

const grow = keyframes`
  0% {
    transform: translate(0, 0)
  }

  60% {
    transform: translate(1.2rem, 0);
  }

  70% {
    transform: translate(1.5rem, 0) scale(0.8, 1.2);
  }

  80% {
    transform: scale(1.1, 0.9);
  }

  100% {
    transform: translate(0, 0)
  }

`;

const slideFromLeft = keyframes`
0%{

  transform: translateX(-150%); 
  opacity: 0;
  
}

60% {
  opacity: 0;
}

 100% {
  transform: translateX(100%);
  opacity: 1;

 }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DeclutterIcon = styled(GiWheelbarrow)`
  width: 100%;
  height: auto;

  animation: ${(props: { hovered: boolean }) =>
    props.hovered
      ? css`
          ${grow} 0.5s ease-in-out 1
        `
      : undefined};
`;

const AnalyseIcon = styled(GiMicroscope)`
  width: 100%;
  height: auto;

  animation: ${(props: { hovered: boolean }) =>
    props.hovered
      ? css`
          ${grow} 0.5s ease-in-out 1
        `
      : undefined};
`;

const NavLinkText = styled.h1`
  position: absolute;
  z-index: -1;
  margin: 0;
  animation: ${(props: { hovered: boolean }) =>
    props.hovered
      ? css`
          ${slideFromLeft} 0.5s ease-in-out 1
        `
      : undefined};
  transform: translateX(100%);
  display: ${(props: { hovered: boolean }) =>
    props.hovered ? undefined : `none`};
  right: 0;
`;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  padding: 1rem;
`;

const BaseNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: inherit;
`;

const NavBar = styled(({}: NavBarProps) => {
  const [hovered, setHovered] = useState({ declutter: false, analyse: false });
  const handleMouseEnter = (option: "declutter" | "analyse") => () => {
    hovered[option] = true;
    setHovered({ ...hovered });
  };

  const handleMouseLeave = (option: "declutter" | "analyse") => () => {
    hovered[option] = false;
    setHovered({ ...hovered });
  };
  return (
    <Container>
      <BaseNavLink
        to="/declutter"
        activeStyle={{ color: "red" }}
        onMouseEnter={handleMouseEnter("declutter")}
        onMouseLeave={handleMouseLeave("declutter")}
      >
        <NavLinkWrapper>
          <DeclutterIcon hovered={hovered["declutter"]} />
          <NavLinkText hovered={hovered["declutter"]}>Declutter</NavLinkText>
        </NavLinkWrapper>
      </BaseNavLink>
      <BaseNavLink
        to="/analyse"
        activeStyle={{}}
        onMouseEnter={handleMouseEnter("analyse")}
        onMouseLeave={handleMouseLeave("analyse")}
      >
        <NavLinkWrapper>
          <AnalyseIcon hovered={hovered["analyse"]} />
          <NavLinkText hovered={hovered["analyse"]}>Analyse</NavLinkText>
        </NavLinkWrapper>
        {/* <h3>Analyse</h3> */}
      </BaseNavLink>
    </Container>
  );
})``;

export { NavBar };
