import {useContext, useEffect, useState} from "react";
import {FileManager, FileTree} from "../services/FileManager.ts";
import {WindowManagerContext} from "../WindowManagerContext.tsx";
import {FaFileAlt, FaFolder} from "react-icons/fa";
import {useSettings} from "../hooks/useSettings.ts";

export const Desktop = () => {
  const [files, setFiles] = useState<FileTree>();
  const [selectedFile, setSelectedFile] = useState<string>();

  const context = useContext(WindowManagerContext);
  const [desktopDirectory] = useSettings("paths", "desktop");

  useEffect(() => {
    const fileTree = FileManager.listDirectory(desktopDirectory);
    setFiles(fileTree);
  }, [desktopDirectory]);

  if (!files) {
    return <></>;
  }

  return <div className="h-full w-full" onClick={() => setSelectedFile(undefined)}>
    {Object.keys(files).length === 0 ? (
      <></>
    ) : (
      <div className="flex flex-wrap select-none">
        {
          Object.keys(files).map((name) => {
            const file = files[name];
            return (
              <div
                key={name}
                className={`flex flex-col w-20 h-20 items-center gap-2 p-3 cursor-pointer ${
                  selectedFile === name ? "bg-blue-400/70" : "hover:bg-gray-600"
                }`}
                onDoubleClick={() => {
                  if (file.type === "dir") {
                    context?.windowManager.openDirectory(desktopDirectory + name);
                    setSelectedFile(undefined);
                  } else {
                    context?.windowManager.openFile(desktopDirectory + name);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(name)
                }}
              >
                {file.type === "dir" ? <FaFolder className="text-yellow-500 w-7 h-7"/> :
                  <FaFileAlt className="w-7 h-7"/>}
                <span className="text-white truncate">{name}</span>
              </div>
            );
          })
        }</div>
    )}
  </div>
}