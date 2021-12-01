// To fix the support of some ES6 features, e.g. nested async functions.
// eslint-disable-next-line import/no-unassigned-import
import "regenerator-runtime/runtime";

import * as riot from "riot";

//TODO: https://riot.js.org/faq/#should-i-use-dash-on-the-tag-name
//TODO: do we still need the register?
import ErrorView from "./src/tags/error-view.riot";
riot.register("error-view", ErrorView);
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
import ItemSelect from "./src/tags/item-select.riot";
riot.register("item-select", ItemSelect);
import MultiTab from "./src/tags/multi-tab.riot";
riot.register("multi-tab", MultiTab);
import Modal from "./src/tags/modal.riot";
riot.register("modal", Modal);
import AppComponent from "./src/tags/App.riot";
riot.register("app", AppComponent);

riot.component(AppComponent)(document.querySelector("#app"), {
	queryString: location.search || location.hash.replace("#", "?"),
});
