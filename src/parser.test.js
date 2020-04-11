import test from "ava";
import parse from "./parser";

test("combines the layout and view parsers", t => {
	const parameters = new URLSearchParams(
		"?layout=a/(b-c)&a=(when=never)nap&b=lap&c=map:json1;(hide)$json2&$json2=json2"
	);

	// We serialize and deserialize to "flat" all classes in it.
	const layoutDefinition = JSON.parse(
		JSON.stringify(parse(parameters, url => url))
	);
	t.deepEqual(layoutDefinition, {
		sep: "/",
		views: [
			{
				view: { type: "nap", resources: [], config: { when: "never" } },
				size: 50,
			},
			{
				view: {
					sep: "-",
					views: [
						{ view: { type: "lap", resources: [], config: [] }, size: 50 },
						{
							view: {
								type: "map",
								resources: [
									{
										value: {
											name: "json1",
											handlers: [],
											counter: 1,
											n: 0,
											url: "json1",
										},
										config: [],
									},
									{
										value: {
											name: "$json2",
											handlers: [],
											counter: 1,
											n: 0,
											url: "json2",
										},
										config: { hide: null },
									},
								],
								config: [],
							},
							size: 50,
						},
					],
				},
				size: 50,
			},
		],
	});
});
