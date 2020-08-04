import React, { useState, useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink, Link } from "react-router-dom";
import Emoji from "react-emoji-render";
import { UserContext } from "../App";
import { cb } from "../utils";
import { useCookies } from "react-cookie";
import MailcraftLogo from "../images/mailcraft-logo.svg";

interface NavBarProps {}

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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const OtherLinks = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  box-shadow: -47px -83px 48px 19px;
  height: 50vh;
`;

const IconWrapper = styled.div`
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
  ${IconWrapper}:hover & {
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

const LogoutIcon = styled(Emoji)`
  ${iconStyles}
`;

const NavLinkText = styled.h1`
  position: absolute;
  z-index: 5;
  margin: 0;

  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
  ${IconWrapper}:hover & {
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

export const BaseLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const HomeIcon = styled.img`
  ${iconStyles}

  width: 100%;
  height: auto;
  font-size: 4rem;
  text-align: center;

  filter: saturate(1.5) drop-shadow(#7d7d7d 2px 4px 3px);
`;

const NavBar = styled(({}: NavBarProps) => {
  const userCtx = useContext(UserContext);
  const [_, __, removeCookie] = useCookies([]);
  return (
    <NavBarContainer>
      <ContentWrapper>
        <BaseNavLink to="/" exact activeStyle={{ color: "red" }}>
          <IconWrapper>
            <HomeIcon src={MailcraftLogo} />
            <NavLinkText>Home</NavLinkText>
          </IconWrapper>
        </BaseNavLink>
        <BaseNavLink to="/declutter" activeStyle={{ color: "red" }}>
          <IconWrapper>
            <DeclutterIcon text=":bowling:" />
            <NavLinkText>Declutter</NavLinkText>
          </IconWrapper>
        </BaseNavLink>
        <BaseNavLink to="/insights" activeStyle={{ color: "red" }}>
          <IconWrapper>
            <AnalyseIcon text=":microscope:" />
            <NavLinkText>Insights</NavLinkText>
          </IconWrapper>
        </BaseNavLink>
      </ContentWrapper>
      <OtherLinks>
        {userCtx.loggedIn && (
          <IconWrapper
            onClick={() => {
              userCtx.setLoggedIn(false);
              removeCookie("loggedIn");
            }}
          >
            <LogoutIcon text=":door:" />
            <NavLinkText>Logout</NavLinkText>
          </IconWrapper>
        )}
        <IconWrapper
          onClick={() =>
            window.open("https://github.com/MeanMangosteen", "_blank")
          }
        >
          <LogoutIcon text=":boy:" />
          <NavLinkText>Author</NavLinkText>
        </IconWrapper>
      </OtherLinks>
    </NavBarContainer>
  );
})``;

export { NavBar };
