"use strict";

const map = L.map("map").setView([43.45, -3.7944], 13);
//let url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
let url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
L.tileLayer(url, {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);


/* Capas animadas */
d3.json("data/grid_CANTABRIA.json", function (d) {
    let vf = new VectorField(d);

    // 0. Grid base
    //L.canvasLayer.simplePoints(vf.gridLonLatValue()).addTo(map);

    // 1. Basic animation
    L.canvasLayer.vectorFieldAnim(vf).addTo(map);

    // 2. Color
    /*L.canvasLayer.vectorFieldAnim(vf, {
        color: "green"
    }).addTo(map);*/

    // 3. More parameters
    /*L.canvasLayer.vectorFieldAnim(vf, {
        paths: 50,
        color: "#FF6699",
        width: 8,
        fade: "0.99",
    }).addTo(map);
    */

    // 4. Colormap for velocity (and associated legend)
    var m = ColorMap.forCurrents([0, 1.1]);
    let layer = L.canvasLayer.vectorFieldAnim(vf, {
        color: m.scale
    });
    //layer.addTo(map);

    L.control.colorMapLegend(m).addTo(map);

    // 6. Click identification
    layer.on('click_vector', function (e) {
        if (e.vector) {
            let v = e.vector.magnitude().toFixed(3);
            //let html = (`Velocity: ${v} m/s <br\> @${e.latlng}`);
            let html = (`${v} m/s`);
            let popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(html)
                .openOn(map);
        }
    });

    map.fitBounds(layer.getBounds());
});