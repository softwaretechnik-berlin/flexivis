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

<table>
    <tr>
        <td style="min-width: 90px"><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-foo.svg?sanitize=true"/></td>
        <td>single view is specified by a name (containing only alphanumeric characters), e.g. <code>layout=foo</code>.</td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-url.svg?sanitize=true"/></td>
        <td>When there is no <code>layout</code> parameter, <code>layout=url</code> is implied.</td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-horizontal.svg?sanitize=true"/></td>
        <td>Views can be layed out side-by-side with the <code>/</code> operator: <code>layout=foo/bar</code>.</td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-vertical.svg?sanitize=true"/></td>
        <td>Views can be layed out in a vertical stack with the <code>-</code> operator: <code>layout=foo-bar-baz</code>.</td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-grouping.svg?sanitize=true"/></td>
        <td>Parentheses can be used for grouping: <code>layout=foo/(bar-baz)</code>.</td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/images/layout-percentage.svg?sanitize=true"/></td>
        <td>A number immediately after a view specifies the percentage of the parent view that it will occupy,<br/> with the remaining percentage distributed amongst views without an explicit percentage:<br/> <code>layout=foo/(bar40-baz)75</code>.</td>
    </tr>
</table>


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

