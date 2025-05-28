/* eslint-disable @typescript-eslint/no-explicit-any */
let isRefreshing = false;
const failedRequests: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];
const pendingEventSources: Array<() => void> = [];

export function startRefresh() {
  isRefreshing = true;
}

export function finishRefresh(success: boolean) {
  isRefreshing = false;
  // Axios 큐 처리
  failedRequests
    .splice(0)
    .forEach((p) =>
      success ? p.resolve() : p.reject(new Error('refresh failed')),
    );
  // EventSource 큐 처리
  pendingEventSources.splice(0).forEach((create) => create());
}

export function queueRequest(
  executor: (resolve: () => void, reject: (err: any) => void) => void,
) {
  return new Promise<void>((resolve, reject) => {
    executor(
      () => failedRequests.push({ resolve: () => resolve(), reject }),
      () => failedRequests.push({ resolve, reject: (err) => reject(err) }),
    );
  });
}

export function queueEventSource(createFn: () => void) {
  pendingEventSources.push(createFn);
}

export function isRefreshInProgress() {
  return isRefreshing;
}
