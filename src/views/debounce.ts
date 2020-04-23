export type F<T extends any[]> = (...args: T) => void;
export default function debounce<T extends any[]>(f: F<T>, ms = 800): F<T> {
	let timeoutId = null;

	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			f(...args);
		}, ms);
	};
}
