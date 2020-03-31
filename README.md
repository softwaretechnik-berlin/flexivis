# Flexivis

Flexivis is a flexible visualisation tool that allows you to easily visualise diverse types of data in Web browser.

- [Overview](#overview)
- [Split syntax](#split-syntax)
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
https://flexivis.infrastruktur.link?split=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json
```

[example Flexivis URL]: https://flexivis.infrastruktur.link?split=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json

It renders something like this:

[![Screenshot of the "Berlin Walk" example in Fleixvis showing a splitscreen with 3 views: a Markdown document in the top-left, a map in bottom-left, and JSON document on the right.](https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk-screenshot.png)](https://flexivis.infrastruktur.link?split=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json)

At first glance, the URL above is quite a mouthful, but it's actually not very complicated. Let's break it down. Without the query string, the URL is simply https://flexivis.infrastruktur.link/, which is Flexivis's base URL. There are then 4 query string parameters:
- split=(explanation30-map)/source
- explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md
- map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json
- source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json

The [`split`](#split-syntax) parameter specifies how to split up the available screen real estate into 3 named view areas. The other 3 parameters each provide a [view specification](#view-specifications) for one of those areas.


## Split Syntax

_TODO: Document split parameter and syntax._


## View Specifications

Remaining query parameters specifiy what should be displayed.
The parameter name is the name of view (matching the name used in the [`split`](#split-syntax) parameter), and the value is a view specification.

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

E.g.: [visualise # of files vs lines of code](http://flexivis.infrastruktur.link/?split=(graph-data)/source&graph=vega:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.json&data=text:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/cloc.csv) (as reported by [cloc]()).


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

