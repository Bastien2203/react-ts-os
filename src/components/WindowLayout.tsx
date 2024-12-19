import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import {IoIosClose} from "react-icons/io";
import {FiMaximize2} from "react-icons/fi";
import {useSettings} from "../hooks/useSettings.ts";

export interface WindowLayoutProps {
  title: string;
  icon: React.JSX.Element;
  closeWindow: () => void;
  zIndex: number;
  setFocus: () => void;
}

export const WindowLayout = (props: PropsWithChildren<WindowLayoutProps>) => {
  const [isDragging, setIsDragging] = useState<"pointer" | "mouse" | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: 50, y: 50});
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({x: 0, y: 0});
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const titleBarRef = useRef<HTMLDivElement | null>(null);
  const [titleBarHeight, setTitleBarHeight] = useState<number>(0);
  const [windowBackgroundColor] = useSettings("appearance", "windowBackgroundColor");
  const [windowLayoutBackgroundColor] = useSettings("appearance", "windowLayoutBackgroundColor");


  useEffect(() => {
    if (titleBarRef.current) {
      setTitleBarHeight(titleBarRef.current.clientHeight);
    }
  });

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
        top: fullscreen ? 0 : position.y,
        left: fullscreen ? 0 : position.x,
        zIndex: props.zIndex,
        width: fullscreen ? "100%" : "80%",
        maxWidth: fullscreen ? "100%" : "800px",
        height: fullscreen ? "100%" : "70%",
        backgroundColor: windowLayoutBackgroundColor,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Title bar */}
      <div
        className={`w-full flex items-center justify-between bg-gray-800 text-gray-300 px-3 py-2 select-none ${
          fullscreen ? "" : "cursor-move"
        }`}
        ref={titleBarRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
        onMouseDown={(e) => {
          if (fullscreen) return;
          setIsDragging("mouse");
          onMouseDown(e);
        }}
        onPointerDown={(e) => {
          if (fullscreen) return;
          setIsDragging("pointer");
          onMouseDown(e);
        }}
      >
        {/* Title */}
        <div className="flex items-center space-x-2">
          {props.icon}

          <div className="flex-1 font-medium truncate">{props.title}</div>
        </div>
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
            onClick={() => setFullscreen((prev) => !prev)}
          >
            <FiMaximize2 className="w-2 h-2 text-white"/>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: windowBackgroundColor,
          paddingTop: titleBarHeight
        }}
        className="w-full h-full overflow-auto"
      >
        {props.children}
      </div>
    </div>

  );
};
