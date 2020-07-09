import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import Emoji from "react-emoji-render";

interface NavBarProps {}
const logoSrc =
  "https://raw.githubusercontent.com/gist/ll-aashwin-ll/8881a789f33ec7cd1681920e86db1dca/raw/89ded47674850103c22aea8c14cec4a8a551334e/mailcraft.svg";

const grow = keyframes`
  0% {
    transform: translate3d(0, 0, 0)
  }

  60% {
    transform: translate3d(1.2rem, 0,0);
  }

  70% {
    transform: translate3d(1.5rem, 0, 0) scale(0.8, 1.2);
  }

  80% {
    transform: scale(1.1, 0.9);
  }

  100% {
    transform: translate3d(0, 0, 0)
  }

`;

const slideFromLeft = keyframes`
0%{

  transform: translate3d(-150%, 0, 0); 
  opacity: 0;
  
}

60% {
  opacity: 0;
}

 100% {
  transform: translate3d(100%, 0, 0);
  opacity: 1;

 }
`;

const NavBarContainer = styled.div`
  position: relative;
  /* when you play the game of z-indexes you either lose or you die */
  z-index: 100;
  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    right: 0px;
    width: 1px;
    height: 100%;
  }

  &::after {
    top: 0;
    background: linear-gradient(to bottom, #ccc 0%, transparent 100%);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  box-shadow: -47px -83px 48px 19px;
  height: 50vh;
`;

// const iconStyles = css`
//   width: 100%;
//   height: auto;
//   font-size: 4rem;

//   will-change: transform;
//   animation: ${(props: { hovered: boolean }) =>
//     props.hovered
//       ? css`
//           ${grow} 0.5s ease-in-out 1
//         `
//       : undefined};
//   text-align: center;
//   filter: drop-shadow(#7d7d7d 2px 4px 3px);
// `;
// const NavLinkText = styled.h1`
//   position: absolute;
//   z-index: 5;
//   margin: 0;

//   will-change: transform;
//   animation: ${(props: { hovered: boolean }) =>
//     props.hovered
//       ? css`
//           ${slideFromLeft} 0.5s ease-in-out 1
//         `
//       : undefined};
//   transform: translate3d(100%, 0, 0);
//   display: ${(props: { hovered: boolean }) =>
//     props.hovered ? undefined : `none`};
//   right: 0;
//   filter: drop-shadow(#888 2px 4px 3px);
// `;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  padding: 1rem;
`;

const iconStyles = css`
  width: 100%;
  height: auto;
  font-size: 4rem;

  will-change: transform;
  ${NavLinkWrapper}:hover & {
    animation: ${grow} 0.5s ease-in-out 1;
  }
  text-align: center;
  filter: drop-shadow(#7d7d7d 2px 4px 3px);
`;

const DeclutterIcon = styled(Emoji)`
  ${iconStyles}
`;

const AnalyseIcon = styled(Emoji)`
  ${iconStyles}
`;

const NavLinkText = styled.h1`
  position: absolute;
  z-index: 5;
  margin: 0;

  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
  ${NavLinkWrapper}:hover & {
    animation: ${slideFromLeft} 0.5s ease-in-out 1;
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
  right: 0;
  filter: drop-shadow(#888 2px 4px 3px);
`;

export const BaseNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: inherit;
`;

const HomeIconWrapper = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  /* padding: 1rem; */

  width: 100%;
  height: auto;
  /* margin: 1rem; */

  box-sizing: border-box;
  border: 5px solid;
  border-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) 1;

  transform-origin: center;
  transition: 0.2s;
  &:hover {
    transform: scale(0.8);
    font-size: 8rem;
    /* border: 1px solid; */
    /* background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) 1; */
  }
`;
const HomeIcon = styled.img`
  ${iconStyles}

  width: 100%;
  height: auto;
  font-size: 4rem;
  text-align: center;

  filter: saturate(1.5) drop-shadow(#7d7d7d 2px 4px 3px);
  /* &:hover {
    transform: scale(1.1);
  }

  transition: transform 0.2s ease-in-out; */
}
  /* &::after {
    content: "";
    border-bottom: 1px solid #888;
    border-radius: 100%;
    width: 90%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
  } */
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
    <NavBarContainer>
      <ContentWrapper>
        <BaseNavLink to="/">
          {/* <HomeIconWrapper> */}
          {/* <HomeIcon text=":postbox:" /> */}
          <NavLinkWrapper>
            <HomeIcon src={logoSrc} />
            <NavLinkText>Test</NavLinkText>
          </NavLinkWrapper>
          {/* </HomeIconWrapper> */}
        </BaseNavLink>
        <BaseNavLink
          to="/declutter"
          activeStyle={{ color: "red" }}
          onMouseEnter={handleMouseEnter("declutter")}
          onMouseLeave={handleMouseLeave("declutter")}
        >
          <NavLinkWrapper>
            <DeclutterIcon text=":bowling:" />
            <NavLinkText>Declutter</NavLinkText>
          </NavLinkWrapper>
        </BaseNavLink>
        <BaseNavLink
          to="/leftovers"
          activeStyle={{}}
          onMouseEnter={handleMouseEnter("analyse")}
          onMouseLeave={handleMouseLeave("analyse")}
        >
          <NavLinkWrapper>
            <AnalyseIcon text=":microscope:" />
            <NavLinkText>Analyse</NavLinkText>
          </NavLinkWrapper>
          {/* <h3>Analyse</h3> */}
        </BaseNavLink>
      </ContentWrapper>
    </NavBarContainer>
  );
})``;

export { NavBar };
