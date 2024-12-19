import {useContext, useEffect, useState} from "react";
import {ActiveWindow} from "./services/WindowManager.ts";
import {WindowLayout} from "./components/WindowLayout.tsx";
import {Dock} from "./components/Dock.tsx";
import React from "react";
import {Desktop} from "./components/Desktop.tsx";
import {useSettings} from "./hooks/useSettings.ts";
import {WindowManagerContext} from "./WindowManagerContext.tsx";


export const App = () => {
  const [activeWindows, setActiveWindows] = useState<ActiveWindow[]>([])
  const [focusedWindow, setFocusedWindow] = useState<ActiveWindow | null>(null)
  const context = useContext(WindowManagerContext);
  const [desktopBackground] = useSettings("appearance", "desktopBackgroundColor");

  if(!context) {
    return <>Loading...</>
  }

  useEffect(() => {
    setActiveWindows(context.windowManager.getActiveWindows())

    const onWindowAdded = (window: ActiveWindow) => {
      setActiveWindows(context.windowManager.getActiveWindows());
      setFocusedWindow(window);
    };

    const onWindowRemoved = (id: string) => {
      if (focusedWindow?.id === id) {
        setFocusedWindow(null);
      }
      setActiveWindows(context.windowManager.getActiveWindows());
    };

    context.windowManager.eventManager.on("windowAdded", onWindowAdded);
    context.windowManager.eventManager.on("windowRemoved", onWindowRemoved);

    return () => {
      context.windowManager.eventManager.off("windowAdded", onWindowAdded);
      context.windowManager.eventManager.off("windowRemoved", onWindowRemoved);
    };
  }, [context.windowManager, focusedWindow]);

  const closeWindow = (id: string) => {
    context.windowManager.removeActiveWindow(id)
  }

  return <div className="h-screen w-screen flex " style={{background: desktopBackground}}>
    <div className="h-full z-40">
      <Dock/>
    </div>

    <div className="h-full w-full relative">
      <Desktop/>
      {
        activeWindows.map((window) =>
          (
            <React.Fragment key={window.id}>
              <WindowLayout title={window.title} closeWindow={() => closeWindow(window.id)}
                            zIndex={focusedWindow?.id === window.id ? 1 : 0}
                            setFocus={() => setFocusedWindow(window)}
                            icon={<window.icon/>}>

                {window.component && <window.component {...window.args}/>}
              </WindowLayout>
            </React.Fragment>
          ))
      }
    </div>
  </div>
}