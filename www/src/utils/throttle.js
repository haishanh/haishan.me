export default function throttle(fn, ms) {
  let timeoutId = null;

  function wrappered(...args) {
    // it's running
    if (timeoutId !== null) return;
    // it's not running, let's run it
    timeoutId = setTimeout(() => (timeoutId = null), ms);
    fn(...args);
    // clear timeout when we are done
    timeoutId = null;
  }
  return wrappered;
}
