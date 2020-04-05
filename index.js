// To fix the support of some ES6 features, e.g. nested async functions.
import "regenerator-runtime/runtime";

import * as riot from "riot";

import ErrorView from "./src/tags/error-view.riot";
riot.register("error-view", ErrorView);
import ErrorFallback from "./src/tags/error-fallback.riot";
riot.register("error-fallback", ErrorFallback);
import Tree from "./src/tags/tree.riot";
riot.register("tree", Tree);
import TreeSearch from "./src/tags/tree-search.riot";
riot.register("tree-search", TreeSearch);
import SplitView from "./src/tags/split-view.riot";
riot.register("split-view", SplitView);
import Raw from "./src/tags/raw.riot";
riot.register("raw", Raw);
import LayerMap from "./src/tags/layer-map.riot";
riot.register("layer-map", LayerMap);
import ContentFrame from "./src/tags/content-frame.riot";
riot.register("content-frame", ContentFrame);

import AppComponent from "./src/tags/app.riot";
import "./index.css";

riot.component(AppComponent)(document.querySelector("#app"));
