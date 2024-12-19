export class EventManager {
  private listeners: { [key: string]: Function } = {}

  on(event: string, listener: Function) {
    this.listeners[event] = listener
  }

  off(event: string, listener: Function) {
    if (this.listeners[event] === listener) {
      delete this.listeners[event]
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event](...args)
    }
  }
}