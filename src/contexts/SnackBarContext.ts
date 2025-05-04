import { AlertProps } from "@mui/material";
import { createContext } from "react";

interface ISnackBarContext {
  openSnackBar(arg: { msg: string; severity: AlertProps["severity"] }): void;
}

export const SnackBarContext = createContext<ISnackBarContext>({
  openSnackBar: () => {},
});
