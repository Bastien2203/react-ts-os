import {useEffect, useState} from "react";
import {Window, WindowManager} from "./services/WindowManager.ts";
import {EventManager} from "./services/EventManager.ts";
import {WindowLayout} from "./components/WindowLayout.tsx";
import {Dock} from "./components/Dock.tsx";

export const App = () => {
  const [activeWindow, setActiveWindow] = useState<Window | undefined>(WindowManager.getActiveWindow())

  useEffect(() => {
    EventManager.on("windowChanged", (window: Window) => {
      setActiveWindow(window)
    });
  }, []);

  const closeWindow = () => {
    WindowManager.setActiveWindow()
  }

  return <div className="h-screen w-screen bg-gradient-to-br from-gray-800 to-gray-900 flex">
    <div className="h-full">
      <Dock/>
    </div>

    <div className="h-full w-full flex items-center justify-center">
      {
        activeWindow && (
          <WindowLayout title={activeWindow.title} closeWindow={closeWindow}>
            {activeWindow.component && <activeWindow.component/>}
          </WindowLayout>
        )
      }
    </div>


  </div>
}