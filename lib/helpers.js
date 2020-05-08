import GeoViewport from "@mapbox/geo-viewport";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const isMarker = child =>
  child &&
  child.props &&
  child.props.coordinate &&
  child.props.cluster !== false;

export const calculateBBox = region => {
  let lngD;
  if (region.longitudeDelta < 0) lngD = region.longitudeDelta + 360;
  else lngD = region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta // northLat - max lat
  ];
};

export const returnMapZoom = (region, bBox, minZoom) => {
  const viewport =
    region.longitudeDelta >= 40
      ? { zoom: minZoom }
      : GeoViewport.viewport(bBox, [width, height]);

  return viewport.zoom;
};

export const markerToGeoJSONFeature = (marker, index) => {
  return {
    type: "Feature",
    geometry: {
      coordinates: [
        marker.props.coordinate.longitude,
        marker.props.coordinate.latitude
      ],
      type: "Point"
    },
    properties: {
      point_count: 0,
      index,
      ..._removeChildrenFromProps(marker.props)
    }
  };
};

export const generateSpiral = (count, centerLocation, clusterChildren) => {
  let res = [];
  res.length = count;
  let angle = 0;

  for (let i = 0; i < count; i++) {
    angle = 0.25 * (i * 0.5);
    let latitude = centerLocation[1] + 0.0002 * angle * Math.cos(angle);
    let longitude = centerLocation[0] + 0.0002 * angle * Math.sin(angle);
    res[i] = {
      longitude,
      latitude,
      image: clusterChildren[i] && clusterChildren[i].properties.image,
      onPress: clusterChildren[i] && clusterChildren[i].properties.onPress
    };
  }
  
  return res;
};

export const returnMarkerStyle = points => {
  if (points >= 50) {
    return {
      width: 70,
      height: 70,
      size: 60,
      fontSize: 16
    };
  }

  if (points >= 25) {
    return {
      width: 65,
      height: 65,
      size: 55,
      fontSize: 15
    };
  }

  if (points >= 15) {
    return {
      width: 60,
      height: 60,
      size: 50,
      fontSize: 14
    };
  }

  if (points >= 10) {
    return {
      width: 50,
      height: 50,
      size: 40,
      fontSize: 13
    };
  }

  if (points >= 8) {
    return {
      width: 45,
      height: 45,
      size: 35,
      fontSize: 12
    };
  }

  if (points >= 4) {
    return {
      width: 42,
      height: 42,
      size: 32,
      fontSize: 11
    };
  }

  return {
    width: 40,
    height: 40,
    size: 30,
    fontSize: 10
  };
};

const _removeChildrenFromProps = props => {
  const newProps = {};
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      newProps[key] = props[key];
    }
  });
  return newProps;
};
