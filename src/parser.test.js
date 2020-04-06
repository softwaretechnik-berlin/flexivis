import test from "ava";
import Parser from "./parser";

// TEST CASES for parsers/view:
// readme
// readme:
// https://example.com
// (center=0.0,0.0;zoomLevel=10)map:(a=3)http://example.com/geojson
// (center=0.0,0,0)map:http://example.com/geojson1;http://example.com/geojson2
// (center=0.0,0,0;configWithoutValue)map:http://example.com/geojson1;http://example.com/geojson2
// (center=0.0,0,0;configWithoutValue;b=123)map:http://example.com/geojson1;(kml)http://example.com/geojson2
// (center=0.0,0,0;configWithoutValue)map:(geojson;hide)http://example.com/geojson1;(kml;whatever=51)http://example.com/geojson2
// (center=0.0,0,0;configWithoutValue)map:(geojson;hide)http://example.com/geojson1;(kml;whatever=51)$someData

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
					config: [
						{
							key: "when",
							value: "never",
						},
					],
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
										config: [
											{
												key: "hide",
												value: null,
											},
										],
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
