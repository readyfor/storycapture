/**
 *
 * @returns Whether current process runs in Storycapture browser.
 *
 **/
export function isScreenshot() {
  return !!(window as any).emitCapture;
}
