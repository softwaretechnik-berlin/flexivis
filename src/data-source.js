export default class DataSource {
	constructor(name, url, initialValue) {
		this.name = name;
		this.url = url;
		this.handlers = [];
		this.counter = 0;
		this.n = 0;
		this.currentResult = undefined;

		if (initialValue) {
			this.latest = initialValue;
		}
	}

	get latest() {
		if (!this.currentResult) {
			return new Promise((resolve, reject) => {
				this.handlers.push({
					f: (err, ...args) => (err ? reject(err) : resolve(...args)),
					keep: false,
				});
			});
		}

		return this.currentResult.error
			? Promise.reject(this.currentResult.error)
			: Promise.resolve(this.currentResult.value);
	}

	set latest(newValue) {
		const n = ++this.counter;

		const update = result => {
			if (this.n < n) {
				this.n = n;
				const current = this.currentResult;
				if (!current || current.error || current.value !== result.value) {
					this.currentResult = result;
					this._emitCurrentResult();
				}
			}
		};

		Promise.resolve(newValue).then(
			value => update({ value }),
			error => update({ error: error || new Error(error) })
		);
	}

	observe(f) {
		const handler = { f, keep: true };
		this.handlers.push(handler);
		this._emitCurrentResult(handler);
		const cancel = () => {
			this.handlers = this.handlers.filter(handler => handler.f !== f);
		};

		return { cancel };
	}

	_emitCurrentResult(onlyHandler) {
		if (!this.currentResult) {
			return;
		}

		const handlers = onlyHandler ? [onlyHandler] : this.handlers;
		const v = this.currentResult;

		handlers.filter(handler => {
			handler.f(v.error, v.value);
			return handler.keep;
		});
	}
}
