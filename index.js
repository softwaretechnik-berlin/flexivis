// To fix the support of some ES6 features, e.g. nested async functions.
// eslint-disable-next-line import/no-unassigned-import
import "regenerator-runtime/runtime";

import * as riot from "riot";

import ErrorView from "./src/tags/error-view";
riot.register("error-view", ErrorView);
import Tree from "./src/tags/tree";
riot.register("tree", Tree);
import TreeSearch from "./src/tags/tree-search";
riot.register("tree-search", TreeSearch);
import SplitView from "./src/tags/split-view";
riot.register("split-view", SplitView);
import Raw from "./src/tags/raw";
riot.register("raw", Raw);
import LayerMap from "./src/tags/layer-map";
riot.register("layer-map", LayerMap);
import ContentFrame from "./src/tags/content-frame";
riot.register("content-frame", ContentFrame);

import AppComponent from "./src/tags/app";

riot.component(AppComponent)(document.querySelector("#app"));
