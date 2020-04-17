import test from "ava";
const view = require("./view");

test("parses just a view type", t => {
	t.deepEqual(view.parse("readme"), {
		type: "readme",
		config: [],
		resources: [],
	});

	t.deepEqual(view.parse("readme:"), {
		type: "readme",
		config: [],
		resources: [],
	});
});

test("parses URLs", t => {
	t.deepEqual(view.parse("https://example.com"), {
		type: "https",
		config: [],
		resources: [
			{
				value: "//example.com",
				config: [],
			},
		],
	});
});

test("parses multiple resources", t => {
	t.deepEqual(view.parse("multi:a;b"), {
		type: "multi",
		config: [],
		resources: [
			{
				value: "a",
				config: [],
			},
			{
				value: "b",
				config: [],
			},
		],
	});
});

test("parses configurations", t => {
	t.deepEqual(
		view.parse(
			"(center=0.0,0.0;configWithoutValue)map:(geojson;hide)http://example.com/geojson1;(kml;whatever=1,2,3)$someData"
		),
		{
			type: "map",
			config: { center: ["0.0", "0.0"], configWithoutValue: null },
			resources: [
				{
					value: "http://example.com/geojson1",
					config: { geojson: null, hide: null },
				},
				{
					value: "$someData",
					config: { kml: null, whatever: ["1", "2", "3"] },
				},
			],
		}
	);
});

test("parses nested configurations", t => {
	t.deepEqual(view.parse("(a=(b=(c=3);d=true);e=false)hello"), {
		type: "hello",
		config: {
			a: {
				b: {
					c: "3",
				},
				d: "true",
			},
			e: "false",
		},
		resources: [],
	});
});
