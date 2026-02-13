export type EventType = "AUTH_STATE_CHANGED" | "USER_PROFILE_UPDATED";

type Callback = (data?: any) => void;

const listeners: Record<EventType, Callback[]> = {
  AUTH_STATE_CHANGED: [],
  USER_PROFILE_UPDATED: [],
};

export const subscribe = (
  event: EventType,
  callback: Callback,
): (() => void) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }

  listeners[event].push(callback);

  return () => {
    const index = listeners[event].indexOf(callback);
    if (index > -1) {
      listeners[event].splice(index, 1);
    }
  };
};

export const publish = (event: EventType, data?: any): void => {
  if (listeners[event]) {
    listeners[event].forEach((callback) => callback(data));
  }
};

const eventBus = {
  subscribe,
  publish,
};

export default eventBus;
