import {useContext, useEffect, useState} from "react";
import {FileManager, FileTree} from "../../services/FileManager.ts";
import {FaArrowLeft, FaFileAlt, FaFolder, FaPlus, FaTrash} from "react-icons/fa";
import {WindowManagerContext} from "../../WindowManagerContext.tsx";

export const FileExplorer = (props: {
  dirPath?: string
}) => {
  const [currentPath, setCurrentPath] = useState<string>(props.dirPath ?? "/");
  const [files, setFiles] = useState<FileTree>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const context = useContext(WindowManagerContext);

  useEffect(() => {
    const fileTree = FileManager.listDirectory(currentPath);
    setFiles(fileTree);
  }, [currentPath]);

  if (!files) {
    return <></>;
  }

  // Handlers for file system actions
  const handleCreate = (type: "file" | "dir") => {
    const name = prompt(`Enter ${type} name:`);
    if (name) {
      const path = currentPath + name;
      if (type === "dir") FileManager.createDirectory(path);
      else FileManager.createFile(path, "");
      const fileTree = FileManager.listDirectory(currentPath);
      setFiles({...fileTree});
    }
  };

  const handleDelete = () => {
    if (selectedFile) {
      if (confirm(`Are you sure you want to delete '${selectedFile}'?`)) {
        FileManager.delete(currentPath + selectedFile);
        setSelectedFile(undefined);
        setFiles(FileManager.listDirectory(currentPath));
      }
    }
  };

  const handleNavigateUp = () => {
    const parentPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;
    const newPath = parentPath.substring(0, parentPath.lastIndexOf("/")) || "/";
    setCurrentPath(newPath);
    setSelectedFile(undefined);
  };

  return (
    <div
      className="h-full w-full p-4 rounded-md"
      onClick={() => setSelectedFile(undefined)}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {
            currentPath !== "/" && (
              <button
                className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                onClick={handleNavigateUp}
                title="Go back"
              >
                <FaArrowLeft/>
              </button>
            )
          }
          <div className="text-gray-400">
            {currentPath.split("/").map((segment, index) => {
              if (segment === "") {
                return null;
              }
              return (
                <span key={index}>
                  {segment}
                  <span className="">&nbsp;/&nbsp;</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 select-none">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md shadow-md  "
            onClick={() => handleCreate("dir")}
            title="Create Folder"
          >
            <FaPlus/> <span>Folder</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md shadow-md  "
            onClick={() => handleCreate("file")}
            title="Create File"
          >
            <FaPlus/> <span>File</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md shadow-md   ${!selectedFile ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleDelete}
            title="Delete"
            disabled={!selectedFile}
          >
            <FaTrash/> <span>Delete</span>
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="border border-gray-600 rounded-md overflow-hidden mb-5 select-none">
        {Object.keys(files).length === 0 ? (
          <div className="p-4 text-center text-gray-400">This folder is empty</div>
        ) : (
          Object.keys(files).map((name) => {
            const file = files[name];
            return (
              <div
                key={name}
                className={`flex items-center gap-4 p-3 cursor-pointer ${
                  selectedFile === name ? "bg-blue-400/70" : "hover:bg-gray-600"
                }`}
                onDoubleClick={() => {
                  if (file.type === "dir") {
                    setCurrentPath(currentPath + name + "/");
                    setSelectedFile(undefined);
                  } else {
                    context?.windowManager.openFile(currentPath + name);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(name)
                }}
              >
                {file.type === "dir" ? <FaFolder className="text-yellow-500"/> : <FaFileAlt/>}
                <span className="text-white truncate">{name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};