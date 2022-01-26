export type Config = Record<string, string | string[] | Config>;

export interface Resource {
	config: Config;
	value: string;
}

export interface View {
	type: string;
	config: Config;
	resources: Resource[];
}

export function parse(input: string): View;
