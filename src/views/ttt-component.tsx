import { Show } from "solid-js/dom";

export interface Config {
	answer: number;
}

const done = <p>Done!!!</p>;

const Repeat = (config: Config) => (
	<>
		<p>{config.answer}</p>
		<Show when={config.answer > 0} fallback={done}>
			<Repeat answer={config.answer - 1}></Repeat>
		</Show>
	</>
);

function App(config: Config) {
	return (
		<div class="app">
			<Repeat {...config} />
		</div>
	);
}

export default App;
