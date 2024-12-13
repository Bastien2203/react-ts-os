import {EventManager} from "./EventManager.ts";
import {FileManager} from "./FileManager.ts";


export type OutputType = StandardOutput | ErrorOutput | undefined;

export interface StandardOutput {
  type: "standard";
  output: string;
}

export interface ErrorOutput {
  type: "error";
  output: string;
}

export class Command {
  static commands: { [key: string]: any } = {
    "ls": {
      command: this.ls,
      help: "ls [path] - List directory contents"
    },
    "cd": {
      command: this.cd,
      help: "cd [path] - Change the shell working directory"
    },
    "pwd": {
      command: this.pwd,
      help: "pwd - Print name of current/working directory"
    },
    "mkdir": {
      command: this.mkdir,
      help: "mkdir [path] - Create directories"
    },
    "touch": {
      command: this.touch,
      help: "touch [path] - Create files"
    },
    "rm": {
      command: this.rm,
      help: "rm [path] - Remove files or directories"
    },
    "cat": {
      command: this.cat,
      help: "cat [path] - Concatenate files and print on the standard output"
    },
    "echo": {
      command: this.echo,
      help: "echo [string] - Display a line of text"
    },
    "help": {
      command: this.help,
      help: "help - Display help for commands"
    },
    "clear": {
      command: this.clear,
      help: "clear - Clear the terminal screen"
    }
  };

  private static user = "user1";
  private static host = "localhost";
  private static currentdir = "/";

  static getUser() {
    return this.user;
  }

  static getHost() {
    return this.host;
  }

  static getCurrentDir() {
    return this.currentdir;
  }

  static changeUser(value: string) {
    EventManager.emit("userChanged", value);
    this.user = value;
  }

  static changeHost(value: string) {
    EventManager.emit("hostChanged", value);
    this.host = value;
  }

  static changeCurrentDir(value: string) {
    EventManager.emit("currentdirChanged", value);
    this.currentdir = value;
  }

  static exec(cmd: string): OutputType {
    if (cmd === "") {
      return;
    }

    let [mainCommand, ...redirectParts] = cmd.split(/\s*(>>|>|[|])\s*/);
    const [command, ...args] = mainCommand.split(" ");


    // Handle Pipes
    if (redirectParts[0] === "|") {
      const nextCommand = redirectParts.slice(1).join(" ");
      const firstOutput = this.execCommand(command, args);

      if (firstOutput?.type === "standard") {
        return this.exec(`${nextCommand} ${firstOutput.output}`);
      } else {
        return firstOutput;
      }
    }

    // Handle redirection
    try {
      if (redirectParts[0] === ">" || redirectParts[0] === ">>") {
        let path = redirectParts[1];
        if (!path.startsWith("/")) {
          path = `${Command.currentdir}${path}`;
        }
        const output = this.execCommand(command, args);

        if (output?.type === "standard") {
          let fileContent = output.output
          if (redirectParts[0] === ">>") {
            try {
              const file = FileManager.getFile(path);
              if (file.type !== "file") {
                return {
                  type: "error",
                  output: `cat: ${path}: Is a directory`
                }
              }
              const currentFileContent = file?.content || "";
              fileContent = currentFileContent + "\n" + fileContent;
            } catch (e: any) {
            }
          }

          FileManager.createFile(path, fileContent, true);
          return;
        } else {
          return output;
        }
      }
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }

    if (this.commands[command]) {
      return this.execCommand(command, args);
    } else {
      let path = command;
      if (!path?.startsWith("/")) {
        path = `${Command.currentdir}${path}`;
      }
      try{
        const file = FileManager.getFile(path);
        if (file.type === "file") {
          const content = file.content;
          const isScript = content.startsWith("#!script");
          if (isScript) {
            const scriptCommands = content.split(";").slice(1);
            const outputs: OutputType = {
              type: "standard",
              output: ""
            };
            for (const scriptCommand of scriptCommands) {
              const output = this.exec(scriptCommand);
              outputs.output += output?.output + "\n";
              if (output?.type === "error") {
                return output;
              }
            }
            return outputs;
          }
        }

      } catch (e: any) {
        return {
          type: "error",
          output: `Command '${command}' not found`
        }
      }

      return {
        type: "error",
        output: `Command '${command}' not found`
      };
    }
  }

  static execCommand(command: string, args: string[]): OutputType {
    if (args[args.length - 1] === "-h" || args[args.length - 1] === "--help") {
      return {
        type: "standard",
        output: this.commands[command].help
      }
    }

    return this.commands[command].command(args);
  }


  static ls(args: string[]): OutputType {
    try {
      const showPermission = args.includes("-l");
      const argsWithoutFlag = args.filter(arg => arg !== "-l");
      let path = argsWithoutFlag[0] || Command.currentdir;
      if (!path.startsWith("/")) {
        path = `${Command.currentdir}${path}`;
      }

      const directory = FileManager.getFile(path);
      if (directory.type !== "dir") {
        return {
          type: "error",
          output: `ls: ${path}: Not a directory`
        };
      }

      const files = FileManager.listDirectory(path);
      return {
        type: "standard",
        output: Object.keys(files).map((item) => {
          const file = files[item];
          if (showPermission) {
            return `${file.permissions} ${item}`;
          }
          return item;
        }).join("\n")
      };
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static cd(args: string[]): OutputType {
    try {
      let path = args[0] || "/";

      if (path === "..") {
        const segments = Command.currentdir.split("/").filter(segment => segment !== "");
        segments.pop();
        path = `/${segments.join("/")}`;
      }

      if (!path.startsWith("/")) {
        path = `${Command.currentdir}${path}`;
      }

      const directory = FileManager.getFile(path);
      if (directory.type !== "dir") {
        return {
          type: "error",
          output: `cd: ${path}: Not a directory`
        }
      }
      Command.changeCurrentDir(path === "/" ? path : `${path}/`);
      return;
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static pwd(): OutputType {
    return {
      type: "standard",
      output: Command.currentdir
    }
  }

  static mkdir(args: string[]): OutputType {
    try {
      if (args.length === 0) {
        return {
          type: "error",
          output: "mkdir: missing operand"
        }
      }
      const path = `${Command.currentdir}/${args[0]}`;
      FileManager.createDirectory(path);
      return;
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static touch(args: string[]): OutputType {
    try {
      if (args.length === 0) {
        return {
          type: "error",
          output: "touch: missing operand"
        }
      }
      const path = `${Command.currentdir}/${args[0]}`;
      FileManager.createFile(path, "");
      return;
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static rm(args: string[]): OutputType {
    try {
      if (args.length === 0) {
        return {
          type: "error",
          output: "rm: missing operand"
        }
      }
      const path = `${Command.currentdir}/${args[0]}`;
      FileManager.delete(path);
      return;
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static cat(args: string[]): OutputType {
    try {
      if (args.length === 0) {
        return {
          type: "error",
          output: "cat: missing operand"
        }
      }
      let path = args[0];
      if (!path.startsWith("/")) {
        path = `${Command.currentdir}${path}`;
      }
      const file = FileManager.getFile(path);
      if (file.type !== "file") {
        return {
          type: "error",
          output: `cat: ${path}: Is a directory`
        }
      }
      return {
        type: "standard",
        output: file.content
      }
    } catch (e: any) {
      return {
        type: "error",
        output: e.message
      }
    }
  }

  static echo(args: string[]): OutputType {
    const output = args.join(" ").replace(/"/g, "");

    return {
      type: "standard",
      output: output
    }
  }

  static help(): OutputType {
    return {
      type: "standard",
      output: Object.values(Command.commands).map((command) => command.help).join("\n")
    }
  }

  static clear(): OutputType {
    EventManager.emit("clear", undefined);
    return {
      type: "standard",
      output: ""
    }
  }
}
