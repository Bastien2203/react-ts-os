import {EventManager} from "./EventManager.ts";
import Terminal from "../components/windows/Terminal.tsx";
import {Editor} from "../components/windows/Editor.tsx";
import { IoTerminal } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";



export interface Window {
  component: any;
  title: string;
  icon: any;
}

export class WindowManager {

  static primaryColor: string = "#979797";

  private static windows: { [key: string]: Window } = {
    "terminal": {
      component: Terminal,
      title: "Terminal",
      icon: IoTerminal
    },
    "editor": {
      component: Editor,
      title: "Editor",
      icon: IoDocumentText
    },
  }

  private static activeWindow?: Window = WindowManager.windows["terminal"];

  static getActiveWindow() {
    return this.activeWindow;
  }

  static getWindows() {
    return this.windows;
  }

  static setActiveWindow(window?: string) {
    if (!window) {
      this.activeWindow = undefined;
      EventManager.emit("windowChanged", undefined);
      return;

    }
    const newWindow = this.windows[window];
    EventManager.emit("windowChanged", newWindow);
    this.activeWindow = newWindow;
  }
}