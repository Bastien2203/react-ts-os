import {Prompt} from "../Prompt.tsx";
import {useEffect, useRef, useState} from "react";
import {PromptPrefix} from "../PromptPrefix.tsx";
import {EventManager} from "../../services/EventManager.ts";
import {Command, OutputType} from "../../services/Command.ts";


export type PromptType = OutputType | CommandPrompt;


export interface CommandPrompt {
  type: "command";
  user: string;
  host: string;
  currentdir: string;
  prompt: string;
}


function Terminal() {
  const [history, setHistory] = useState<PromptType[]>([])
  const [user, setUser] = useState<string>(Command.getUser())
  const [host, setHost] = useState<string>(Command.getHost())
  const [currentdir, setCurrentdir] = useState<string>(Command.getCurrentDir())
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    EventManager.on("userChanged", (value: string) => {
      setUser(value)
    });
    EventManager.on("hostChanged", (value: string) => {
      setHost(value)
    });
    EventManager.on("currentdirChanged", (value: string) => {
      setCurrentdir(value)
    });
    EventManager.on("clear", () => {
      setHistory([])
    });
  }, []);


  const onPromptEnter = (prompt: string) => {
    setHistory((prev) => [...prev, {
      type: "command",
      user,
      host,
      currentdir,
      prompt,
    }])

    const output = Command.exec(prompt);
    setHistory((prev) => [...prev, output])
  }
  const getPromptInHistory = (index: number) => {
    const item = history.filter((item) => item?.type === "command")[history.length - index - 1];
    return item?.prompt || ""
  }

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history]);


  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll bg-slate-900 text-gray-200 font-mono shadow-lg"
      ref={terminalContainerRef}
      id="terminal">


      <div className="px-2 pt-2">
        {
          history.map((item, index) => (

            <div key={index} className="flex items-center transition-opacity duration-300 ease-in">
              {
                item?.type === "command" ? (
                  <>
                    <PromptPrefix user={item.user} host={item.host} cwd={item.currentdir}/>
                    {item.prompt}
                  </>
                ) : item?.type === "error" ? (
                  <pre className="text-red-500">{item.output}</pre>
                ) : item?.type === "standard" ? (
                  <pre>{item.output}</pre>
                ) : <></>
              }

            </div>
          ))
        }
      </div>

      <div className="px-2">
        <Prompt onPromptEnter={onPromptEnter} user={user} host={host} currentdir={currentdir}
                getPromptInHistory={getPromptInHistory}/>
      </div>
    </div>
  )
}

export default Terminal
