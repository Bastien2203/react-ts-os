import {PropsWithChildren, useEffect, useState} from "react";
import {IoIosClose} from "react-icons/io";
import {Theme} from "../services/Theme.ts";
import {FiMaximize2} from "react-icons/fi";

export interface WindowLayoutProps {
  title: string;
  closeWindow: () => void;
  zIndex: number;
  setFocus: () => void;
}

export const WindowLayout = (props: PropsWithChildren<WindowLayoutProps>) => {
  const [isDragging, setIsDragging] = useState<"pointer" | "mouse" | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: 50, y: 50});
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({x: 0, y: 0});

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const onMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging === "mouse") {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else if (isDragging === "pointer") {
      window.addEventListener("pointermove", onMouseMove);
      window.addEventListener("pointerup", onMouseUp);
    } else if (isDragging === null) {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("pointerup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("pointerup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="absolute rounded-md shadow-xl overflow-hidden"
      onMouseDown={props.setFocus}
      style={{
        top: position.y,
        left: position.x,
        zIndex: props.zIndex,
        width: "80%",
        maxWidth: "800px",
        height: "70%",
        backgroundColor: Theme.windowLayoutBackgroundColor,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Title bar */}
      <div
        className="w-full flex items-center justify-between cursor-move bg-gray-800 text-gray-300 px-3 py-2"
        onMouseDown={(e) => {
          setIsDragging("mouse");
          onMouseDown(e);
        }}
        onPointerDown={(e) => {
          setIsDragging("pointer");
          onMouseDown(e);
        }}
      >
        {/* Title */}
        <div className="flex-1 font-medium truncate">{props.title}</div>
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="flex justify-center items-centerw-3.5 h-3.5 bg-red-600 hover:bg-red-700 rounded-full transition-all"
            onClick={props.closeWindow}
            title="Close"
          >
            <IoIosClose className="w-3.5 h-3.5 text-white"/>
          </button>
          <button
            className="flex justify-center items-center w-3.5 h-3.5 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all"
            title="Minimize"
          >
            <div className=" text-white">
              -
            </div>
          </button>
          <button
            className="flex justify-center items-center w-3.5 h-3.5 bg-green-500 hover:bg-green-600 rounded-full transition-all"
            title="Maximize"
          >
            <FiMaximize2 className="w-2 h-2 text-white"/>

          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{backgroundColor: Theme.windowBackgroundColor}}
        className="w-full h-full overflow-auto"
      >
        {props.children}
      </div>
    </div>
  );
};
