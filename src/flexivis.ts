export class FlexivisError extends Error {
	constructor(name: string, public title: string, message: string) {
		super(message);
		this.name = name;
	}
}
