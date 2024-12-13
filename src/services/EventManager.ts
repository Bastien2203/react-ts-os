export class EventManager {
  private static listeners: { [key: string]: Function } = {}

  static on(event: string, listener: Function) {
    this.listeners[event] = listener
  }

  static emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event](...args)
    }
  }
}