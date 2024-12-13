import {EventManager} from "./EventManager.ts";
import Terminal from "../components/windows/Terminal.tsx";
import {Editor} from "../components/windows/Editor.tsx";
import {IoTerminal} from "react-icons/io5";
import {IoDocumentText} from "react-icons/io5";


export interface Window {
  component: any;
  title: string;
  icon: any;
}


export interface ActiveWindow extends Window {
  id: string;
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

  private static activeWindow: ActiveWindow[] = [];

  static getActiveWindows() {
    return this.activeWindow;
  }

  static getWindows() {
    return this.windows;
  }

  static addActiveWindow(window: string) {
    const newWindow = {
      id: window + Date.now().toString(),
      ...this.windows[window]
    }
    EventManager.emit("windowAdded", newWindow);
    this.activeWindow.push(newWindow);
  }

  static removeActiveWindow(id: string) {
    EventManager.emit("windowRemoved", id);
    this.activeWindow = this.activeWindow.filter((w) => w.id !== id);
  }
}