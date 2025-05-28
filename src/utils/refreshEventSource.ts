import { isRefreshInProgress, queueEventSource } from '@/utils/refreshManager';

export function createRefreshEventSource(
  url: string,
  options?: EventSourceInit,
): Promise<EventSource> {
  return new Promise((resolve, reject) => {
    const instantiate = () => {
      try {
        const es = new EventSource(url, options);
        resolve(es);
      } catch (err) {
        reject(err);
      }
    };

    if (isRefreshInProgress()) {
      queueEventSource(instantiate);
    } else {
      instantiate();
    }
  });
}
