import styled from "styled-components";
import { StyledMenuItemProps } from "./types";

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;
  margin: 3px;

  ${({ $isActive, $variant, theme }) =>
    $isActive &&
    $variant === "pageMenu" &&
    `
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${theme.colors.gradientGold};
      width: 100px;
      border-radius: 10px;
      margin: 3px;
      // &:after{
      //   content: "";
      //   position: absolute;
      //   bottom: 0;
      //   height: 4px;
      //   width: 100%;
      //   background-color: ${theme.colors.primary};
      //   border-radius: 2px 2px 0 0;
      // }
    `};
  ${({ theme, $variant }) =>
    $variant === "subMenu" &&
    `
      display: flex;
      align-items: center;
      height: 40px;
      margin: 3px;
      &:hover {
        background-color: ${theme.colors.tertiary};
      }
    `};

  ${({ $variant }) =>
    $variant === "default" &&
    `
      flex-grow: 1;
      height: 40px;
      margin: 0px;
    `};
`;

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  // width: 100%;
  ${({ $variant }) => 
    $variant === "pageMenu" &&
    `
      align-items: center;
      display: flex;
      justify-content: center;
    `
  };


  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.primaryBright)};
  // font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "inherit")};

  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant, theme, $isActive }) =>
    $variant === "subMenu"
      ? `
      width: 100%;
      padding: 12px 56px;
      // height: 38px;
      font-size: 14px;
      height: 40px;
    `
      : 
    $variant === "pageMenu" ?
    `
    padding: 4px 4px 4px 4px;
    height: 32px;
    font-weight: 600;
    color: ${($isActive ? theme.colors.primaryBright : theme.colors.spec)};
    `
    :
    `
    height: 32px;
    `
  }

  &:hover {
    // background: ${({ theme }) => theme.colors.tertiary};
    // font-weight: 600;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primaryBright : theme.colors.primaryBright)};
    ${({ $variant }) => $variant === "subMenu" && "border-radius: 8px;"};
  }
`;

export default StyledMenuItem;
