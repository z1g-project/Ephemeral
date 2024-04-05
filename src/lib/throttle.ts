function throttle(
	delay: number,
	func: (...args: never[]) => void,
): (...args: never[]) => void {
	let lastCallTime: number = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (...args: never[]) {
		const currentTime = performance.now();

		if (currentTime - lastCallTime >= delay) {
			lastCallTime = currentTime;

			func(...args);
		} else {
			if (!timeoutId) {
				timeoutId = setTimeout(
					() => {
						lastCallTime = performance.now();
						func(...args);
						timeoutId = null;
					},
					delay - (currentTime - lastCallTime),
				) as ReturnType<typeof setTimeout>;
			}
		}
	};
}

export { throttle };
