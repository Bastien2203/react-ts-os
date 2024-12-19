export interface File {
  type: "file";
  content: string;
  permissions: string; // e.g., "rw-r--r--"
}

export interface Directory {
  type: "dir";
  children: FileTree;
  permissions: string; // e.g., "rwxr-xr-x"
}

export type FileTree = { [key: string]: File | Directory };

export class FileManager {

  private static fileSystem: FileTree = {
    ".": {
      type: "dir",
      permissions: "rwxr-xr-x",
      children: {
        "file1": {
          type: "file",
          content: "#!script;echo Hello World",
          permissions: "rw-r--r--",
        },
        "dir1": {
          type: "dir",
          permissions: "rwxr-xr-x",
          children: {
            "file2": {
              type: "file",
              content: "Hello Again",
              permissions: "rw-r--r--",
            },
          },
        },
        "Desktop": {
          type: "dir",
          permissions: "rwxr-xr-x",
          children: {
            "testfile": {
              type: "file",
              content: "this is a test file",
              permissions: "rw-r--r--",
            },
            "testdir": {
              type: "dir",
              permissions: "rwxr-xr-x",
              children: {
                "testfile2": {
                  type: "file",
                  content: "this is another test file",
                  permissions: "rw-r--r--",
                },
              },
            }
          },
        },
      },
    },
  };

  private static resolvePath(path: string): string[] {
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path: ${path}`);
    }
    return path.split("/").filter(segment => segment !== "");
  }

  static getFile(path: string): File | Directory {
    const segments = this.resolvePath(path);
    let current: File | Directory = this.fileSystem["."];

    for (const segment of segments) {
      if (current.type !== "dir") {
        throw new Error(`Not a directory: ${segment}`);
      }
      const child = current.children[segment];
      if (!child) {
        throw new Error(`No such file or directory: ${segment}`);
      }
      current = child;
    }

    return current;
  }

  static createFile(path: string, content: string, overwrite: boolean = false, permissions = "rw-r--r--"): void {
    const segments = this.resolvePath(path);
    const fileName = segments.pop();
    if (!fileName) {
      throw new Error("Invalid file name");
    }

    let current: Directory = this.fileSystem["."] as Directory;
    for (const segment of segments) {
      const child = current.children[segment];
      if (!child || child.type !== "dir") {
        throw new Error(`No such directory: ${segment}`);
      }
      current = child;
    }

    if (!overwrite && current.children[fileName]) {
      throw new Error("File already exists");
    }

    current.children[fileName] = {
      type: "file",
      content,
      permissions,
    };
  }

  static createDirectory(path: string, permissions = "rwxr-xr-x"): void {
    const segments = this.resolvePath(path);
    const dirName = segments.pop();
    if (!dirName) {
      throw new Error("Invalid directory name");
    }

    let current: Directory = this.fileSystem["."] as Directory;
    for (const segment of segments) {
      const child = current.children[segment];
      if (!child || child.type !== "dir") {
        throw new Error(`No such directory: ${segment}`);
      }
      current = child;
    }

    if (current.children[dirName]) {
      throw new Error("Directory already exists");
    }

    current.children[dirName] = {
      type: "dir",
      permissions,
      children: {},
    };
  }

  static listDirectory(path: string): FileTree {
    const dir = this.getFile(path);
    if (dir.type !== "dir") {
      throw new Error("Not a directory");
    }
    return dir.children;
  }

  static delete(path: string): void {
    const segments = this.resolvePath(path);
    const name = segments.pop();
    if (!name) {
      throw new Error("Invalid path");
    }

    let current: Directory = this.fileSystem["."] as Directory;
    for (const segment of segments) {
      const child = current.children[segment];
      if (!child || child.type !== "dir") {
        throw new Error(`No such directory: ${segment}`);
      }
      current = child;
    }

    if (!current.children[name]) {
      throw new Error("No such file or directory");
    }

    delete current.children[name];
  }
}