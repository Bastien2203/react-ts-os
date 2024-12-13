import { useContext } from "react";
import { WindowManagerContext } from "../../WindowManagerContext.tsx";

export const ActivityMonitor = () => {
  const context = useContext(WindowManagerContext);

  if (!context) {
    return null;
  }

  const windows = context.windowManager.getActiveWindows();

  const handleKillWindow = (id: string) => {
    context.windowManager.removeActiveWindow(id);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-50">Activity Monitor</h2>
      <div className="flex flex-col gap-2 overflow-y-auto h-full py-5 border-t border-gray-700">
        {windows.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No active windows</div>
        ) : (
          windows.map((window, index) => (
            <div
              key={window.id}
              className={`flex justify-between items-center p-2 rounded-md ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold">{window.title}</span>
                <span className="text-xs text-gray-400">ID: {window.id}</span>
              </div>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-all text-sm"
                onClick={() => handleKillWindow(window.id)}
              >
                Kill
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
