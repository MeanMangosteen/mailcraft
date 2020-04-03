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

  }

  100% {
    transform: translate(0, 0)
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
  margin: 1rem;

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

  margin: 1rem;

  animation: ${(props: { hovered: boolean }) =>
    props.hovered
      ? css`
          ${grow} 0.5s ease-in-out 1
        `
      : undefined};
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
        <DeclutterIcon hovered={hovered["declutter"]} />
      </BaseNavLink>
      <BaseNavLink
        to="/analyse"
        activeStyle={{}}
        onMouseEnter={handleMouseEnter("analyse")}
        onMouseLeave={handleMouseLeave("analyse")}
      >
        <AnalyseIcon hovered={hovered["analyse"]} />
      </BaseNavLink>
    </Container>
  );
})``;

export { NavBar };
