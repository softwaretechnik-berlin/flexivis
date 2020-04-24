export function serialize(
	parameters: Record<string, unknown>,
	prepareValue: (str: string) => string = string => string
): string {
	const searchParameters = new URLSearchParams();

	for (const [key, value] of Object.entries(parameters)) {
		const stringValue =
			typeof value === "string" ? value : JSON.stringify(value);
		searchParameters.set(key, prepareValue(stringValue));
	}

	return "?" + searchParameters.toString();
}
