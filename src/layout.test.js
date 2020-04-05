import test from "ava";
import * as layout from "./layout";

test("parses empty layouts", t => {
	t.is(layout.parse(""), null);
});

test("parses a single view", t => {
	t.is(layout.parse("a"), "a");
});

test("unwraps a single view", t => {
	t.is(layout.parse("(a)"), "a");
});

test("parses two split views", t => {
	t.deepEqual(layout.parse("a/b"), {
		sep: "/",
		views: [
			{size: 50, view: "a"},
			{size: 50, view: "b"},
		],
	});

	t.deepEqual(layout.parse("a-b"), {
		sep: "-",
		views: [
			{size: 50, view: "a"},
			{size: 50, view: "b"},
		],
	});
});

test("parses multiple views split in the same direction", t => {
	t.deepEqual(layout.parse("a/b/c"), {
		sep: "/",
		views: [
			{size: 100 / 3, view: "a"},
			{size: 100 / 3, view: "b"},
			{size: 100 / 3, view: "c"},
		],
	});

	t.deepEqual(layout.parse("a-b-c"), {
		sep: "-",
		views: [
			{size: 100 / 3, view: "a"},
			{size: 100 / 3, view: "b"},
			{size: 100 / 3, view: "c"},
		],
	});
});

test("parses complex nested views", t => {
	t.deepEqual(layout.parse("a/(x-(y/(z)))/b"), {
		sep: "/",
		views: [
			{
				view: "a",
				size: 100 / 3,
			},
			{
				view: {
					sep: "-",
					views: [
						{
							view: "x",
							size: 50,
						},
						{
							view: {
								sep: "/",
								views: [
									{
										view: "y",
										size: 50,
									},
									{
										view: "z",
										size: 50,
									},
								],
							},
							size: 50,
						},
					],
				},
				size: 100 / 3,
			},
			{
				view: "b",
				size: 100 / 3,
			},
		],
	});
});

test("parses nested views with configurable sizes", t => {
	t.deepEqual(layout.parse("a30/(x15-(y/(z)10))/b40"), {
		sep: "/",
		views: [
			{view: "a", size: 30},
			{
				view: {
					sep: "-",
					views: [
						{view: "x", size: 15},
						{
							view: {
								sep: "/",
								views: [
									{view: "y", size: 90},
									{view: "z", size: 10},
								],
							},
							size: 85,
						},
					],
				},
				size: 30,
			},
			{view: "b", size: 40},
		],
	});
});
