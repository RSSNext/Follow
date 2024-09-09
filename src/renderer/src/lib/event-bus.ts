// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomEvent {}
export interface EventBusMap extends CustomEvent {}

class EventBusEvent extends Event {
  static type = "EventBusEvent"
  constructor(
    public _type: string,
    public data: any,
  ) {
    super(EventBusEvent.type)
  }
}
class EventBusStatic {
  dispatch<T extends keyof EventBusMap>(event: T, data: EventBusMap[T]) {
    window.dispatchEvent(new EventBusEvent(event, data))
  }

  subscribe<T extends keyof EventBusMap>(event: T, callback: (data: EventBusMap[T]) => void) {
    const handler = (e: any) => {
      if (e instanceof EventBusEvent && e._type === event) {
        callback(e.data)
      }
    }
    window.addEventListener(EventBusEvent.type, handler)

    return this.unsubscribe.bind(this, event, handler)
  }

  unsubscribe(event: string, handler: (e: any) => void) {
    window.removeEventListener(EventBusEvent.type, handler)
  }
}

export const EventBus = new EventBusStatic()
