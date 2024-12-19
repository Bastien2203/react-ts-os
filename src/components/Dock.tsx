import {useContext} from "react";
import {WindowManagerContext} from "../WindowManagerContext.tsx";


export const Dock = () => {
  const context = useContext(WindowManagerContext);
  const windows = context!!.windowManager.getWindows();
  const activeWindow = context!!.windowManager.getActiveWindows();

  const openWindow = (window: string) => {
    context?.windowManager.addActiveWindow(window);
  };

  return (
    <div
      className="h-full bg-white/70 shadow-lg rounded-tr-lg rounded-br-lg select-none"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex flex-col items-center p-2 gap-3">
        {Object.keys(windows).map((key) => {
          const window = windows[key];
          const isActive = activeWindow.find((w) => w.title === window.title);

          return (
            <div key={key} className="relative group">
              {/* Button */}
              <button
                onClick={() => openWindow(key)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  isActive ? "bg-gray-700 scale-110 shadow-md" : "bg-gray-400 hover:scale-105"
                }`}
              >
                <window.icon className="w-4 h-4 text-white"/>
              </button>

              {/* Tooltip */}
              <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{whiteSpace: "nowrap"}}
              >
                {window.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
