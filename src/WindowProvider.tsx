import {WindowManager} from "./services/WindowManager.ts";
import {EventManager} from "./services/EventManager.ts";
import {PropsWithChildren, useState} from "react";
import {WindowManagerContext} from "./WindowManagerContext.tsx";

const windowManagerInstance = new WindowManager(new EventManager());

export const WindowProvider = (props: PropsWithChildren<{}>) => {
  const [windowManager] = useState(windowManagerInstance)

  return <WindowManagerContext.Provider value={{windowManager}}>
    {props.children}
  </WindowManagerContext.Provider>
}