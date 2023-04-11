export type Config = Record<string, string | string[] | Config>;

export type Resource = {
	config: Config;
	value: string;
};

export type View = {
	type: string;
	config: Config;
	resources: Resource[];
};

export function parse(input: string): View;
