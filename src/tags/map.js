import Map from "ol/Map.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat } from "ol/proj";

import { GeoJSON } from "ol/format";
import { extend as extendExtent, createEmpty as createExtent } from "ol/extent";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource, OSM as OSMSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import observable from "@riotjs/observable";

const defaultColor = "darkgrey";

const geoJsonStyles = properties =>
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

const baseLayerDescriptions = [
	{
		id: "here.reduced.day",
		layerId: "reduced.day",
		name: "HERE Reduced Day",
		base: "base",
		type: "here",
	},
	{
		id: "here.normal.day",
		layerId: "normal.day",
		name: "HERE Normal Day",
		base: "base",
		type: "here",
	},
	{
		id: "here.satellite.day",
		layerId: "satellite.day",
		name: "HERE Satellite Day",
		base: "aerial",
		type: "here",
	},
	{
		id: "osm",
		name: "OpenStreetMap",
		type: "osm",
	},
];

export class HereGeoJsonMap {
	constructor(
		mapElementId,
		{ hereAppId, hereAppCode, center = [0, 0], zoomLevel = 5 }
	) {
		observable(this);

		this.map = new Map({
			layers: [],
			target: mapElementId,
			view: new View({
				center: fromLonLat(center.reverse()),
				zoom: zoomLevel,
			}),
		});

		this.map.on("singleclick", event => {
			this.lastClickedPixel = event.pixel;
			this.updateSelectedFeature();
		});
		this.highlightedFeature = undefined;

		this.baseLayers = baseLayerDescriptions.map(layerDesc => {
			const layer =
				layerDesc.type === "here"
					? new TileLayer({
							visible: false,
							preload: Number.POSITIVE_INFINITY,
							source: new XYZ({
								url:
									`https://{1-4}.${layerDesc.base}.maps.api.here.com/` +
									`maptile/2.1/maptile/newest/${layerDesc.layerId}/` +
									`{z}/{x}/{y}/256/png?app_id=${hereAppId}&app_code=${hereAppCode}`,
								attributions: `Map Tiles &copy; ${new Date().getFullYear()} <a href="http://developer.here.com">HERE</a>`,
							}),
					  })
					: new TileLayer({
							source: new OSMSource(),
					  });

			this.map.addLayer(layer);

			return {
				id: layerDesc.id,
				layer,
			};
		});

		this.geoJsonLayers = {};
	}

	layerDescriptions() {
		return baseLayerDescriptions;
	}

	selectHereLayer(id) {
		for (const l of this.baseLayers) l.layer.setVisible(false);
		this.baseLayers.find(l => l.id === id).layer.setVisible(true);
	}

	replaceGeoJsonLayer(id, newGeoJson) {
		if (this.geoJsonLayers[id]) {
			this.disableGeoJsonLayer(id);
			delete this.geoJsonLayers[id];
		}

		this.addGeoJsonLayer(id, newGeoJson);
	}

	addGeoJsonLayer(id, geoJson) {
		if (this.geoJsonLayers[id]) {
			const error = new Error(`Duplicate map layer with id "${id}".`);
			error.title = "Duplicate Layer Error";
			throw error;
		}

		const layer = new VectorLayer({
			source: new VectorSource({
				format: new GeoJSON(),
				url: "data:," + encodeURIComponent(geoJson),
			}),
			style: feature => {
				return geoJsonStyles(feature.getProperties());
			},
		});
		this.geoJsonLayers[id] = layer;
		this.map.addLayer(layer);

		layer.once("change", () => {
			const extent = createExtent();
			for (const l of Object.values(this.geoJsonLayers)) {
				extendExtent(extent, l.getSource().getExtent());
			}

			this.map.getView().fit(extent, {
				padding: [30, 30, 30, 30],
			});
		});
	}

	enableGeoJsonLayer(id) {
		this.map.addLayer(this.geoJsonLayers[id]);
		this.updateSelectedFeature();
	}

	disableGeoJsonLayer(id) {
		this.map.removeLayer(this.geoJsonLayers[id]);
		this.updateSelectedFeature();
	}

	updateSelectedFeature() {
		const features = this.lastClickedPixel
			? this.map.getFeaturesAtPixel(this.lastClickedPixel)
			: [];

		for (const f of features) f.setStyle(undefined);
		if (this.highlightedFeature) {
			this.highlightedFeature.setStyle(undefined);
		}

		if (features.length === 0) {
			this.trigger("feature-selected", undefined);
		} else {
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
		}
	}
}
