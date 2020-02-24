if (location.host === "geojson.infrastruktur.link") {
  const searchParams = new URLSearchParams(location.search);
  location.replace(
    `https://flexivis.infrastruktur.link/?url=map:${searchParams.get("url")}`
  );
}

import * as riot from "riot";
import AppComponent from "./app.riot";
import "./index.css";

riot.component(AppComponent)(document.getElementById("app"));
