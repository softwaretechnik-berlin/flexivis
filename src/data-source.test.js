import test from "ava";
import DataSource from "./data-source";

test("returns a promise with the current value", async t => {
	const source = new DataSource("hi", "file://hi", 123);

	t.is(await source.latest, 123);
});

test("allows values to be observed", async t => {
	const source = new DataSource("hi", "file://hi");

	const results = new Promise(resolve => {
		const values = [];
		source.observe((error, value) => {
			values.push({ error, value });
			if (values.length === 2) {
				resolve(values);
			}
		});
	});

	source.latest = 1;
	source.latest = 2;

	t.deepEqual(await results, [
		{ error: undefined, value: 1 },
		{ error: undefined, value: 2 },
	]);
});

test("emits the last known value on subscription", async t => {
	const source = new DataSource("hi", "file://hi", 73);

	const { error, value } = await new Promise(resolve => {
		source.observe((error, value) => resolve({ error, value }));
	});

	t.falsy(error);
	t.is(value, 73);
});

test("emits errors", async t => {
	const source = new DataSource(
		"hi",
		"file://hi",
		Promise.reject(new Error("oops"))
	);

	const { error } = await new Promise(resolve => {
		source.observe((error, value) => resolve({ error, value }));
	});

	t.is(error.message, "oops");
});

test("allows unsubscribing", async t => {
	const source = new DataSource("hi", "file://hi");

	const values = [];
	const x = (error, value) => {
		values.push({ error, value });
		subscription.cancel();
	};

	const subscription = source.observe(x);

	const results = new Promise(resolve => {
		let total = 0;
		source.observe(() => {
			if (++total === 2) {
				resolve();
			}
		});
	});

	source.latest = 7;
	source.latest = 9;

	await results;
	t.deepEqual(values, [{ error: undefined, value: 7 }]);
});

test("emits only the latest value", async t => {
	const source = new DataSource("hi", "file://hi");

	const result = new Promise(resolve => {
		const values = [];
		source.observe((_, value) => {
			values.push(value);
			resolve(values);
		});
	});

	source.latest = new Promise(resolve => {
		source.latest = new Promise(resolve => {
			resolve(2);
		});
		source.latest.then(() => resolve(1));
	});

	t.deepEqual(await result, [2]);
});

test("does not re-emit the same value", async t => {
	const source = new DataSource("hi", "file://hi");

	const result = new Promise(resolve => {
		const values = [];
		source.observe((_, value) => {
			values.push(value);
			if (values.length === 2) {
				resolve(values);
			}
		});
	});

	source.latest = "a";
	source.latest = "a";
	source.latest = "b";

	t.deepEqual(await result, ["a", "b"]);
});
