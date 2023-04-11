type Try<T> = { error: Error } | { value: T };
export type Handler<T> = (error: Error, value: T) => void;
type RecurrentHandler<T> = {
	handler: Handler<T>;
	keep: boolean;
	remove: boolean;
};
export type Subscription = { cancel: () => void };

export default class DataSource<T> {
	private handlers: Array<RecurrentHandler<T>>;
	private counter: number;
	private n: number;
	private currentResult: Try<T>;
	constructor(
		public name: string,
		public url: string,
		initialValue?: T | Promise<T>
	) {
		this.handlers = [];
		this.counter = 0;
		this.n = 0;
		this.currentResult = undefined;

		if (initialValue) {
			this.latest = initialValue;
		}
	}

	get latest(): T | Promise<T> {
		if (!this.currentResult) {
			return new Promise((resolve, reject) => {
				this.handlers.push({
					handler(error, value) {
						error ? reject(error) : resolve(value);
					},
					keep: false,
					remove: false,
				});
			});
		}

		return "error" in this.currentResult
			? Promise.reject(this.currentResult.error)
			: Promise.resolve(this.currentResult.value);
	}

	set latest(newValue: T | Promise<T>) {
		const n = ++this.counter;

		const update = (result: Try<T>): void => {
			if (this.n < n) {
				this.n = n;
				const current = this.currentResult;
				if (
					!current ||
					"error" in current ||
					"error" in result ||
					current.value !== result.value
				) {
					this.currentResult = result;
					this.emitToAll();
				}
			}
		};

		Promise.resolve(newValue).then(
			value => {
				update({ value });
			},
			error => {
				update({ error: error || new Error(error) });
			}
		);
	}

	observe(handler: Handler<T>): Subscription {
		const h = { handler, keep: true, remove: false };
		this.handlers.push(h);
		const cancel = (): void => {
			h.remove = true;
		};

		this.emitToSingle(h);
		return { cancel };
	}

	private emitToAll(): void {
		this.handlers = this.emitTo(this.handlers);
	}

	private emitToSingle(handler: RecurrentHandler<T>): void {
		this.emitTo([handler]);
	}

	private emitTo(
		handlers: Array<RecurrentHandler<T>>
	): Array<RecurrentHandler<T>> {
		if (!this.currentResult) {
			return;
		}

		const v = this.currentResult;
		const [error, value] =
			"error" in v ? [v.error, undefined] : [undefined, v.value];

		return handlers.filter(handler => {
			if (handler.remove) {
				return true;
			}

			handler.handler(error, value);
			return handler.keep;
		});
	}
}
