import test from "ava";
import Parser from "./parser";

test("combines the layout and view parsers", t => {
	const parser = new Parser(
		new URLSearchParams(
			"?layout=a/(b-c)&a=(when=never)nap&b=lap&c=map:json1;(hide)$json2"
		)
	);

	t.deepEqual(parser.parse(), {
		sep: "/",
		views: [
			{
				view: {
					type: "nap",
					config: {
						when: "never",
					},
					resources: [],
				},
				size: 50,
			},
			{
				view: {
					sep: "-",
					views: [
						{
							view: {
								type: "lap",
								config: [],
								resources: [],
							},
							size: 50,
						},
						{
							view: {
								type: "map",
								config: [],
								resources: [
									{
										value: "json1",
										config: [],
									},
									{
										value: "$json2",
										config: {
											hide: null,
										},
									},
								],
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
