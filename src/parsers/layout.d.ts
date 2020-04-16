export type ViewName = string;

export type ViewFrame = {
	view: ViewDef;
	size: number;
};

export interface ViewFrameCollection {
	sep: "/" | "-";
	views: ViewFrame[];
}

export type ViewDef = ViewName | ViewFrameCollection;

export function parse(input: string): ViewDef;
