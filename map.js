import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";

import GeoJSON from "ol/format/GeoJSON";
import { extend as extendExtent, createEmpty as createExtent } from "ol/extent";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import observable from "@riotjs/observable";

const defaultColor = "darkgrey";

const GeoJsonStyles = properties =>
  new Style({
    stroke: new Stroke({
      color: properties.stroke || defaultColor,
      width: 3,
    }),
    fill: new Fill({
      color: properties.stroke || defaultColor,
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: properties.stroke || defaultColor,
      }),
    }),
  });

const HighlightStyle = new Style({
  fill: new Fill({
    color: "#E237EE",
  }),
  stroke: new Stroke({
    color: "#E237EE",
    width: 5,
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: "#E237EE",
    }),
  }),
});

export const BaseLayerDescriptions = [
  {
    id: "reduced.day",
    name: "Reduced Day",
    base: "base",
    type: "maptile",
  },
  {
    id: "normal.day",
    name: "Normal Day",
    base: "base",
    type: "maptile",
  },
  {
    id: "satellite.day",
    name: "Satellite Day",
    base: "aerial",
    type: "maptile",
  },
];

export class HereGeoJsonMap {
  constructor(appId, appCode, mapElementId) {
    observable(this);

    this.appId = appId;
    this.appCode = appCode;
    this.map = new Map({
      layers: [],
      target: mapElementId,
      view: new View({
        center: [0, 0],
        zoom: 5,
      }),
    });

    this.map.on("singleclick", e => {
      this.lastClickedPixel = e.pixel;
      this.updateSelectedFeature();
    });
    this.highlightedFeature = undefined;

    this.baseLayers = BaseLayerDescriptions.map(layerDesc => {
      const layer = new TileLayer({
        visible: false,
        preload: Infinity,
        source: new XYZ({
          url:
            `https://{1-4}.${layerDesc.base}.maps.api.here.com/` +
            `${layerDesc.type}/2.1/maptile/newest/${layerDesc.id}/` +
            `{z}/{x}/{y}/256/png?app_id=${this.appId}&app_code=${this.appCode}`,
          attributions: `Map Tiles &copy; ${new Date().getFullYear()} <a href="http://developer.here.com">HERE</a>`,
        }),
      });
      this.map.addLayer(layer);
      return {
        id: layerDesc.id,
        layer,
      };
    });

    this.geoJsonLayers = [];
  }

  selectHereLayer(id) {
    this.baseLayers.forEach(l => l.layer.setVisible(false));
    this.baseLayers.find(l => l.id === id).layer.setVisible(true);
  }

  addGeoJsonLayer(id, url) {
    const layer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url,
      }),
      style: feature => {
        return GeoJsonStyles(feature.getProperties());
      },
    });
    this.map.addLayer(layer);
    this.geoJsonLayers.push({ id, layer });

    layer.once("change", () => {
      const extent = createExtent();
      Object.values(this.geoJsonLayers).forEach(l => {
        extendExtent(extent, l.layer.getSource().getExtent());
      });
      this.map.getView().fit(extent, {
        padding: [30, 30, 30, 30],
      });
    });
  }

  enableGeoJsonLayer(id) {
    this.map.addLayer(this.geoJsonLayers.find(l => l.id === id).layer);
    this.updateSelectedFeature();
  }

  disableGeoJsonLayer(id) {
    this.map.removeLayer(this.geoJsonLayers.find(l => l.id === id).layer);
    this.updateSelectedFeature();
  }

  updateSelectedFeature() {
    const features = this.lastClickedPixel
      ? this.map.getFeaturesAtPixel(this.lastClickedPixel)
      : [];

    features.forEach(f => f.setStyle(undefined));
    this.highlightedFeature && this.highlightedFeature.setStyle(undefined);

    if (features.length !== 0) {
      const featureIndex =
        (features.indexOf(this.highlightedFeature) + 1) % features.length;
      (this.highlightedFeature = features[featureIndex]).setStyle(
        HighlightStyle
      );
      const properties = JSON.parse(
        JSON.stringify(this.highlightedFeature.getProperties())
      );
      delete properties.geometry;
      this.trigger("feature-selected", properties);
    } else {
      this.trigger("feature-selected", undefined);
    }
  }
}
