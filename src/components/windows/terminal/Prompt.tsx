import {PromptPrefix} from "./PromptPrefix.tsx";
import {useState} from "react";

interface PromptProps {
  onPromptEnter: (prompt: string) => void;
  user: string;
  host: string;
  currentdir: string;
  getPromptInHistory: (index: number) => string;
}

export const Prompt = (props: PromptProps) => {
  const [historyIndex, setHistoryIndex] = useState<number>(0)


  return (

    <div className="flex items-center">
      <PromptPrefix user={props.user} host={props.host} cwd={props.currentdir}/>
      <input
        autoFocus
        contentEditable
        className="w-full bg-transparent outline-0"
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            props.onPromptEnter(e.currentTarget.value)
            e.currentTarget.value = ''
          } else if (e.key === 'ArrowUp') {
            setHistoryIndex(historyIndex + 1)
            e.currentTarget.value = props.getPromptInHistory(historyIndex)
          }

        }}
      />
    </div>
  )

}