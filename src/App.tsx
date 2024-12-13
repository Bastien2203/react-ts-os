import {useEffect, useState} from "react";
import {ActiveWindow, WindowManager} from "./services/WindowManager.ts";
import {EventManager} from "./services/EventManager.ts";
import {WindowLayout} from "./components/WindowLayout.tsx";
import {Dock} from "./components/Dock.tsx";
import React from "react";
import {WindowManagerContext} from "./WindowManagerContext.tsx";
import {Theme} from "./services/Theme.ts";


export const App = () => {
  const [activeWindows, setActiveWindows] = useState<ActiveWindow[]>([])
  const [focusedWindow, setFocusedWindow] = useState<ActiveWindow | null>(null)
  const [windowManager] = useState(new WindowManager(new EventManager()))

  useEffect(() => {
    setActiveWindows(windowManager.getActiveWindows())
    windowManager.eventManager.on("windowAdded", (window: ActiveWindow) => {
      setActiveWindows((prev) => [...prev, window])
      setFocusedWindow(window)
    });
    windowManager.eventManager.on("windowRemoved", (id: string) => {
      if (focusedWindow?.id === id) {
        setFocusedWindow(null)
      }
      setActiveWindows((prev) => prev.filter((w) => w.id !== id))
    });
  }, []);

  const closeWindow = (id: string) => {
    windowManager.removeActiveWindow(id)
  }

  return <div className="h-screen w-screen bg-gradient-to-br flex" style={{background: Theme.desktopBackgroundColor}}>
    <div className="h-full">
      <Dock windowManager={windowManager}/>
    </div>

    <WindowManagerContext.Provider value={{windowManager}}>
      <div className="h-full w-full relative">
        {
          activeWindows.map((activeWindows) =>
            (
              <React.Fragment key={activeWindows.id}>
                <WindowLayout title={activeWindows.title} closeWindow={() => closeWindow(activeWindows.id)}
                              zIndex={focusedWindow?.id === activeWindows.id ? 1 : 0}
                              setFocus={() => setFocusedWindow(activeWindows)}>
                  {activeWindows.component && <activeWindows.component/>}
                </WindowLayout>
              </React.Fragment>
            ))
        }
      </div>
    </WindowManagerContext.Provider>


  </div>
}