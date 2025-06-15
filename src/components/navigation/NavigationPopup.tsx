import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { COLORS, TRANSITIONS } from "../../constants/styles";

const menus = [
  { path: "/", label: "Home" },
  { path: "/samplesynth", label: "Sample Synth" },
  { path: "/retrosynth", label: "Retro Synth" },
];

export default function NavigationPopup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Container>
      <MenuButton
        active={open}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Menu"
      >
        Menu
      </MenuButton>
      <Popup open={open}>
        <PopupContent>
          {menus.map((menu) => (
            <MenuItemButton
              key={menu.path}
              onClick={() => handleNavigate(menu.path)}
              selected={location.pathname === menu.path}
            >
              {menu.label}
            </MenuItemButton>
          ))}
        </PopupContent>
      </Popup>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const MenuButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ active }) =>
    active ? COLORS.navigation.active : COLORS.navigation.grey.dark};
  color: ${COLORS.text.primary};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background ${TRANSITIONS.normal}, color ${TRANSITIONS.normal};
  &:hover {
    background: ${COLORS.navigation.active};
    color: #fff;
  }
`;

const Popup = styled.div<{ open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-10px)")};
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out,
    visibility 0.2s ease-in-out;
`;

const PopupContent = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItemButton = styled.button<{ selected: boolean }>`
  background: ${(props) =>
    props.selected ? COLORS.background.dark : "transparent"};
  color: ${(props) =>
    props.selected ? COLORS.text.primary : COLORS.background.dark};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${COLORS.navigation.grey.medium};
    color: #fff;
  }
`;
