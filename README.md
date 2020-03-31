# Flexivis

Flexivis is a flexible visualisation tool that allows you to easily visualise diverse types of data in Web browser.
It lets you create a single URL to visualise data from multiple sources.

- [Example](#example)
- [Split syntax](#split-syntax)
- [View specifications](#view-specifications)
- [Development](#development)


## Example

[This link has an example flexivis URL](https://flexivis.infrastruktur.link?split=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json). Clicking on the link will render something like this:

![Screenshot of the "Berlin Walk" example in Fleixvis showing a splitscreen with 3 views: a Markdown document in the top-left, a map in bottom-left, and JSON document on the right.](https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk-screenshot.png)

If you look at the URL for the example above, you'll see that it's quite a mouthful, but it's actually not very complicated. Let's break it down. Without the query string, the URL is simply https://flexivis.infrastruktur.link/, which is Flexivis's base URL. There are then 4 query string parameters:
- split=(explanation30-map)/source
- explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md
- map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json
- source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json

The [`split`](#split-syntax) parameter specifies how to split up the available screen real estate into 3 named view areas. The other 3 parameters each provide a [view specification](#view-specifications) for one of those areas.


## Split Syntax

_TODO: Document split parameter and syntax._


## View Specifications

_TODO: Document view specifications._


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

