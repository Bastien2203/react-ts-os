import {File, FileManager} from "../../services/FileManager.ts";
import {useEffect, useState} from "react";


export const Editor = (props: {
  filePath?: string
}) => {
  const [file, setFile] = useState<File>()
  const [content, setContent] = useState<string>("")
  const [state, setState] = useState<"saved" | "saving" | "not-saved">("not-saved")

  const saveFile = () => {
    if (file && props.filePath) {
      file.content = content
      FileManager.createFile(props.filePath, content, true)
      setState("saved")
    }
  }

  useEffect(() => {
    if (file?.content !== content) {
      setState("not-saved")
    } else {
      setState("saved")
    }

  }, [content])

  useEffect(() => {
    if (!props.filePath) {
      return
    }

    const file = FileManager.getFile(props.filePath)
    if (file.type === "file") {
      setFile(file)
      setContent(file.content)
      setState("saved")
    }

  }, [props.filePath])

  return <>
    <div className="flex justify-between items-center px-2 border-b border-gray-800 mb-2">
      <div className="text-gray-400 text-nowrap">{props.filePath}</div>
      <div className="text-gray-400 text-nowrap">{state === "saved" ? "Saved" : (
        <button onClick={saveFile} className="text-blue-400 ">Save</button>
      )}</div>
    </div>


    <textarea className="h-full w-full outline-0 bg-transparent" onChange={(e) => {
      if (file) {
        setContent(e.currentTarget.value)
      }
    }} defaultValue={file?.content}>

  </textarea></>
}