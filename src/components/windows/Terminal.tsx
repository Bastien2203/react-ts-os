import {Prompt} from "../Prompt.tsx";
import {useEffect, useRef, useState} from "react";
import {PromptPrefix} from "../PromptPrefix.tsx";
import {EventManager} from "../../services/EventManager.ts";
import {CommandManager, OutputType} from "../../services/CommandManager.ts";


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
  const [user, setUser] = useState<string>("")
  const [host, setHost] = useState<string>("")
  const [currentdir, setCurrentdir] = useState<string>("")
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const [commandManager] = useState(new CommandManager(new EventManager()));

  useEffect(() => {
    setUser(commandManager.getUser())
    setHost(commandManager.getHost())
    setCurrentdir(commandManager.getCurrentDir())

    commandManager.eventManager.on("userChanged", (value: string) => {
      setUser(value)
    });
    commandManager.eventManager.on("hostChanged", (value: string) => {
      setHost(value)
    });
    commandManager.eventManager.on("currentdirChanged", (value: string) => {
      setCurrentdir(value)
    });
    commandManager.eventManager.on("clear", () => {
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

    const output = commandManager.exec(prompt);
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
      className="h-full flex flex-col overflow-y-scroll text-gray-200 font-mono shadow-lg"
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
