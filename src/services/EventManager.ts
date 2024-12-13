export class EventManager {
  private listeners: { [key: string]: Function } = {}

  on(event: string, listener: Function) {
    this.listeners[event] = listener
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event](...args)
    }
  }
}