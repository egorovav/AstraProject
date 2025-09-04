jQuery(document).ready(function($){
  var astraStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'orange'
      })
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        textBaseline: 'bottom',
        fill: new ol.style.Fill({
            color: 'rgba(100,100,100,1)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,255,1)',
            width: 3
        }),
        text: ''
    })
  });

  var constellationStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 2
      })
  });

  var selectStyle = new ol.style.Style({
     stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 1
     }),
  });

  let borderStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 255, 0.1)',
      width: 1
    }),
    text: new ol.style.Text({
        font: '18px Calibri,sans-serif',
        textBaseline: 'middle',
        fill: new ol.style.Fill({
            color: 'rgba(0,0,0,1)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,255,1)',
            width: 3
        }),
        text: ''
    })
  });

  var format = new ol.format.GeoJSON();

  var astraSource = new ol.source.Vector({
        features: format.readFeatures(astra)
  });

   let astraStyleFunction = function (feature, resolution) {
        let str = feature.get("name") + '\n(' + feature.get("bayer") + '-' + feature.get("constellation") +')';
        astraStyle.getText().setText(str);
        return astraStyle;
   }


   var astraLayer = new ol.layer.Vector({
          source: astraSource,
          style: astraStyleFunction
   });

  let styleFunction = function (feature, resolution) {
        let str = feature.get("name") + '\n(' + feature.get("nameLat") + ')';
        borderStyle.getText().setText(str);
        return borderStyle;
  }

  var constellationBorderSource = new ol.source.Vector({
      /* projection: 'EPSG:4326', */
      features: format.readFeatures(polygonBorders)
  });

  constellationBorderSource.addFeatures(format.readFeatures(multiPolygonBorders));

  var constellationBordersLayer = new ol.layer.Vector({
        source: constellationBorderSource,
        style: styleFunction
  });

  var constellationSource = new ol.source.Vector({
      features: format.readFeatures(lineStringConstellations)
  });

  constellationSource.addFeatures(format.readFeatures(multiLineStringConstellations));

    var constellationLayer = new ol.layer.Vector({
        source: constellationSource,
        style: constellationStyle
  });

  var map = new ol.Map({
        target: 'map',
        layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                constellationLayer,
                constellationBordersLayer,
                astraLayer
        ],
        view: new ol.View({
          /* projection: 'EPSG:4326', */
          center: [62, 13],
          zoom: 4
        })
  });

  map.on('click', function(event) {
     map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
         /* feature.setStyle(selectStyle); */
         let id = feature.getId();
         document.location.href="/astraproject/hygastra/starId/1?constellation=" + id;
     });
  });
});