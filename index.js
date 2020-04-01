// To fix the support of some ES6 features, e.g. nested async functions.
import "regenerator-runtime/runtime";

import * as riot from "riot";

import Tree from "./tree.riot";
riot.register("tree", Tree);
import TreeSearch from "./tree-search.riot";
riot.register("tree-search", TreeSearch);
import SplitView from "./split-view.riot";
riot.register("split-view", SplitView);
import Raw from "./raw.riot";
riot.register("raw", Raw);
import LayerMap from "./layer-map.riot";
riot.register("layer-map", LayerMap);
import ContentFrame from "./content-frame.riot";
riot.register("content-frame", ContentFrame);

import AppComponent from "./app.riot";
import "./index.css";

riot.component(AppComponent)(document.getElementById("app"));
