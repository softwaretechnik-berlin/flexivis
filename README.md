# Flexivis

Flexivis is a flexible visualisation tool that allows you to easily visualise diverse types of data in Web browser.

- [Overview](#overview)
- [Layout](#layout)
- [View specifications](#view-specifications)
- [Development](#development)


## Overview

Flexivis combines two main abilities:
- Render or visualise many types of data.
- Lay out multiple views into sub-regions of the browser window.

Using Flexivis is simple:
1. You build a Flexivis URL that describes the various views you'd like to display and optionally the layout that should be used to combine them.
2. Nagivating to that URL displays the rendered layout.


Here's an [example Flexivis URL]:
```
https://flexivis.infrastruktur.link?layout=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json
```

[example Flexivis URL]: https://flexivis.infrastruktur.link?layout=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json

It renders something like this:

[![Screenshot of the "Berlin Walk" example in Fleixvis showing a layout with 3 views: a Markdown document in the top-left, a map in bottom-left, and JSON document on the right.](https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk-screenshot.png)](https://flexivis.infrastruktur.link?layout=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json)

At first glance, the URL above is quite a mouthful, but it's actually not very complicated. Let's break it down. Without the query string, the URL is simply https://flexivis.infrastruktur.link/, which is Flexivis's base URL. There are then 4 query string parameters:
- layout=(explanation30-map)/source
- explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md
- map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json
- source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json

The [`layout`](#layout) parameter specifies how to lay out the named views in the available screen real estate. The other 3 parameters each provide a named [view specification](#view-specifications).


## Layout

The optional `layout` parameter specifies how to lay out the individual views in the available screen real estate.

<div style="display: flex; flex-flow: row wrap; align-items: center; space-between: 10px">
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="90" height="60" style="fill: lightblue" />
        <text x="45" y="30" alignment-baseline="middle" text-anchor="middle">foo</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">A single view is specified by a name (containing only alphanumeric characters), e.g. <code>layout=foo</code>.</div>
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="90" height="60" style="fill: lightblue" />
        <text x="45" y="30" alignment-baseline="middle" text-anchor="middle">url</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">When there is no <code>layout</code> parameter, <code>layout=url</code> is implied.</div>
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="45" height="60" style="fill: lightblue" />
        <text x="22.5" y="30" alignment-baseline="middle" text-anchor="middle">foo</text>
        <rect x="45" width="45" height="60" style="fill: lightgreen" />
        <text x="67.5" y="30" alignment-baseline="middle" text-anchor="middle">bar</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">Views can be layed out side-by-side with the <code>/</code> operator: <code>layout=foo/bar</code>.</div>
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="90" height="20" style="fill: lightblue" />
        <text x="45" y="10" alignment-baseline="middle" text-anchor="middle">foo</text>
        <rect y="20" width="90" height="20" style="fill: lightgreen" />
        <text x="45" y="30" alignment-baseline="middle" text-anchor="middle">bar</text>
        <rect y="40" width="90" height="20" style="fill: pink" />
        <text x="45" y="50" alignment-baseline="middle" text-anchor="middle">baz</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">Views can be layed out in a vertical stack with the <code>-</code> operator: <code>layout=foo-bar-baz</code>.</div>
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="45" height="60" style="fill: lightblue" />
        <text x="22.5" y="30" alignment-baseline="middle" text-anchor="middle">foo</text>
        <rect x="45" width="45" height="30" style="fill: lightgreen" />
        <text x="67.5" y="15" alignment-baseline="middle" text-anchor="middle">bar</text>
        <rect x="45" y="30" width="45" height="30" style="fill: pink" />
        <text x="67.5" y="45" alignment-baseline="middle" text-anchor="middle">baz</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">Parentheses can be used for grouping: <code>layout=foo/(bar-baz)</code>.</div>
    <svg width="90" height="60" style="display: inline-block; margin: 10 10 10 0">
        <rect width="22.5" height="60" style="fill: lightblue" />
        <text x="11.25" y="30" alignment-baseline="middle" text-anchor="middle">foo</text>
        <rect x="22.5" width="67.5" height="24" style="fill: lightgreen" />
        <text x="56.25" y="12" alignment-baseline="middle" text-anchor="middle">bar</text>
        <rect x="22.5" y="24" width="67.5" height="36" style="fill: pink" />
        <text x="56.25" y="42" alignment-baseline="middle" text-anchor="middle">baz</text>
    </svg>
    <div style="display: inline-block; width: calc(100% - 100px)">A number immediately after a view specifies the percentage of the parent view that it will occupy, with the remaining percentage distributed amongst views without an explicit percentage: <code>layout=foo/(bar40-baz)75</code>.</div>
</div>


## View Specifications

Remaining query parameters specifiy what should be displayed.
The parameter name is the name of view (matching the name used in the [`layout`](#layout) parameter), and the value is a view specification.

The basic format of a view specification is `<prefix>:<url-and-view-specific-params>`.

The prefix specifies the view type. The following view types are supported:

- [`text`: Plaintext](#text)
- [`vega`: Vega/Vega-Lite](#vega)

_TODO: Document remain view specification types._

### `text`

The `text` prefix specifies that the resource at the given URL should be rendered as plain text.

E.g.: [plaintext JSON file](http://flexivis.infrastruktur.link/?url=text:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json).

### `json`

The `json` prefix specifies that the resource is a JSON document and should be rendered in a JSON viewer.

E.g.: [JSON file](http://flexivis.infrastruktur.link/?url=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json).


### `vega`

The `vega` prefix specifies that the URL represents a [Vega](https://vega.github.io/vega/) or [Vega-Lite](https://vega.github.io/vega-lite/) graph.

E.g.: [visualise # of files vs lines of code](http://flexivis.infrastruktur.link/?layout=(graph-data)/source&graph=vega:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.json&data=text:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.csv) (as reported by [cloc]()).


## Development

### Setup

```bash
npm install
gem install s3_website
```

### Deploy

```bash
npm run build
s3_website push
```

