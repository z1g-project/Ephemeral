// this is a botched typescript version of the npm package "throttle-debounce"

type ThrottleOptions = {
	noTrailing?: boolean;
	noLeading?: boolean;
	debounceMode?: boolean;
};

type CancelOptions = {
	upcomingOnly?: boolean;
};

function throttle(
	delay: number,
	callback: (...args: any[]) => void,
	options?: ThrottleOptions,
) {
	const {
		noTrailing = false,
		noLeading = false,
		debounceMode = false,
	} = options ?? {};
	/*
	 * After wrapper has stopped being called, this timeout ensures that
	 * `callback` is executed at the proper times in `throttle` and `end`
	 * debounce modes.
	 */

	let timeoutID: NodeJS.Timeout | number;
	let cancelled = false; // Keep track of the last time `callback` was executed.

	let lastExec = 0; // Function to clear existing timeout

	function clearExistingTimeout() {
		if (timeoutID) {
			clearTimeout(timeoutID);
		}
	} // Function to cancel next exec

	function cancel(options: CancelOptions) {
		const { upcomingOnly = false } = options;
		clearExistingTimeout();
		cancelled = !upcomingOnly;
	}
	/*
	 * The `wrapper` function encapsulates all of the throttling / debouncing
	 * functionality and when executed will limit the rate at which `callback`
	 * is executed.
	 */

	function wrapper(this: any, ...args: any[]) {
		const self = this;
		const elapsed = Date.now() - lastExec;

		if (cancelled) {
			return;
		} // Execute `callback` and update the `lastExec` timestamp.

		function exec() {
			lastExec = Date.now();
			callback.apply(self, args);
		}
		/*
		 * If `debounceMode` is true (at begin) this is used to clear the flag
		 * to allow future `callback` executions.
		 */

		function clear() {
			timeoutID = 0;
		}

		if (!noLeading && debounceMode && !timeoutID) {
			/*
			 * Since `wrapper` is being called for the first time and
			 * `debounceMode` is true (at begin), execute `callback`
			 * and noLeading != true.
			 */
			exec();
		}

		clearExistingTimeout();

		if (debounceMode === undefined && elapsed > delay) {
			if (noLeading) {
				/*
				 * In throttle mode with noLeading, if `delay` time has
				 * been exceeded, update `lastExec` and schedule `callback`
				 * to execute after `delay` ms.
				 */
				lastExec = Date.now();

				if (!noTrailing) {
					timeoutID = setTimeout(debounceMode ? clear : exec, delay);
				}
			} else {
				/*
				 * In throttle mode without noLeading, if `delay` time has been exceeded, execute
				 * `callback`.
				 */
				exec();
			}
		} else if (noTrailing !== true) {
			/*
			 * In trailing throttle mode, since `delay` time has not been
			 * exceeded, schedule `callback` to execute `delay` ms after most
			 * recent execution.
			 *
			 * If `debounceMode` is true (at begin), schedule `clear` to execute
			 * after `delay` ms.
			 *
			 * If `debounceMode` is false (at end), schedule `callback` to
			 * execute after `delay` ms.
			 */
			timeoutID = setTimeout(
				debounceMode ? clear : exec,
				debounceMode === undefined ? delay - elapsed : delay,
			);
		}
	}

	wrapper.cancel = cancel; // Return the wrapper function.

	return wrapper;
}

export default throttle;