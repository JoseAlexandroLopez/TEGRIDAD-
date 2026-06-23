import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useThemeCustom = () =>
  useContext(ThemeContext);