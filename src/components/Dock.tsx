import { WindowManager } from "../services/WindowManager.ts";

interface DockProps {
  windowManager: WindowManager;
}

export const Dock = (props: DockProps) => {
  const windows = props.windowManager.getWindows();
  const activeWindow = props.windowManager.getActiveWindows();

  const openWindow = (window: string) => {
    props.windowManager.addActiveWindow(window);
  };

  return (
    <div
      className="h-full bg-white/70 shadow-lg rounded-tr-lg rounded-br-lg"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex flex-col items-center p-2 gap-3">
        {Object.keys(windows).map((key) => {
          const window = windows[key];
          const isActive = activeWindow.find((w) => w.title === window.title);

          return (
            <button
              key={key}
              onClick={() => openWindow(key)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                isActive ? "bg-gray-700 scale-110 shadow-md" : "bg-gray-400 hover:scale-105"
              }`}
            >
              <window.icon className="w-4 h-4 text-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
