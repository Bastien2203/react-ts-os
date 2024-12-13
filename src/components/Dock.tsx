import {WindowManager} from "../services/WindowManager.ts";

export const Dock = () => {
  const windows = WindowManager.getWindows();
  const activeWindow = WindowManager.getActiveWindows();

  const openWindow = (window: string) => {
    WindowManager.addActiveWindow(window);
  }


  return <div className="h-full" style={{
    backgroundColor: 'rgba(255,255,255,0.7)'
  }}>
    <div className="flex flex-col items-center p-2 gap-2" >
      {
        Object.keys(windows).map((key) => {
          const window = windows[key];
          return <button
            key={key}
            onClick={() => openWindow(key)}
            className={`p-2 rounded-lg ${activeWindow?.title === window.title ? "bg-gray-600" : "bg-gray-400"}`}
          >
            {
              <window.icon/>
            }
          </button>
        })
      }
    </div>
  </div>

}