import {PropsWithChildren, useEffect, useState} from "react";
import {WindowManager} from "../services/WindowManager.ts";
import {IoIosClose} from "react-icons/io";

export interface WindowLayoutProps {
  title: string;
  closeWindow: () => void;
  zIndex: number;
  setFocus: () => void;
}

export const WindowLayout = (props: PropsWithChildren<WindowLayoutProps>) => {

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [position, setPosition] = useState<{ x: number; y: number }>({x: 100, y: 100});
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({x: 0, y: 0});


  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
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
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="h-[70%] w-[90%] max-w-[1000px] rounded overflow-clip absolute"
         onMouseDown={props.setFocus}
         style={{top: position.y, left: position.x, zIndex: props.zIndex}}>
      <div className={`w-full px-2 flex items-center justify-between cursor-move`}
           style={{backgroundColor: WindowManager.primaryColor}}>
        <div className="w-full" onMouseDown={onMouseDown}>{props.title}</div>

        <button className="bg-red-500 rounded-full" onClick={props.closeWindow}><IoIosClose/>
        </button>
      </div>
      <div className="w-full h-full">
        {props.children}
      </div>
    </div>

  )

}