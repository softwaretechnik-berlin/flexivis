// To fix the support of some ES6 features, e.g. nested async functions.
// eslint-disable-next-line import/no-unassigned-import
import "regenerator-runtime/runtime.js";

import * as riot from "riot";

// TODO: https://riot.js.org/faq/#should-i-use-dash-on-the-tag-name
// TODO: do we still need the register?
import ErrorView from "./src/tags/error-view.riot";
import Tree from "./src/tags/tree.riot";
import TreeSearch from "./src/tags/tree-search.riot";
import SplitView from "./src/tags/split-view.riot";
import Raw from "./src/tags/raw.riot";
import LayerMap from "./src/tags/layer-map.riot";
import ContentFrame from "./src/tags/content-frame.riot";
import ItemSelect from "./src/tags/item-select.riot";
import MultiTab from "./src/tags/multi-tab.riot";
import Modal from "./src/tags/modal.riot";
import AppComponent from "./src/tags/App.riot";

riot.register("error-view", ErrorView);
riot.register("tree", Tree);
riot.register("tree-search", TreeSearch);
riot.register("split-view", SplitView);
riot.register("raw", Raw);
riot.register("layer-map", LayerMap);
riot.register("content-frame", ContentFrame);
riot.register("item-select", ItemSelect);
riot.register("multi-tab", MultiTab);
riot.register("modal", Modal);
riot.register("app", AppComponent);

riot.component(AppComponent)(document.querySelector("#app"), {
	queryString: location.search || location.hash.replace("#", "?"),
});
