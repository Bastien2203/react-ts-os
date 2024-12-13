import {useEffect, useState} from "react";
import {ActiveWindow, WindowManager} from "./services/WindowManager.ts";
import {EventManager} from "./services/EventManager.ts";
import {WindowLayout} from "./components/WindowLayout.tsx";
import {Dock} from "./components/Dock.tsx";
import React from "react";

export const App = () => {
  const [activeWindows, setActiveWindows] = useState<ActiveWindow[]>(WindowManager.getActiveWindows())
  const [focusedWindow, setFocusedWindow] = useState<ActiveWindow | null>(null)

  useEffect(() => {
    EventManager.on("windowAdded", (window: ActiveWindow) => {
      setActiveWindows((prev) => [...prev, window])
      setFocusedWindow(window)
    });
    EventManager.on("windowRemoved", (id: string) => {
      if (focusedWindow?.id === id) {
        setFocusedWindow(null)
      }
      setActiveWindows((prev) => prev.filter((w) => w.id !== id))
    });
  }, []);

  const closeWindow = (id: string) => {
    WindowManager.removeActiveWindow(id)
  }

  return <div className="h-screen w-screen bg-gradient-to-br from-gray-800 to-gray-900 flex">
    <div className="h-full">
      <Dock/>
    </div>

    <div className="h-full w-full relative">
      {
        activeWindows.map((activeWindows) =>
          (
            <React.Fragment key={activeWindows.id}>
              <WindowLayout title={activeWindows.title} closeWindow={() => closeWindow(activeWindows.id)} zIndex={focusedWindow?.id === activeWindows.id ? 1 : 0} setFocus={() => setFocusedWindow(activeWindows)}>
                {activeWindows.component && <activeWindows.component/>}
              </WindowLayout>
            </React.Fragment>
          ))
      }
    </div>


  </div>
}