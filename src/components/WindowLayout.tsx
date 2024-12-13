import {PropsWithChildren} from "react";
import {WindowManager} from "../services/WindowManager.ts";
import {IoIosClose} from "react-icons/io";

export interface WindowLayoutProps {
  title: string;
  closeWindow: () => void;
}

export const WindowLayout = (props: PropsWithChildren<WindowLayoutProps>) => {

  return (
    <div className="h-[70%] w-[90%] max-w-[1000px] rounded overflow-clip">
      <div className={`w-full px-2 flex items-center justify-between`} style={{backgroundColor: WindowManager.primaryColor}}>
        {props.title}

        <button className="bg-red-500 rounded-full" onClick={props.closeWindow}><IoIosClose />
        </button>
      </div>
      <div className="w-full h-full">
        {props.children}
      </div>
    </div>

  )

}