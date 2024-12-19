import {EventManager} from "./EventManager.ts";
import Terminal from "../components/windows/terminal/Terminal.tsx";
import {Editor} from "../components/windows/Editor.tsx";
import {IoTerminal} from "react-icons/io5";
import {IoDocumentText} from "react-icons/io5";
import {MdMonitorHeart} from "react-icons/md";
import {ActivityMonitor} from "../components/windows/ActivityMonitor.tsx";
import {FileExplorer} from "../components/windows/FileExplorer.tsx";
import {FaFolder} from "react-icons/fa";
import {Preferences} from "../components/windows/Preferences.tsx";
import {IoMdSettings} from "react-icons/io";
import {Settings} from "./Settings.ts";


export interface Window {
  component: any;
  title: string;
  icon: any;
  args?: any;
}


export interface ActiveWindow extends Window {
  id: string;
}

export class WindowManager {
  public settings: Settings

  constructor(public eventManager: EventManager) {
    this.settings = new Settings(eventManager);
  }

  private windows: { [key: string]: Window } = {
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
    "activityMonitor": {
      component: ActivityMonitor,
      title: "Activity Monitor",
      icon: MdMonitorHeart
    },
    "fileExplorer": {
      component: FileExplorer,
      title: "File Explorer",
      icon: FaFolder
    },
    "preferences": {
      component: Preferences,
      title: "Preferences",
      icon: IoMdSettings
    }
  }

  private activeWindow: ActiveWindow[] = [];

  getActiveWindows() {
    return this.activeWindow;
  }

  getWindows() {
    return this.windows;
  }

  addActiveWindow(window: string, args?: any) {
    const newWindow = {
      id: window + Date.now().toString() + Math.random().toString(),
      args: args,
      ...this.windows[window]
    }
    this.eventManager.emit("windowAdded", newWindow);
    this.activeWindow.push(newWindow);
  }

  openFile(path: string) {
    this.addActiveWindow("editor", {filePath: path});
  }

  openDirectory(path: string) {
    this.addActiveWindow("fileExplorer", {dirPath: path});
  }

  removeActiveWindow(id: string) {
    this.eventManager.emit("windowRemoved", id);
    this.activeWindow = this.activeWindow.filter((w) => w.id !== id);
  }
}