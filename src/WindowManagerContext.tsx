import {createContext} from "react";
import {WindowManager} from "./services/WindowManager.ts";

export const WindowManagerContext = createContext<{ windowManager: WindowManager } | undefined>(undefined);
