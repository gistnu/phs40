Ext.namespace("Heron.i18n");

function __(string) {
    var dict = Heron.i18n.dict;
    if (typeof (dict) != 'undefined' && dict[string]) {
        return dict[string];
    }
    return string;
}
Ext.namespace("gxp");
if (!gxp.QueryPanel) {
    gxp.QueryPanel = function () {};
}
if (!Ext.grid.GridView.prototype.templates) {
    Ext.grid.GridView.prototype.templates = {};
}
Ext.grid.GridView.prototype.templates.cell = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>', '</td>');
(function () {
        var createComplete = function (fn, cb) {
            return function (request) {
                if (cb && cb[fn]) {
                    cb[fn].call(cb.scope || window, Ext.applyIf({
                                argument: cb.argument
                            }, request));
                }
            };
        };
        Ext.apply(Ext.lib.Ajax, {
                request: function (method, uri, cb, data, options) {
                    options = options || {};
                    method = method || options.method;
                    var hs = options.headers;
                    if (options.xmlData) {
                        if (!hs || !hs["Content-Type"]) {
                            hs = hs || {};
                            hs["Content-Type"] = "text/xml";
                        }
                        method = method || "POST";
                        data = options.xmlData;
                    } else if (options.jsonData) {
                        if (!hs || !hs["Content-Type"]) {
                            hs = hs || {};
                            hs["Content-Type"] = "application/json";
                        }
                        method = method || "POST";
                        data = typeof options.jsonData == "object" ? Ext.encode(options.jsonData) : options.jsonData;
                    }
                    if ((method && method.toLowerCase() == "post") && (options.form || options.params) && (!hs || !hs["Content-Type"])) {
                        hs = hs || {};
                        hs["Content-Type"] = "application/x-www-form-urlencoded";
                    }
                    return OpenLayers.Request.issue({
                            success: createComplete("success", cb),
                            failure: createComplete("failure", cb),
                            method: method,
                            headers: hs,
                            data: data,
                            url: uri
                        });
                },
                isCallInProgress: function (request) {
                    return true;
                },
                abort: function (request) {
                    request.abort();
                }
            });
    })();
OpenLayers.Util.extend(OpenLayers.Format.WFST.v1.prototype.namespaces, {
        gml32: 'http://www.opengis.net/gml/3.2'
    });
OpenLayers.Format.Atom.prototype.parseLocations = function (node) {
    var georssns = this.namespaces.georss;
    var locations = {
        components: []
    };
    var where = this.getElementsByTagNameNS(node, georssns, "where");
    if (where && where.length > 0) {
        if (!this.gmlParser) {
            this.initGmlParser();
        }
        for (var i = 0, ii = where.length; i < ii; i++) {
            this.gmlParser.readChildNodes(where[i], locations);
        }
    }
    var components = locations.components;
    var point = this.getElementsByTagNameNS(node, georssns, "point");
    if (point && point.length > 0) {
        for (var i = 0, ii = point.length; i < ii; i++) {
            var xy = OpenLayers.String.trim(point[i].firstChild.nodeValue).split(/\s+/);
            if (xy.length != 2) {
                xy = OpenLayers.String.trim(point[i].firstChild.nodeValue).split(/\s*,\s*/);
            }
            components.push(new OpenLayers.Geometry.Point(xy[1], xy[0]));
        }
    }
    var line = this.getElementsByTagNameNS(node, georssns, "line");
    if (line && line.length > 0) {
        var coords;
        var p;
        var points;
        for (var i = 0, ii = line.length; i < ii; i++) {
            coords = OpenLayers.String.trim(line[i].firstChild.nodeValue).split(/\s+/);
            points = [];
            for (var j = 0, jj = coords.length; j < jj; j += 2) {
                p = new OpenLayers.Geometry.Point(coords[j + 1], coords[j]);
                points.push(p);
            }
            components.push(new OpenLayers.Geometry.LineString(points));
        }
    }
    var polygon = this.getElementsByTagNameNS(node, georssns, "polygon");
    if (polygon && polygon.length > 0) {
        var coords;
        var p;
        var points;
        for (var i = 0, ii = polygon.length; i < ii; i++) {
            coords = OpenLayers.String.trim(polygon[i].firstChild.nodeValue).split(/\s+/);
            points = [];
            for (var j = 0, jj = coords.length; j < jj; j += 2) {
                p = new OpenLayers.Geometry.Point(coords[j + 1], coords[j]);
                points.push(p);
            }
            components.push(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)]));
        }
    }
    if (this.internalProjection && this.externalProjection) {
        for (var i = 0, ii = components.length; i < ii; i++) {
            if (components[i]) {
                components[i].transform(this.externalProjection, this.internalProjection);
            }
        }
    }
    return components;
};
OpenLayers.Util.modifyDOMElement = function (element, id, px, sz, position, border, overflow, opacity) {
    if (id) {
        element.id = id;
    }
    if (px) {
        if (!px.x) {
            px.x = 0;
        }
        if (!px.y) {
            px.y = 0;
        }
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};
OpenLayers.Layer.Vector.prototype.setOpacity = function (opacity) {
    if (opacity != this.opacity) {
        this.opacity = opacity;
        var element = this.renderer.root;
        OpenLayers.Util.modifyDOMElement(element, null, null, null, null, null, null, opacity);
        if (this.map != null) {
            this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
        }
    }
};
Ext.override(GeoExt.WMSLegend, {
        getLegendUrl: function (layerName, layerNames) {
            var rec = this.layerRecord;
            var url;
            var styles = rec && rec.get("styles");
            var layer = rec.getLayer();
            layerNames = layerNames || [layer.params.LAYERS].join(",").split(",");
            var styleNames = layer.params.STYLES && [layer.params.STYLES].join(",").split(",");
            var idx = layerNames.indexOf(layerName);
            var styleName = styleNames && styleNames[idx];
            if (styles && styles.length > 0) {
                if (styleName) {
                    Ext.each(styles, function (s) {
                            url = (s.name == styleName && s.legend) && s.legend.href;
                            return !url;
                        });
                } else if (this.defaultStyleIsFirst === true && !styleNames && !layer.params.SLD && !layer.params.SLD_BODY) {
                    url = styles[0].legend && styles[0].legend.href;
                }
            }
            if (!url) {
                url = layer.getFullRequestString({
                        REQUEST: "GetLegendGraphic",
                        WIDTH: null,
                        HEIGHT: null,
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        LAYER: layerName,
                        LAYERS: null,
                        STYLE: (styleName !== '') ? styleName : null,
                        STYLES: null,
                        SRS: null,
                        FORMAT: null,
                        TIME: null
                    });
            }
            var params = Ext.apply({}, this.baseParams);
            if (layer.params._OLSALT) {
                params._OLSALT = layer.params._OLSALT;
            }
            url = Ext.urlAppend(url, Ext.urlEncode(params));
            if (url.toLowerCase().indexOf("request=getlegendgraphic") != -1) {
                if (url.toLowerCase().indexOf("format=") == -1) {
                    url = Ext.urlAppend(url, "FORMAT=image%2Fgif");
                }
                if (this.useScaleParameter === true) {
                    var scale = layer.map.getScale();
                    url = Ext.urlAppend(url, "SCALE=" + scale);
                }
            }
            return url;
        }
    });
Ext.override(GeoExt.tree.LayerNodeUI, {
        enforceOneVisible: function () {
            var attributes = this.node.attributes;
            var group = attributes.checkedGroup;
            if (group && group !== "gx_baselayer") {
                var layer = this.node.layer;
                if (attributes.checked) {
                    var checkedNodes = this.node.getOwnerTree().getChecked();
                    var checkedCount = 0;
                    Ext.each(checkedNodes, function (n) {
                            var l = n.layer;
                            if (!n.hidden && n.attributes.checkedGroup === group) {
                                checkedCount++;
                                if (l != layer && attributes.checked) {
                                    l.setVisibility(false);
                                }
                            }
                        });
                    if (checkedCount === 0 && attributes.checked == false) {
                        layer.setVisibility(true);
                    }
                }
            }
        }
    });
Ext.override(GeoExt.tree.LayerNode, {
        renderX: function (bulkRender) {
            var layer = this.layer instanceof OpenLayers.Layer && this.layer;
            if (!layer) {
                if (!this.layerStore || this.layerStore == "auto") {
                    this.layerStore = GeoExt.MapPanel.guess().layers;
                }
                var i = this.layerStore.findBy(function (o) {
                        return o.get("title") == this.layer;
                    }, this);
                if (i != -1) {
                    layer = this.layerStore.getAt(i).getLayer();
                }
            }
            if (!this.rendered || !layer) {
                var ui = this.getUI();
                if (layer) {
                    this.layer = layer;
                    if (layer.isBaseLayer) {
                        this.draggable = false;
                        this.disabled = true;
                    }
                    this.autoDisable = !(this.autoDisable === false || this.layer.isBaseLayer || this.layer.alwaysInRange);
                    if (!this.text) {
                        this.text = layer.name;
                    }
                    ui.show();
                    this.addVisibilityEventHandlers();
                } else {
                    ui.hide();
                }
                if (this.layerStore instanceof GeoExt.data.LayerStore) {
                    this.addStoreEventHandlers(layer);
                }
            }
            GeoExt.tree.LayerNode.superclass.render.apply(this, arguments);
        }
    });
Ext.override(GeoExt.form.SearchAction, {
        run: function () {
            var o = this.options;
            var f = GeoExt.form.toFilter(this.form, o);
            if (o.clientValidation === false || this.form.isValid()) {
                if (o.abortPrevious && this.form.prevResponse) {
                    o.protocol.abort(this.form.prevResponse);
                }
                this.form.prevResponse = o.protocol.read(Ext.applyIf({
                            filter: f,
                            callback: this.handleResponse,
                            scope: this
                        }, o));
            } else if (o.clientValidation !== false) {
                this.failureType = Ext.form.Action.CLIENT_INVALID;
                this.form.afterAction(this, false);
            }
        }
    });
GeoExt.form.toFilter = function (form, options) {
    var wildcard = options.wildcard;
    var logicalOp = options.logicalOp;
    var matchCase = options.matchCase;
    if (form instanceof Ext.form.FormPanel) {
        form = form.getForm();
    }
    var filters = [],
        values = form.getValues(false);
    for (var prop in values) {
        var s = prop.split("__");
        var value = values[prop],
            type;
        if (s.length > 1 && (type = GeoExt.form.toFilter.FILTER_MAP[s[1]]) !== undefined) {
            prop = s[0];
        } else {
            type = OpenLayers.Filter.Comparison.EQUAL_TO;
        }
        if (type === OpenLayers.Filter.Comparison.LIKE) {
            switch (wildcard) {
            case GeoExt.form.ENDS_WITH:
                value = '.*' + value;
                break;
            case GeoExt.form.STARTS_WITH:
                value += '.*';
                break;
            case GeoExt.form.CONTAINS:
                value = '.*' + value + '.*';
                break;
            default:
                break;
            }
        }
        filters.push(new OpenLayers.Filter.Comparison({
                    type: type,
                    value: value,
                    property: prop,
                    matchCase: matchCase
                }));
    }
    return filters.length == 1 && logicalOp != OpenLayers.Filter.Logical.NOT ? filters[0] : new OpenLayers.Filter.Logical({
            type: logicalOp || OpenLayers.Filter.Logical.AND,
            filters: filters
        });
};
GeoExt.form.toFilter.FILTER_MAP = {
    "eq": OpenLayers.Filter.Comparison.EQUAL_TO,
    "ne": OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
    "lt": OpenLayers.Filter.Comparison.LESS_THAN,
    "le": OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
    "gt": OpenLayers.Filter.Comparison.GREATER_THAN,
    "ge": OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
    "like": OpenLayers.Filter.Comparison.LIKE
};
GeoExt.form.ENDS_WITH = 1;
GeoExt.form.STARTS_WITH = 2;
GeoExt.form.CONTAINS = 3;
Ext.namespace("Heron");
Heron.singleFile = true;
Ext.namespace("Heron");
Ext.namespace("Heron.globals");
Heron.globals = {
    serviceUrl: '/cgi-bin/heron.cgi',
    version: '0.73rc3',
    imagePath: undefined
};
try {
    Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs";
} catch (err) {}
Ext.namespace("Heron.App");
Heron.App = function () {
    return {
        create: function () {
            Ext.QuickTips.init();
            if (Heron.layout.renderTo || Heron.layout.xtype == 'window') {
                Heron.App.topComponent = Ext.create(Heron.layout);
            } else {
                Heron.App.topComponent = new Ext.Viewport({
                        id: "hr-topComponent",
                        layout: "fit",
                        hideBorders: true,
                        items: [Heron.layout]
                    });
            }
        },
        show: function () {
            Heron.App.topComponent.show();
        },
        getMap: function () {
            return Heron.App.map;
        },
        setMap: function (aMap) {
            Heron.App.map = aMap;
        },
        getMapPanel: function () {
            return Heron.App.mapPanel;
        },
        setMapPanel: function (aMapPanel) {
            Heron.App.mapPanel = aMapPanel;
        }
    };
}();
Ext.namespace("Heron");
Ext.onReady(function () {
        if (!Heron.noAutoLaunch) {
            Heron.App.create();
            Heron.App.show();
        }
    }, Heron.App);
Ext.namespace("Heron.Utils");
Ext.namespace("Heron.globals");
Heron.Utils = (function () {
        var browserWindows = new Array();
        var openMsgURL = 'http://extjs.cachefly.net/ext-3.4.0/resources/images/default/s.gif';
        var instance = {
            getScriptLocation: function () {
                if (!Heron.globals.scriptLoc) {
                    Heron.globals.scriptLoc = '';
                    var scriptName = (!Heron.singleFile) ? "lib/DynLoader.js" : "script/Heron.js";
                    var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                        scripts = document.getElementsByTagName('script'),
                        src = "";
                    for (var i = 0, len = scripts.length; i < len; i++) {
                        src = scripts[i].getAttribute('src');
                        if (src) {
                            var m = src.match(r);
                            if (m) {
                                Heron.globals.scriptLoc = m[1];
                                break;
                            }
                        }
                    }
                }
                return Heron.globals.scriptLoc;
            },
            getImagesLocation: function () {
                return Heron.globals.imagePath || (Heron.Utils.getScriptLocation() + "resources/images/");
            },
            getImageLocation: function (image) {
                return Heron.Utils.getImagesLocation() + image;
            },
            rand: function (min, max) {
                return Math.floor(Math.random() * ((max - min) + 1) + min);
            },
            randArrayElm: function (arr) {
                return arr[Heron.Utils.rand(0, arr.length - 1)];
            },
            formatXml: function (xml, htmlEscape) {
                var reg = /(>)(<)(\/*)/g;
                var wsexp = / *(.*) +\n/g;
                var contexp = /(<.+>)(.+\n)/g;
                xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
                var pad = 0;
                var formatted = '';
                var lines = xml.split('\n');
                var indent = 0;
                var lastType = 'other';
                var transitions = {
                    'single->single': 0,
                    'single->closing': -1,
                    'single->opening': 0,
                    'single->other': 0,
                    'closing->single': 0,
                    'closing->closing': -1,
                    'closing->opening': 0,
                    'closing->other': 0,
                    'opening->single': 1,
                    'opening->closing': 0,
                    'opening->opening': 1,
                    'opening->other': 1,
                    'other->single': 0,
                    'other->closing': -1,
                    'other->opening': 0,
                    'other->other': 0
                };
                for (var i = 0; i < lines.length; i++) {
                    var ln = lines[i];
                    var single = Boolean(ln.match(/<.+\/>/));
                    var closing = Boolean(ln.match(/<\/.+>/));
                    var opening = Boolean(ln.match(/<[^!].*>/));
                    var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
                    var fromTo = lastType + '->' + type;
                    lastType = type;
                    var padding = '';
                    indent += transitions[fromTo];
                    for (var j = 0; j < indent; j++) {
                        padding += '    ';
                    }
                    if (htmlEscape) {
                        ln = ln.replace('<', '&lt;');
                        ln = ln.replace('>', '&gt;');
                    }
                    formatted += padding + ln + '\n';
                }
                return formatted;
            },
            openBrowserWindow: function (winName, bReopen, theURL, hasMenubar, hasToolbar, hasAddressbar, hasStatusbar, hasScrollbars, isResizable, hasPos, xPos, yPos, hasSize, wSize, hSize) {
                var x, y;
                var options = "";
                var pwin = null;
                if (hasMenubar) {
                    options += "menubar=yes";
                } else {
                    options += "menubar=no";
                }
                if (hasToolbar) {
                    options += ",toolbar=yes";
                } else {
                    options += ",toolbar=no";
                }
                if (hasAddressbar) {
                    options += ",location=yes";
                } else {
                    options += ",location=no";
                }
                if (hasStatusbar) {
                    options += ",status=yes";
                } else {
                    options += ",status=no";
                }
                if (hasScrollbars) {
                    options += ",scrollbars=yes";
                } else {
                    options += ",scrollbars=no";
                }
                if (isResizable) {
                    options += ",resizable=yes";
                } else {
                    options += ",resizable=no";
                }
                if (!hasSize) {
                    wSize = 640;
                    hSize = 480;
                }
                options += ",width=" + wSize + ",innerWidth=" + wSize;
                options += ",height=" + hSize + ",innerHeight=" + hSize;
                if (!hasPos) {
                    xPos = (screen.width - 700) / 2;
                    yPos = 75;
                }
                options += ",left=" + xPos + ",top=" + yPos;
                if (bReopen) {
                    browserWindows[winName] = window.open(theURL, winName, options);
                } else {
                    if (!browserWindows[winName] || browserWindows[winName].closed) {
                        browserWindows[winName] = window.open(theURL, winName, options);
                    } else {
                        browserWindows[winName].location.href = theURL;
                    }
                }
                browserWindows[winName].focus();
            }
        };
        return (instance);
    })();
Ext.ns('Ext.ux.form');
Ext.ux.form.Spacer = Ext.extend(Ext.BoxComponent, {
        height: 12,
        autoEl: 'div'
    });
Ext.reg('spacer', Ext.ux.form.Spacer);
Ext.namespace("Heron.data");
Heron.data.OpenLS_XLSReader = function (meta, recordType) {
    meta = meta || {};
    Ext.applyIf(meta, {
            idProperty: meta.idProperty || meta.idPath || meta.id,
            successProperty: meta.successProperty || meta.success
        });
    Heron.data.OpenLS_XLSReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Heron.data.OpenLS_XLSReader, Ext.data.XmlReader, {
        addOptXlsText: function (format, text, node, tagname, sep) {
            var elms = format.getElementsByTagNameNS(node, "http://www.opengis.net/xls", tagname);
            if (elms) {
                Ext.each(elms, function (elm, index) {
                        var str = format.getChildValue(elm);
                        if (str) {
                            text = text + sep + str;
                        }
                    });
            }
            return text;
        },
        readRecords: function (doc) {
            this.xmlData = doc;
            var root = doc.documentElement || doc;
            var records = this.extractData(root);
            return {
                success: true,
                records: records,
                totalRecords: records.length
            };
        },
        extractData: function (root) {
            var opts = {
                namespaces: {
                    gml: "http://www.opengis.net/gml",
                    xls: "http://www.opengis.net/xls"
                }
            };
            var records = [];
            var format = new OpenLayers.Format.XML(opts);
            var addresses = format.getElementsByTagNameNS(root, "http://www.opengis.net/xls", 'GeocodedAddress');
            var recordType = Ext.data.Record.create([{
                        name: "lon",
                        type: "number"
                    }, {
                        name: "lat",
                        type: "number"
                    }, "text"
                ]);
            var reader = this;
            Ext.each(addresses, function (address, index) {
                    var pos = format.getElementsByTagNameNS(address, "http://www.opengis.net/gml", 'pos');
                    var xy = '';
                    if (pos && pos[0]) {
                        xy = format.getChildValue(pos[0]);
                    }
                    var xyArr = xy.split(' ');
                    var text = '';
                    text = reader.addOptXlsText(format, text, address, 'Street', '');
                    text = reader.addOptXlsText(format, text, address, 'Place', ',');
                    var values = {
                        lon: parseFloat(xyArr[0]),
                        lat: parseFloat(xyArr[1]),
                        text: text
                    };
                    var record = new recordType(values, index);
                    records.push(record);
                });
            return records;
        }
    });
Ext.namespace("Heron.data");
Heron.data.DataExporter = {
    formatStore: function (store, config, base64Encode) {
        var formatter = new Ext.ux.Exporter[config.formatter]();
        var data = formatter.format(store, config);
        if (base64Encode) {
            data = Base64.encode(data);
        }
        return data;
    },
    download: function (data, config) {
        try {
            Ext.destroy(Ext.get('hr_uploadForm'));
        } catch (e) {}
        var form = Ext.DomHelper.append(document.body, {
                tag: 'form',
                id: 'hr_uploadForm',
                method: 'post',
                action: Heron.globals.serviceUrl,
                children: [{
                        tag: 'input',
                        type: 'hidden',
                        name: 'data',
                        value: data
                    }, {
                        tag: 'input',
                        type: 'hidden',
                        name: 'filename',
                        value: config.fileName
                    }, {
                        tag: 'input',
                        type: 'hidden',
                        name: 'mime',
                        value: config.mimeType
                    }
                ]
            });
        document.body.appendChild(form);
        form.submit();
    },
    directDownload: function (url) {
        try {
            Ext.destroy(Ext.get('hr_directdownload'));
        } catch (e) {}
        var iframe = Ext.DomHelper.append(document.body, {
                tag: 'iframe',
                id: 'hr_directdownload',
                name: 'hr_directdownload',
                width: '0px',
                height: '0px',
                border: '0px',
                style: 'width: 0; height: 0; border: none;',
                src: url
            });
        document.body.appendChild(iframe);
    }
};
var Base64 = (function () {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = utf8Encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) + keyStr.charAt(enc4);
                }
                return output;
            }
        };
    })();
Ext.ux.Exporter = function () {
    return {
        exportGrid: function (grid, formatter, config) {
            config = config || {};
            formatter = formatter || new Ext.ux.Exporter.CSVFormatter();
            Ext.applyIf(config, {
                    title: grid.title
                });
            return formatter.format(grid.store, config);
        },
        exportStore: function (store, formatter, config) {
            config = config || {};
            formatter = formatter || new Ext.ux.Exporter.ExcelFormatter();
            Ext.applyIf(config, {
                    columns: config.store.fields.items
                });
            return Base64.encode(formatter.format(store, config));
        },
        exportTree: function (tree, formatter, config) {
            config = config || {};
            formatter = formatter || new Ext.ux.Exporter.ExcelFormatter();
            var store = tree.store || config.store;
            Ext.applyIf(config, {
                    title: tree.title
                });
            return Base64.encode(formatter.format(store, config));
        }
    };
}();
Ext.ux.Exporter.Button = Ext.extend(Ext.Button, {
        constructor: function (config) {
            config = config || {};
            Ext.applyIf(config, {
                    formatter: 'CSVFormatter',
                    fileName: 'heron_export.csv',
                    mimeType: 'text/csv',
                    exportFunction: 'exportGrid',
                    disabled: true,
                    text: 'Export',
                    cls: 'download'
                });
            if (config.store == undefined && config.component != undefined) {
                Ext.applyIf(config, {
                        store: config.component.store
                    });
            } else {
                Ext.applyIf(config, {
                        component: {
                            store: config.store
                        }
                    });
            }
            Ext.ux.Exporter.Button.superclass.constructor.call(this, config);
            if (this.store && Ext.isFunction(this.store.on)) {
                var self = this;
                self.store = this.store;
                var setLink = function () {
                    var link = this.getEl().child('a', true);
                    var buttonFun = function () {
                        var formatter = new Ext.ux.Exporter[config.formatter]();
                        var data = formatter.format(self.store, config);
                        data = Base64.encode(data);
                        Heron.data.DataExporter.download(data, config.fileName, config.mimeType)
                    };
                    link.href = '#';
                    link.onclick = buttonFun;
                    this.enable();
                }
                if (this.el) {
                    setLink.call(this);
                } else {
                    this.on('render', setLink, this);
                }
                this.store.on('load', setLink, this);
            }
        },
        template: new Ext.Template('<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>', '<td class="x-btn-left"><i> </i></td><td class="x-btn-center"><a class="x-btn-text" href="{1}" target="{2}">{0}</a></td><td class="x-btn-right"><i> </i></td>', "</tr></tbody></table>"),
        onRender: function (ct, position) {
            var btn, targs = [this.text || ' ', this.href, this.target || "_self"];
            if (position) {
                btn = this.template.insertBefore(position, targs, true);
            } else {
                btn = this.template.append(ct, targs, true);
            }
            var btnEl = btn.child("a:first");
            this.btnEl = btnEl;
            btnEl.on('focus', this.onFocus, this);
            btnEl.on('blur', this.onBlur, this);
            this.initButtonEl(btn, btnEl);
            Ext.ButtonToggleMgr.register(this);
        },
        onClick: function (e) {
            if (e.button != 0) return;
            if (!this.disabled) {
                this.fireEvent("click", this, e);
                if (this.handler) this.handler.call(this.scope || this, this, e);
            }
        }
    });
Ext.reg('exportbutton', Ext.ux.Exporter.Button);
Ext.ux.Exporter.Formatter = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
};
Ext.ux.Exporter.Formatter.prototype = {
    format: Ext.emptyFn
};
Ext.ux.Exporter.OpenLayersFormatter = Ext.extend(Ext.ux.Exporter.Formatter, {
        format: function (store, config) {
            var formatter = config.format;
            if (typeof formatter == 'string') {
                formatter = eval('new ' + formatter + '()');
            }
            if (config.fileProjection) {
                formatter.internalProjection = config.mapProjection;
                formatter.externalProjection = config.fileProjection;
            }
            var data = formatter.write(store.layer.features);
            return data;
        }
    });
Ext.ux.Exporter.ExcelFormatter = Ext.extend(Ext.ux.Exporter.Formatter, {
        format: function (store, config) {
            var workbook = new Ext.ux.Exporter.ExcelFormatter.Workbook(config);
            workbook.addWorksheet(store, config || {});
            return workbook.render();
        }
    });
Ext.ux.Exporter.CSVFormatter = Ext.extend(Ext.ux.Exporter.Formatter, {
        extend: "Ext.ux.exporter.Formatter",
        contentType: 'data:text/csv;base64,',
        separator: ";",
        extension: "csv",
        format: function (store, config) {
            this.columns = config.columns || (store.fields ? store.fields.items : store.model.prototype.fields.items);
            return this.getHeaders(store) + "\n" + this.getRows(store);
        },
        getHeaders: function (store) {
            var columns = [];
            Ext.each(this.columns, function (col) {
                    var title;
                    if (col.text != undefined) {
                        title = col.text;
                    } else if (col.name) {
                        title = col.name.replace(/_/g, " ");
                    }
                    columns.push(title);
                }, this);
            return columns.join(this.separator);
        },
        getRows: function (store) {
            var rows = [];
            store.each(function (record, index) {
                    rows.push(this.getCell(record, index));
                }, this);
            return rows.join("\n");
        },
        getCell: function (record, index) {
            var cells = [];
            Ext.each(this.columns, function (col) {
                    var name = col.name || col.dataIndex;
                    if (name) {
                        if (Ext.isFunction(col.renderer)) {
                            var value = col.renderer(record.get(name), null, record);
                        } else {
                            var value = record.get(name);
                        }
                        cells.push(value);
                    }
                });
            return cells.join(this.separator);
        }
    });
Ext.ux.Exporter.ExcelFormatter.Workbook = Ext.extend(Object, {
        constructor: function (config) {
            config = config || {};
            Ext.apply(this, config, {
                    title: "Workbook",
                    worksheets: [],
                    compiledWorksheets: [],
                    cellBorderColor: "#e4e4e4",
                    styles: [],
                    compiledStyles: [],
                    hasDefaultStyle: true,
                    hasStripeStyles: true,
                    windowHeight: 9000,
                    windowWidth: 50000,
                    protectStructure: false,
                    protectWindows: false
                });
            if (this.hasDefaultStyle) this.addDefaultStyle();
            if (this.hasStripeStyles) this.addStripedStyles();
            this.addTitleStyle();
            this.addHeaderStyle();
        },
        render: function () {
            this.compileStyles();
            this.joinedCompiledStyles = this.compiledStyles.join("");
            this.compileWorksheets();
            this.joinedWorksheets = this.compiledWorksheets.join("");
            return this.tpl.apply(this);
        },
        addWorksheet: function (store, config) {
            var worksheet = new Ext.ux.Exporter.ExcelFormatter.Worksheet(store, config);
            this.worksheets.push(worksheet);
            return worksheet;
        },
        addStyle: function (config) {
            var style = new Ext.ux.Exporter.ExcelFormatter.Style(config || {});
            this.styles.push(style);
            return style;
        },
        compileStyles: function () {
            this.compiledStyles = [];
            Ext.each(this.styles, function (style) {
                    this.compiledStyles.push(style.render());
                }, this);
            return this.compiledStyles;
        },
        compileWorksheets: function () {
            this.compiledWorksheets = [];
            Ext.each(this.worksheets, function (worksheet) {
                    this.compiledWorksheets.push(worksheet.render());
                }, this);
            return this.compiledWorksheets;
        },
        tpl: new Ext.XTemplate('<?xml version="1.0" encoding="utf-8"?>', '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">', '<o:DocumentProperties>', '<o:Title>{title}</o:Title>', '</o:DocumentProperties>', '<ss:ExcelWorkbook>', '<ss:WindowHeight>{windowHeight}</ss:WindowHeight>', '<ss:WindowWidth>{windowWidth}</ss:WindowWidth>', '<ss:ProtectStructure>{protectStructure}</ss:ProtectStructure>', '<ss:ProtectWindows>{protectWindows}</ss:ProtectWindows>', '</ss:ExcelWorkbook>', '<ss:Styles>', '{joinedCompiledStyles}', '</ss:Styles>', '{joinedWorksheets}', '</ss:Workbook>'),
        addDefaultStyle: function () {
            var borderProperties = [{
                    name: "Color",
                    value: this.cellBorderColor
                }, {
                    name: "Weight",
                    value: "1"
                }, {
                    name: "LineStyle",
                    value: "Continuous"
                }
            ];
            this.addStyle({
                    id: 'Default',
                    attributes: [{
                            name: "Alignment",
                            properties: [{
                                    name: "Vertical",
                                    value: "Top"
                                }, {
                                    name: "WrapText",
                                    value: "1"
                                }
                            ]
                        }, {
                            name: "Font",
                            properties: [{
                                    name: "FontName",
                                    value: "tahoma"
                                }, {
                                    name: "Size",
                                    value: "10"
                                }
                            ]
                        }, {
                            name: "Interior"
                        }, {
                            name: "NumberFormat"
                        }, {
                            name: "Protection"
                        }, {
                            name: "Borders",
                            children: [{
                                    name: "Border",
                                    properties: [{
                                            name: "Position",
                                            value: "Top"
                                        }
                                    ].concat(borderProperties)
                                }, {
                                    name: "Border",
                                    properties: [{
                                            name: "Position",
                                            value: "Bottom"
                                        }
                                    ].concat(borderProperties)
                                }, {
                                    name: "Border",
                                    properties: [{
                                            name: "Position",
                                            value: "Left"
                                        }
                                    ].concat(borderProperties)
                                }, {
                                    name: "Border",
                                    properties: [{
                                            name: "Position",
                                            value: "Right"
                                        }
                                    ].concat(borderProperties)
                                }
                            ]
                        }
                    ]
                });
        },
        addTitleStyle: function () {
            this.addStyle({
                    id: "title",
                    attributes: [{
                            name: "Borders"
                        }, {
                            name: "Font"
                        }, {
                            name: "NumberFormat",
                            properties: [{
                                    name: "Format",
                                    value: "@"
                                }
                            ]
                        }, {
                            name: "Alignment",
                            properties: [{
                                    name: "WrapText",
                                    value: "1"
                                }, {
                                    name: "Horizontal",
                                    value: "Center"
                                }, {
                                    name: "Vertical",
                                    value: "Center"
                                }
                            ]
                        }
                    ]
                });
        },
        addHeaderStyle: function () {
            this.addStyle({
                    id: "headercell",
                    attributes: [{
                            name: "Font",
                            properties: [{
                                    name: "Bold",
                                    value: "1"
                                }, {
                                    name: "Size",
                                    value: "10"
                                }
                            ]
                        }, {
                            name: "Interior",
                            properties: [{
                                    name: "Pattern",
                                    value: "Solid"
                                }, {
                                    name: "Color",
                                    value: "#A3C9F1"
                                }
                            ]
                        }, {
                            name: "Alignment",
                            properties: [{
                                    name: "WrapText",
                                    value: "1"
                                }, {
                                    name: "Horizontal",
                                    value: "Center"
                                }
                            ]
                        }
                    ]
                });
        },
        addStripedStyles: function () {
            this.addStyle({
                    id: "even",
                    attributes: [{
                            name: "Interior",
                            properties: [{
                                    name: "Pattern",
                                    value: "Solid"
                                }, {
                                    name: "Color",
                                    value: "#CCFFFF"
                                }
                            ]
                        }
                    ]
                });
            this.addStyle({
                    id: "odd",
                    attributes: [{
                            name: "Interior",
                            properties: [{
                                    name: "Pattern",
                                    value: "Solid"
                                }, {
                                    name: "Color",
                                    value: "#CCCCFF"
                                }
                            ]
                        }
                    ]
                });
            Ext.each(['even', 'odd'], function (parentStyle) {
                    this.addChildNumberFormatStyle(parentStyle, parentStyle + 'date', "[ENG][$-409]dd\-mmm\-yyyy;@");
                    this.addChildNumberFormatStyle(parentStyle, parentStyle + 'int', "0");
                    this.addChildNumberFormatStyle(parentStyle, parentStyle + 'float', "0.00");
                }, this);
        },
        addChildNumberFormatStyle: function (parentStyle, id, value) {
            this.addStyle({
                    id: id,
                    parentStyle: "even",
                    attributes: [{
                            name: "NumberFormat",
                            properties: [{
                                    name: "Format",
                                    value: value
                                }
                            ]
                        }
                    ]
                });
        }
    });
Ext.ux.Exporter.ExcelFormatter.Worksheet = Ext.extend(Object, {
        constructor: function (store, config) {
            config = config || {};
            this.store = store;
            Ext.applyIf(config, {
                    hasTitle: true,
                    hasHeadings: true,
                    stripeRows: true,
                    title: "Workbook",
                    columns: store.fields == undefined ? {} : store.fields.items
                });
            Ext.apply(this, config);
            Ext.ux.Exporter.ExcelFormatter.Worksheet.superclass.constructor.apply(this, arguments);
        },
        dateFormatString: "Y-m-d",
        worksheetTpl: new Ext.XTemplate('<ss:Worksheet ss:Name="{title}">', '<ss:Names>', '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'{title}\'!R1:R2" />', '</ss:Names>', '<ss:Table x:FullRows="1" x:FullColumns="1" ss:ExpandedColumnCount="{colCount}" ss:ExpandedRowCount="{rowCount}">', '{columns}', '<ss:Row ss:Height="38">', '<ss:Cell ss:StyleID="title" ss:MergeAcross="{colCount - 1}">', '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">', '<html:B><html:U><html:Font html:Size="15">{title}', '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />', '</ss:Cell>', '</ss:Row>', '<ss:Row ss:AutoFitHeight="1">', '{header}', '</ss:Row>', '{rows}', '</ss:Table>', '<x:WorksheetOptions>', '<x:PageSetup>', '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />', '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />', '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />', '</x:PageSetup>', '<x:FitToPage />', '<x:Print>', '<x:PrintErrors>Blank</x:PrintErrors>', '<x:FitWidth>1</x:FitWidth>', '<x:FitHeight>32767</x:FitHeight>', '<x:ValidPrinterInfo />', '<x:VerticalResolution>600</x:VerticalResolution>', '</x:Print>', '<x:Selected />', '<x:DoNotDisplayGridlines />', '<x:ProtectObjects>False</x:ProtectObjects>', '<x:ProtectScenarios>False</x:ProtectScenarios>', '</x:WorksheetOptions>', '</ss:Worksheet>'),
        render: function (store) {
            return this.worksheetTpl.apply({
                    header: this.buildHeader(),
                    columns: this.buildColumns().join(""),
                    rows: this.buildRows().join(""),
                    colCount: this.columns.length,
                    rowCount: this.store.getCount() + 2,
                    title: this.title
                });
        },
        buildColumns: function () {
            var cols = [];
            Ext.each(this.columns, function (column) {
                    cols.push(this.buildColumn());
                }, this);
            return cols;
        },
        buildColumn: function (width) {
            return String.format('<ss:Column ss:AutoFitWidth="1" ss:Width="{0}" />', width || 164);
        },
        buildRows: function () {
            var rows = [];
            this.store.each(function (record, index) {
                    rows.push(this.buildRow(record, index));
                }, this);
            return rows;
        },
        buildHeader: function () {
            var cells = [];
            Ext.each(this.columns, function (col) {
                    var title;
                    if (col.header != undefined) {
                        title = col.header;
                    } else {
                        title = col.name.replace(/_/g, " ");
                    }
                    cells.push(String.format('<ss:Cell ss:StyleID="headercell"><ss:Data ss:Type="String">{0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', title));
                }, this);
            return cells.join("");
        },
        buildRow: function (record, index) {
            var style, cells = [];
            if (this.stripeRows === true) style = index % 2 == 0 ? 'even' : 'odd';
            Ext.each(this.columns, function (col) {
                    var name = col.name || col.dataIndex;
                    if (Ext.isFunction(col.renderer)) {
                        var value = col.renderer(record.get(name), null, record),
                            type = "String";
                    } else {
                        var value = record.get(name),
                            type = this.typeMappings[col.type || record.fields.item(name).type];
                    }
                    cells.push(this.buildCell(value, type, style).render());
                }, this);
            return String.format("<ss:Row>{0}</ss:Row>", cells.join(""));
        },
        buildCell: function (value, type, style) {
            if (type == "DateTime" && Ext.isFunction(value.format)) value = value.format(this.dateFormatString);
            return new Ext.ux.Exporter.ExcelFormatter.Cell({
                    value: value,
                    type: type,
                    style: style
                });
        },
        typeMappings: {
            'int': "Number",
            'string': "String",
            'float': "Number",
            'date': "DateTime"
        }
    });
Ext.ux.Exporter.ExcelFormatter.Cell = Ext.extend(Object, {
        constructor: function (config) {
            Ext.applyIf(config, {
                    type: "String"
                });
            Ext.apply(this, config);
            Ext.ux.Exporter.ExcelFormatter.Cell.superclass.constructor.apply(this, arguments);
        },
        render: function () {
            return this.tpl.apply(this);
        },
        tpl: new Ext.XTemplate('<ss:Cell ss:StyleID="{style}">', '<ss:Data ss:Type="{type}"><![CDATA[{value}]]></ss:Data>', '</ss:Cell>')
    });
Ext.ux.Exporter.ExcelFormatter.Style = Ext.extend(Object, {
        constructor: function (config) {
            config = config || {};
            Ext.apply(this, config, {
                    parentStyle: '',
                    attributes: []
                });
            Ext.ux.Exporter.ExcelFormatter.Style.superclass.constructor.apply(this, arguments);
            if (this.id == undefined) throw new Error("An ID must be provided to Style");
            this.preparePropertyStrings();
        },
        preparePropertyStrings: function () {
            Ext.each(this.attributes, function (attr, index) {
                    this.attributes[index].propertiesString = this.buildPropertyString(attr);
                    this.attributes[index].children = attr.children || [];
                    Ext.each(attr.children, function (child, childIndex) {
                            this.attributes[index].children[childIndex].propertiesString = this.buildPropertyString(child);
                        }, this);
                }, this);
        },
        buildPropertyString: function (attribute) {
            var propertiesString = "";
            Ext.each(attribute.properties || [], function (property) {
                    propertiesString += String.format('ss:{0}="{1}" ', property.name, property.value);
                }, this);
            return propertiesString;
        },
        render: function () {
            return this.tpl.apply(this);
        },
        tpl: new Ext.XTemplate('<tpl if="parentStyle.length == 0">', '<ss:Style ss:ID="{id}">', '</tpl>', '<tpl if="parentStyle.length != 0">', '<ss:Style ss:ID="{id}" ss:Parent="{parentStyle}">', '</tpl>', '<tpl for="attributes">', '<tpl if="children.length == 0">', '<ss:{name} {propertiesString} />', '</tpl>', '<tpl if="children.length > 0">', '<ss:{name} {propertiesString}>', '<tpl for="children">', '<ss:{name} {propertiesString} />', '</tpl>', '</ss:{name}>', '</tpl>', '</tpl>', '</ss:Style>')
    });
Ext.namespace("Heron.widgets");
Heron.widgets.GridCellRenderer = (function () {
        function substituteAttrValues(template, options, record) {
            if (!options.attrNames) {
                options.attrNames = new Array();
                var inAttrName = false;
                var attrName = '';
                for (var i = 0; i < template.length; i++) {
                    var s = template.charAt(i);
                    if (s == '{') {
                        inAttrName = true;
                        attrName = '';
                    } else if (s == '}') {
                        options.attrNames.push(attrName)
                        inAttrName = false;
                    } else if (inAttrName) {
                        attrName += s;
                    }
                }
            }
            var result = template;
            for (var j = 0; j < options.attrNames.length; j++) {
                var name = options.attrNames[j];
                var value = record.data[name];
                if (!value) {
                    value = '';
                }
                var valueTemplate = '{' + name + '}';
                result = result.replace(valueTemplate, value);
            }
            return result;
        }
        var instance = {
            directLink: function (value, metaData, record, rowIndex, colIndex, store) {
                if (!this.options) {
                    return value;
                }
                var options = this.options;
                var url = options.url;
                if (!url) {
                    return value;
                }
                url = substituteAttrValues(url, options, record);
                var result = '<a href="' + url + '" target="{target}">' + value + '</a>';
                var target = options.target ? options.target : '_new';
                var targetTemplate = '{target}';
                return result.replace(targetTemplate, target);
            },
            browserPopupLink: function (value, metaData, record, rowIndex, colIndex, store) {
                if (!this.options) {
                    return value;
                }
                var options = this.options;
                var templateURL = options.url;
                if (!templateURL) {
                    return value;
                }
                var BrowserParam = '\'' + (options.winName ? options.winName : 'herongridcellpopup') + '\'' + ', ' + (options.bReopen ? options.bReopen : false) + ', \'' + (substituteAttrValues(templateURL, options, record)) + '\'' + ', ' + (options.hasMenubar ? options.hasMenubar : false) + ', ' + (options.hasToolbar ? options.hasToolbar : false) + ', ' + (options.hasAddressbar ? options.hasAddressbar : false) + ', ' + (options.hasStatusbar ? options.hasStatusbar : false) + ', ' + (options.hasScrollbars ? options.hasScrollbars : false) + ', ' + (options.isResizable ? options.isResizable : false) + ', ' + (options.hasPos ? options.hasPos : false) + ', ' + (options.xPos ? options.xPos : 0) + ', ' + (options.yPos ? options.yPos : 0) + ', ' + (options.hasSize ? options.hasSize : false) + ', ' + (options.wSize ? options.wSize : 200) + ', ' + (options.hSize ? options.hSize : 100);
                return (options.attrPreTxt ? options.attrPreTxt : "") + '<a href="#" onclick="' + 'Heron.Utils.openBrowserWindow(' + BrowserParam + '); return false">' + value + '</a>';
            },
            valueSubstitutor: function (value, metaData, record, rowIndex, colIndex, store) {
                if (!this.options) {
                    return value;
                }
                var options = this.options;
                var template = options.template;
                if (!template) {
                    return value;
                }
                return substituteAttrValues(template, options, record);
            }
        };
        return (instance);
    })();
Ext.namespace("Heron.widgets");
var ActiveLayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
Heron.widgets.ActiveLayerNode = Ext.extend(GeoExt.tree.LayerNode, {
        render: function (bulkRender) {
            var layer = this.layer instanceof OpenLayers.Layer && this.layer;
            if (layer && this.attributes && this.attributes.component && this.attributes.component.xtype == "gx_opacityslider") {
                this.attributes.component.layer = layer;
                if (layer.opacity >= 1.0) {
                    layer.setOpacity(1.0);
                } else if (layer.opacity < 0.0) {
                    layer.setOpacity(0.0);
                }
                this.attributes.component.value = parseInt(layer.opacity * 100);
            }
            Heron.widgets.ActiveLayerNode.superclass.renderX.call(this, bulkRender);
            if (layer && this.attributes && this.attributes.component && this.attributes.component.xtype == "gx_opacityslider") {
                if (layer.opacity >= 1.0) {
                    layer.setOpacity(0.999);
                    layer.setOpacity(1.0);
                } else if (layer.opacity >= 0.001) {
                    layer.setOpacity(layer.opacity - 0.001);
                    layer.setOpacity(layer.opacity + 0.001);
                } else {
                    layer.setOpacity(0.001);
                    layer.setOpacity(0.0);
                }
                this.attributes.component.value = parseInt(layer.opacity * 100);
            }
        }
    });
Ext.tree.TreePanel.nodeTypes.hr_activelayer = Heron.widgets.ActiveLayerNode;
Heron.widgets.ActiveLayersPanel = Ext.extend(Ext.tree.TreePanel, {
        title: __('Active Layers'),
        applyStandardNodeOpts: function (opts, layer) {
            if (opts.component) {
                opts.component.layer = layer;
            }
            opts.layerId = layer.id;
        },
        initComponent: function () {
            var self = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                enableDD: true,
                plugins: [{
                        ptype: "gx_treenodecomponent"
                    }
                ],
                root: {
                    nodeType: "gx_layercontainer",
                    text: __('Layers'),
                    loader: {
                        applyLoader: false,
                        baseAttrs: {
                            uiProvider: ActiveLayerNodeUI,
                            iconCls: 'gx-activelayer-drag-icon'
                        },
                        createNode: function (attr) {
                            return self.createNode(self, {
                                    layer: attr.layer
                                });
                        },
                        filter: function (record) {
                            var layer = record.getLayer();
                            return layer.getVisibility() && layer.displayInLayerSwitcher;
                        }
                    }
                },
                rootVisible: false,
                lines: false
            };
            Ext.apply(this, options);
            Heron.widgets.ActiveLayersPanel.superclass.initComponent.call(this);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("beforenodedrop", this.onBeforeNodeDrop);
        },
        createNode: function (self, attr) {
            if (self.hropts) {
                Ext.apply(attr, self.hropts);
            } else {
                Ext.apply(attr, {});
            }
            self.applyStandardNodeOpts(attr, attr.layer);
            attr.uiProvider = ActiveLayerNodeUI;
            attr.nodeType = "hr_activelayer";
            attr.iconCls = 'gx-activelayer-drag-icon';
            return GeoExt.tree.LayerLoader.prototype.createNode.call(self, attr);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onBeforeNodeDrop: function (dropEvt) {
            if (dropEvt) {
                switch (dropEvt.point) {
                case "above":
                    return true;
                    break;
                case "below":
                    var layer = dropEvt.target.layer;
                    if (!layer.isBaseLayer) {
                        return true;
                    }
                    break;
                }
            }
            return false;
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            map.events.register('changelayer', null, function (evt) {
                    var layer = evt.layer;
                    var rootNode = self.getRootNode();
                    var layerNode = rootNode.findChild('layerId', evt.layer.id);
                    if (evt.property === "visibility") {
                        if (evt.layer.getVisibility() && !layerNode) {
                            var newNode = self.createNode(self, {
                                    layer: layer
                                });
                            var newLayerId = layer.map.getLayerIndex(layer);
                            if (layer.isBaseLayer) {
                                var bottomLayer;
                                var bottomLayerId;
                                if (rootNode.lastChild) {
                                    bottomLayer = rootNode.lastChild.layer;
                                    if (bottomLayer) {
                                        bottomLayerId = bottomLayer.map.getLayerIndex(bottomLayer);
                                    }
                                }
                                rootNode.appendChild(newNode);
                                if (bottomLayer) {
                                    if (newLayerId > bottomLayerId) {
                                        layer.map.raiseLayer(layer, bottomLayerId - newLayerId);
                                    }
                                }
                            } else {
                                var topLayer;
                                var topLayerId;
                                if (rootNode.firstChild) {
                                    topLayer = rootNode.firstChild.layer;
                                    if (topLayer) {
                                        topLayerId = topLayer.map.getLayerIndex(topLayer);
                                    }
                                }
                                rootNode.insertBefore(newNode, rootNode.firstChild);
                                if (topLayer) {
                                    if (topLayerId > newLayerId) {
                                        layer.map.raiseLayer(layer, topLayerId - newLayerId);
                                    }
                                }
                            }
                            rootNode.reload();
                        } else if (!evt.layer.getVisibility() && layerNode) {
                            layerNode.un("move", self.onChildMove, self);
                            layerNode.remove();
                        }
                    }
                });
        },
        onListenerDoLayout: function (node) {
            if (node && node.hropts && node.hropts.component && node.hropts.component.xtype == "gx_opacityslider") {
                var rootNode = node.getRootNode();
                rootNode.cascade(function (n) {
                        if (n.layer) {
                            n.component.setValue(parseInt(n.layer.opacity * 100));
                            n.component.syncThumb();
                        }
                    });
                rootNode.reload();
                node.doLayout();
            }
        },
        listeners: {
            activate: function (node) {
                this.onListenerDoLayout(this);
            },
            expand: function (node) {
                this.onListenerDoLayout(this);
            }
        }
    });
Ext.reg('hr_activelayerspanel', Heron.widgets.ActiveLayersPanel);
Ext.namespace("Heron.widgets");
var ActiveThemeNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
Heron.widgets.ActiveThemeNode = Ext.extend(GeoExt.tree.LayerNode, {
        render: function (bulkRender) {
            var layer = this.layer instanceof OpenLayers.Layer && this.layer;
            Heron.widgets.ActiveThemeNode.superclass.renderX.call(this, bulkRender);
        }
    });
Ext.tree.TreePanel.nodeTypes.hr_activetheme = Heron.widgets.ActiveThemeNode;
Heron.widgets.ActiveThemesPanel = Ext.extend(Ext.tree.TreePanel, {
        title: __('Active Themes'),
        qtip_up: __('Move up'),
        qtip_down: __('Move down'),
        qtip_opacity: __('Opacity'),
        qtip_remove: __('Remove layer from list'),
        qtip_tools: __('Tools'),
        applyStandardNodeOpts: function (opts, layer) {
            if (opts.component) {
                opts.component.layer = layer;
            }
            opts.layerId = layer.id;
        },
        initComponent: function () {
            var self = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                enableDD: true,
                plugins: [{
                        ptype: "gx_treenodeactions",
                        listeners: {
                            action: this.onAction
                        }
                    }
                ],
                root: {
                    nodeType: "gx_layercontainer",
                    loader: {
                        applyLoader: false,
                        baseAttrs: {
                            radioGroup: "radiogroup",
                            uiProvider: ActiveThemeNodeUI
                        },
                        createNode: function (attr) {
                            return self.createNode(self, {
                                    layer: attr.layer
                                });
                        },
                        filter: function (record) {
                            var layer = record.getLayer();
                            return layer.getVisibility() && layer.displayInLayerSwitcher;
                        }
                    }
                },
                rootVisible: false,
                lines: false
            };
            Ext.apply(this, options);
            Heron.widgets.ActiveThemesPanel.superclass.initComponent.call(this);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("beforenodedrop", this.onBeforeNodeDrop);
        },
        createNode: function (self, attr) {
            if (self.hropts) {
                Ext.apply(attr, self.hropts);
            } else {
                Ext.apply(attr, {
                        showOpacity: false,
                        showTools: false,
                        showRemove: false
                    });
            }
            self.applyStandardNodeOpts(attr, attr.layer);
            attr.uiProvider = ActiveThemeNodeUI;
            attr.nodeType = "hr_activetheme";
            attr.iconCls = 'gx-activethemes-drag-icon';
            attr.actions = [{
                    action: "up",
                    qtip: this.qtip_up,
                    update: function (el) {
                        var layer = this.layer,
                            map = layer.map;
                        if (map.getLayerIndex(layer) == map.layers.length - 1) {
                            el.addClass('disabled');
                        } else {
                            el.removeClass('disabled');
                        }
                    }
                }, {
                    action: "down",
                    qtip: this.qtip_down,
                    update: function (el) {
                        var layer = this.layer,
                            map = layer.map;
                        if (map.getLayerIndex(layer) == 1) {
                            el.addClass('disabled');
                        } else {
                            el.removeClass('disabled');
                        }
                    }
                }, {
                    action: "opacity",
                    qtip: this.qtip_opacity,
                    update: function (el) {
                        var layer = this.layer,
                            map = layer.map;
                    }
                }, {
                    action: "tools",
                    qtip: this.qtip_tools,
                    update: function (el) {
                        var layer = this.layer,
                            map = layer.map;
                    }
                }, {
                    action: "remove",
                    qtip: this.qtip_remove
                }
            ];
            attr.actionsNum = attr.actions.length - 1;
            if (!self.hropts.showRemove) {
                attr.actions.remove(attr.actions[attr.actionsNum]);
            }
            attr.actionsNum = attr.actionsNum - 1;
            if (!self.hropts.showTools) {
                attr.actions.remove(attr.actions[attr.actionsNum]);
            }
            attr.actionsNum = attr.actionsNum - 1;
            if (!self.hropts.showOpacity) {
                attr.actions.remove(attr.actions[attr.actionsNum]);
            }
            attr.actionsNum = attr.actionsNum - 1;
            return GeoExt.tree.LayerLoader.prototype.createNode.call(self, attr);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onBeforeNodeDrop: function (dropEvt) {
            if (dropEvt) {
                switch (dropEvt.point) {
                case "above":
                    return true;
                    break;
                case "below":
                    var layer = dropEvt.target.layer;
                    if (!layer.isBaseLayer) {
                        return true;
                    }
                    break;
                }
            }
            return false;
        },
        onAction: function (node, action, evt) {
            var layer = node.layer;
            var actLayerId = layer.map.getLayerIndex(layer);
            switch (action) {
            case "up":
                if (!layer.isBaseLayer) {
                    var prevNode = node.previousSibling;
                    if (prevNode) {
                        var prevLayer = prevNode.layer;
                        var prevLayerId = prevLayer.map.getLayerIndex(prevLayer);
                        if (prevLayerId > actLayerId) {
                            layer.map.raiseLayer(layer, prevLayerId - actLayerId);
                        }
                    }
                }
                break;
            case "down":
                if (!layer.isBaseLayer) {
                    var nextNode = node.nextSibling;
                    if (nextNode) {
                        var nextLayer = nextNode.layer;
                        var nextLayerId = nextLayer.map.getLayerIndex(nextLayer);
                        if (nextLayerId < actLayerId) {
                            if (!nextLayer.isBaseLayer) {
                                layer.map.raiseLayer(layer, nextLayerId - actLayerId);
                            }
                        }
                    }
                }
                break;
            case "remove":
                if (!layer.isBaseLayer) {
                    Ext.MessageBox.getDialog().defaultButton = 2;
                    Ext.MessageBox.show({
                            title: String.format(__('Removing') + ' "{0}"', layer.name),
                            msg: String.format(__('Are you sure you want to remove the layer from your list of layers?'), '<i><b>' + layer.name + '</b></i>'),
                            buttons: Ext.Msg.YESNO,
                            fn: function (btn) {
                                if (btn == 'yes') {
                                    layer.setVisibility(false);
                                    layer.destroy();
                                }
                            },
                            scope: this,
                            icon: Ext.MessageBox.QUESTION,
                            maxWidth: 300
                        });
                } else {
                    Ext.MessageBox.show({
                            title: String.format(__('Removing') + ' "{0}"', layer.name),
                            msg: String.format(__('You are not allowed to remove the baselayer from your list of layers!'), '<i><b>' + layer.name + '</b></i>'),
                            buttons: Ext.Msg.OK,
                            fn: function (btn) {
                                if (btn == 'ok') {}
                            },
                            icon: Ext.MessageBox.ERROR,
                            maxWidth: 300
                        });
                }
                break;
            case "opacity":
                var cmp = Ext.getCmp('WinOpacity-' + layer.id);
                var xy = evt.getXY();
                xy[0] = xy[0] + 40;
                xy[1] = xy[1] + 0;
                if (!cmp) {
                    cmp = new Ext.Window({
                            title: __('Opacity'),
                            id: 'WinOpacity-' + layer.id,
                            x: xy[0],
                            y: xy[1],
                            width: 200,
                            resizable: false,
                            constrain: true,
                            bodyStyle: 'padding:2px 4px',
                            closeAction: 'hide',
                            listeners: {
                                hide: function () {
                                    cmp.x = xy[0];
                                    cmp.y = xy[1];
                                },
                                show: function () {
                                    cmp.show();
                                    cmp.focus();
                                }
                            },
                            items: [{
                                    xtype: 'label',
                                    text: layer.name,
                                    height: 20
                                }, {
                                    xtype: "gx_opacityslider",
                                    showTitle: false,
                                    plugins: new GeoExt.LayerOpacitySliderTip(),
                                    vertical: false,
                                    inverse: false,
                                    aggressive: false,
                                    layer: layer
                                }
                            ]
                        });
                    cmp.show();
                } else {
                    if (cmp.isVisible()) {
                        cmp.hide();
                    } else {
                        cmp.setPosition(xy[0], xy[1]);
                        cmp.show();
                        cmp.focus();
                    }
                }
                break;
            case "tools":
                var id = layer.map.getLayerIndex(layer);
                var num_id = layer.map.getNumLayers();
                Ext.MessageBox.show({
                        title: String.format('Tools "{0}"', layer.name),
                        msg: String.format('Here should be a form for "{0}" containing' + ' infos, etc.!<br>' + "<br>Layer: " + node + "<br>" + layer.name + "<br>" + layer.id + "<br>OL-LayerId: " + id + " (" + num_id + ")", '<i><b>' + layer.name + '</b></i>'),
                        buttons: Ext.Msg.OK,
                        fn: function (btn) {
                            if (btn == 'ok') {}
                        },
                        icon: Ext.MessageBox.INFO,
                        maxWidth: 300
                    });
                break;
            }
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            map.events.register('changelayer', null, function (evt) {
                    var layer = evt.layer;
                    var rootNode = self.getRootNode();
                    var layerNode = rootNode.findChild('layerId', evt.layer.id);
                    if (evt.property === "visibility") {
                        if (evt.layer.getVisibility() && !layerNode) {
                            var newNode = self.createNode(self, {
                                    layer: layer
                                });
                            var newLayerId = layer.map.getLayerIndex(layer);
                            if (layer.isBaseLayer) {
                                var bottomLayer;
                                var bottomLayerId;
                                if (rootNode.lastChild) {
                                    bottomLayer = rootNode.lastChild.layer;
                                    if (bottomLayer) {
                                        bottomLayerId = bottomLayer.map.getLayerIndex(bottomLayer);
                                    }
                                }
                                rootNode.appendChild(newNode);
                                if (bottomLayer) {
                                    if (newLayerId > bottomLayerId) {
                                        layer.map.raiseLayer(layer, bottomLayerId - newLayerId);
                                    }
                                }
                            } else {
                                var topLayer;
                                var topLayerId;
                                if (rootNode.firstChild) {
                                    topLayer = rootNode.firstChild.layer;
                                    if (topLayer) {
                                        topLayerId = topLayer.map.getLayerIndex(topLayer);
                                    }
                                }
                                rootNode.insertBefore(newNode, rootNode.firstChild);
                                if (topLayer) {
                                    if (topLayerId > newLayerId) {
                                        layer.map.raiseLayer(layer, topLayerId - newLayerId);
                                    }
                                }
                            }
                            rootNode.reload();
                        } else if (!evt.layer.getVisibility() && layerNode) {
                            var opacityWin = Ext.getCmp('WinOpacity-' + layer.id);
                            if (opacityWin) {
                                opacityWin.hide();
                            }
                            layerNode.un("move", self.onChildMove, self);
                            layerNode.remove();
                        }
                    }
                });
        }
    });
Ext.reg('hr_activethemespanel', Heron.widgets.ActiveThemesPanel);
Ext.namespace("Heron.widgets");
Heron.widgets.CapabilitiesTreePanel = Ext.extend(Ext.tree.TreePanel, {
        initComponent: function () {
            var layerOptions = Ext.apply({
                    buffer: 0,
                    singleTile: true,
                    ratio: 1
                }, this.hropts.layerOptions);
            var layerParams = Ext.apply({
                    'TRANSPARENT': 'TRUE'
                }, this.hropts.layerParams);
            var root = new Ext.tree.AsyncTreeNode({
                    text: this.hropts.text,
                    expanded: this.hropts.preload,
                    loader: new GeoExt.tree.WMSCapabilitiesLoader({
                            url: this.hropts.url,
                            layerOptions: layerOptions,
                            layerParams: layerParams,
                            createNode: function (attr) {
                                attr.checked = attr.leaf ? false : undefined;
                                return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
                            }
                        })
                });
            this.options = {
                root: root,
                listeners: {
                    'checkchange': function (node, checked) {
                        var map = Heron.App.getMap();
                        if (!map) {
                            return;
                        }
                        var layer = node.attributes.layer;
                        if (checked === true) {
                            map.addLayer(layer);
                        } else {
                            map.removeLayer(layer);
                        }
                    }
                }
            };
            Ext.apply(this, this.options);
            Heron.widgets.CapabilitiesTreePanel.superclass.initComponent.call(this);
        }
    });
Ext.reg('hr_capabilitiestreepanel', Heron.widgets.CapabilitiesTreePanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.CoordSearchPanel = Ext.extend(Ext.form.FormPanel, {
        title: __('Go to coordinates'),
        layout: 'form',
        bodyStyle: 'padding:5px',
        fieldLabelX: __('X'),
        fieldLabelY: __('Y'),
        onSearchCompleteZoom: 10,
        iconWidth: 32,
        iconHeight: 32,
        localIconFile: 'redpin.png',
        iconUrl: null,
        projection: null,
        initComponent: function () {
            var self = this;
            this.xLabel = new Ext.form.TextField({
                    fieldLabel: this.fieldLabelX
                });
            this.yLabel = new Ext.form.TextField({
                    fieldLabel: this.fieldLabelY
                });
            this.items = [{
                    layout: 'form',
                    colspan: 2,
                    border: false,
                    items: [self.xLabel]
                }, {
                    layout: 'form',
                    colspan: 2,
                    border: false,
                    items: [self.yLabel]
                }, {
                    layout: 'column',
                    border: false,
                    items: [new Ext.Button({
                                text: __('Go!'),
                                align: 'right',
                                tooltip: __('Pan and zoom to location'),
                                handler: function () {
                                    self.panAndZoom(self);
                                }
                            })]
                }
            ];
            this.keys = [{
                    key: [Ext.EventObject.ENTER],
                    handler: function () {
                        self.panAndZoom(self);
                    }
                }
            ];
            if (!this.iconURL) {
                this.iconUrl = Heron.Utils.getImageLocation(this.localIconFile);
            }
            if (this.projection) {
                this.olProjection = new OpenLayers.Projection(this.projection);
            }
            Heron.widgets.search.CoordSearchPanel.superclass.initComponent.call(this);
        },
        panAndZoom: function (self) {
            if (this.layer) {
                this.layer.clearMarkers();
            }
            var x = self.xLabel.getValue();
            var y = self.yLabel.getValue();
            var zoom = self.onSearchCompleteZoom;
            var map = Heron.App.getMap();
            var position = new OpenLayers.LonLat(x, y);
            if (this.olProjection) {
                position.transform(this.olProjection, map.getProjectionObject());
            }
            map.setCenter(position, zoom);
            if (!this.layer) {
                this.layer = new OpenLayers.Layer.Markers(__('Locations'));
                map.addLayer(this.layer);
                var size = new OpenLayers.Size(this.iconWidth, this.iconHeight);
                var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                this.icon = new OpenLayers.Icon(this.iconUrl, size, offset);
            }
            var marker = new OpenLayers.Marker(position, this.icon);
            this.layer.addMarker(marker);
        }
    });
Ext.reg("hr_coordsearchpanel", Heron.widgets.search.CoordSearchPanel);
Ext.namespace("Heron.widgets.search");
Ext.namespace("Heron.utils");
Heron.widgets.search.FeatureInfoPanel = Ext.extend(Ext.Panel, {
        maxFeatures: 5,
        displayPanels: ['Grid'],
        exportFormats: null,
        infoFormat: 'application/vnd.ogc.gml',
        hover: false,
        drillDown: true,
        layer: "",
        tabPanel: null,
        map: null,
        displayPanel: null,
        lastEvt: null,
        olControl: null,
        tb: null,
        initComponent: function () {
            var self = this;
            Ext.apply(this, {
                    layout: "fit",
                    title: __('Feature Info')
                });
            this.display = this.displayGrid;
            var displayOpts = {
                Grid: {
                    Fun: this.displayGrid,
                    Item: {
                        text: __('Grid'),
                        group: "featInfoGroup",
                        checked: true,
                        checkHandler: function (t) {
                            self.display = self.displayGrid;
                            self.handleGetFeatureInfo();
                        }
                    }
                },
                Tree: {
                    Fun: this.displayTree,
                    Item: {
                        text: __('Tree'),
                        group: "featInfoGroup",
                        checked: false,
                        checkHandler: function (t) {
                            self.display = self.displayTree;
                            self.handleGetFeatureInfo();
                        }
                    }
                },
                XML: {
                    Fun: this.displayXML,
                    Item: {
                        text: __('XML'),
                        group: "featInfoGroup",
                        checked: false,
                        checkHandler: function (t) {
                            self.display = self.displayXML;
                            self.handleGetFeatureInfo();
                        }
                    }
                }
            };
            var displayType;
            if (this.displayPanels.length == 1) {
                displayType = this.displayPanels[0];
                if (displayOpts[displayType]) {
                    this.display = displayOpts[displayType].Fun;
                }
            } else {
                var displayMenuItems = [];
                for (var i = 0; i < this.displayPanels.length; i++) {
                    displayType = this.displayPanels[i];
                    if (displayOpts[displayType]) {
                        displayMenuItems.push(displayOpts[displayType].Item);
                    }
                }
                var displayMenu = new Ext.menu.Menu({
                        id: 'displayMenu',
                        style: {
                            overflow: 'visible'
                        },
                        items: displayMenuItems
                    });
                this.tb = new Ext.Toolbar();
                this.tb.add({
                        text: __('Display'),
                        cls: 'x-btn-text-icon',
                        iconCls: 'icon-table',
                        tooltip: __('Choose a Display Option'),
                        menu: displayMenu
                    });
            }
            if (this.exportFormats && this.exportFormats.length > 0) {
                var exportMenuItems = [];
                for (var j = 0; j < this.exportFormats.length; j++) {
                    var exportFormat = this.exportFormats[j];
                    var item = {
                        text: __('Export') + ' ' + exportFormat,
                        cls: 'x-btn',
                        iconCls: 'icon-table-export',
                        exportFormat: exportFormat,
                        gfiPanel: self,
                        handler: self.exportData
                    };
                    exportMenuItems.push(item);
                }
                var exportMenu = new Ext.menu.Menu({
                        id: 'exportMenu',
                        style: {
                            overflow: 'visible'
                        },
                        items: exportMenuItems
                    });
                if (!this.tb) {
                    this.tb = new Ext.Toolbar();
                }
                this.tb.add('->');
                this.tb.add({
                        text: __('Export'),
                        cls: 'x-btn-text-icon',
                        iconCls: 'icon-table-save',
                        tooltip: __('Choose an Export Format'),
                        menu: exportMenu
                    });
            }
            if (this.tb) {
                Ext.apply(this, {
                        tbar: this.tb
                    });
            }
            Heron.widgets.search.FeatureInfoPanel.superclass.initComponent.call(this);
            this.map = Heron.App.getMap();
            if (!this.olControl) {
                var controls = this.map.getControlsByClass("OpenLayers.Control.WMSGetFeatureInfo");
                if (controls && controls.length > 0) {
                    for (var index = 0; index < controls.length; index++) {
                        if (controls[index].id !== "hr-feature-info-hover") {
                            this.olControl = controls[index];
                            this.olControl.infoFormat = this.infoFormat;
                            this.olControl.maxFeatures = this.maxFeatures;
                            this.olControl.hover = this.hover;
                            this.olControl.drillDown = this.drillDown;
                            break;
                        }
                    }
                }
                if (!this.olControl) {
                    this.olControl = new OpenLayers.Control.WMSGetFeatureInfo({
                            maxFeatures: this.maxFeatures,
                            queryVisible: true,
                            infoFormat: this.infoFormat,
                            hover: this.hover,
                            drillDown: this.drillDown
                        });
                    this.map.addControl(this.olControl);
                }
            }
            this.olControl.events.register("getfeatureinfo", this, this.handleGetFeatureInfo);
            this.olControl.events.register("beforegetfeatureinfo", this, this.handleBeforeGetFeatureInfo);
            for (var index = 0; index < this.map.layers.length; index++) {
                var layer = this.map.layers[index];
                if (layer.protocol) {
                    layer.events.register("click", layer, function (evt) {
                            self.handleVectorFeatureInfo(evt, this, self);
                        });
                }
            }
            this.on("render", function () {
                    this.mask = new Ext.LoadMask(this.body, {
                            msg: __('Loading...')
                        })
                });
        },
        handleBeforeGetFeatureInfo: function (evt) {
            if (evt.object !== this.olControl) {
                return;
            }
            this.olControl.layers = [];
            this.olControl.url = null;
            this.olControl.drillDown = this.drillDown;
            var layer;
            if (this.layer) {
                var layers = this.map.getLayersByName(this.layer);
                if (layers) {
                    layer = layers[0];
                    this.olControl.layers.push(layer);
                }
            }
            if (this.olControl.layers.length == 0) {
                for (var index = 0; index < this.map.layers.length; index++) {
                    layer = this.map.layers[index];
                    if (!layer instanceof OpenLayers.Layer.WMS || !layer.params) {
                        continue;
                    }
                    if (layer.visibility && (layer.featureInfoFormat || layer.params.INFO_FORMAT)) {
                        if (!layer.params.INFO_FORMAT && layer.featureInfoFormat) {
                            layer.params.INFO_FORMAT = layer.featureInfoFormat;
                        }
                        this.olControl.layers.push(layer);
                    }
                }
            }
            this.lastEvt = null;
            this.expand();
            if (this.tabPanel != undefined) {
                this.tabPanel.removeAll();
            }
            if (this.mask) {
                this.mask.show();
            }
            if (this.olControl.layers.length == 0) {
                if (this.mask) {
                    this.mask.hide();
                }
                if (this.displayPanel) {
                    this.remove(this.displayPanel);
                }
                this.displayPanel = this.displayInfo(__('Feature Info unavailable'));
                this.add(this.displayPanel);
                this.displayPanel.doLayout();
            }
        },
        handleGetFeatureInfo: function (evt) {
            if (evt && evt.object !== this.olControl) {
                return;
            }
            if (this.mask) {
                this.mask.hide();
            }
            if (evt) {
                this.lastEvt = evt;
            }
            if (!this.lastEvt) {
                return;
            }
            if (this.displayPanel) {
                this.remove(this.displayPanel);
            }
            this.displayPanel = this.display(this.lastEvt);
            if (this.displayPanel) {
                this.add(this.displayPanel);
                this.displayPanel.doLayout();
            }
            if (this.getLayout() instanceof Object) {
                this.getLayout().runLayout();
            }
        },
        handleVectorFeatureInfo: function (evt, layer, self) {
            var feature = layer.getFeatureFromEvent(evt);
            if (feature) {
                self.handleGetFeatureInfo(evt);
            }
        },
        displayGrid: function (evt) {
            var types = new Array();
            var featureType;
            for (var index = 0; index < evt.features.length; index++) {
                var rec = evt.features[index];
                featureType = null;
                if (rec.gml && rec.gml.featureType) {
                    featureType = rec.gml.featureType;
                }
                if (!featureType && rec.fid && rec.fid.indexOf('undefined') < 0) {
                    featureType = /[^\.]*/.exec(rec.fid);
                    featureType = (featureType[0] != "null") ? featureType[0] : null;
                }
                if (!featureType && rec.attributes['_LAYERID_']) {
                    featureType = rec.attributes['_LAYERID_'];
                }
                if (!featureType && rec.attributes['DINO_DBA.MAP_SDE_GWS_WELL_W_HEADS_VW.DINO_NR']) {
                    featureType = 'TNO_DINO_WELLS';
                }
                if (!featureType && rec.attributes['DINO_DBA.MAP_SDE_BRH_BOREHOLE_RD_VW.DINO_NR']) {
                    featureType = 'TNO_DINO_BOREHOLES';
                }
                if (!featureType && rec.type) {
                    featureType = rec.type;
                }
                if (!featureType) {
                    featureType = __('Unknown');
                }
                var found = false;
                var type = null;
                for (var j = 0; j < types.length; j++) {
                    type = types[j];
                    if (type.featureType == featureType) {
                        found = true;
                    }
                }
                if (!found) {
                    var layerName = featureType;
                    var layers = this.map.layers;
                    for (var l = 0; l < layers.length; l++) {
                        var nextLayer = layers[l];
                        if (!nextLayer.params) {
                            continue;
                        }
                        if (featureType.toLowerCase() == /([^:]*$)/.exec(nextLayer.params.LAYERS)[0].toLowerCase()) {
                            layerName = nextLayer.name;
                        }
                    }
                    type = {
                        featureType: featureType,
                        title: layerName,
                        columns: new Array(),
                        fields: new Array(),
                        records: new Array()
                    };
                    types.push(type);
                }
                var attrName;
                for (attrName in rec.attributes) {
                    var attrValue = rec.attributes[attrName];
                    if (attrValue && attrValue.indexOf("http://") >= 0) {
                        rec.attributes[attrName] = '<a href="' + attrValue + '" target="_new">' + attrValue + '</a>';
                    }
                    if (attrName.indexOf(".") >= 0) {
                        var newAttrName = attrName.replace(/\./g, "_");
                        rec.attributes[newAttrName] = rec.attributes[attrName];
                        if (attrName != newAttrName) {
                            delete rec.attributes[attrName];
                        }
                    }
                }
                if (type.records.length == 0) {
                    for (attrName in rec.attributes) {
                        if (type.records.length == 0) {
                            var column = {
                                header: attrName,
                                width: 100,
                                dataIndex: attrName
                            };
                            if (this.gridCellRenderers) {
                                var gridCellRenderer;
                                for (var k = 0; k < this.gridCellRenderers.length; k++) {
                                    gridCellRenderer = this.gridCellRenderers[k];
                                    if (gridCellRenderer.attrName && attrName == gridCellRenderer.attrName) {
                                        if (gridCellRenderer.featureType && featureType == gridCellRenderer.featureType || !gridCellRenderer.featureType) {
                                            column.options = gridCellRenderer.renderer.options;
                                            column.renderer = gridCellRenderer.renderer.fn;
                                        }
                                    }
                                }
                            }
                            type.columns.push(column);
                            type.fields.push(attrName);
                        }
                    }
                }
                type.records.push(rec.attributes);
            }
            if (this.tabPanel != null) {
                this.remove(this.tabPanel);
                this.tabPanel = null;
            }
            while (types.length > 0) {
                type = types.pop();
                if (type.records.length > 0) {
                    var store = new Ext.data.JsonStore({
                            autoDestroy: true,
                            fields: type.fields,
                            data: type.records
                        });
                    var grid = new Ext.grid.GridPanel({
                            store: store,
                            title: type.title,
                            featureType: type.featureType,
                            colModel: new Ext.grid.ColumnModel({
                                    defaults: {
                                        width: 120,
                                        sortable: true
                                    },
                                    columns: type.columns,
                                    autoScroll: true,
                                    listeners: {
                                        "render": function (c) {
                                            c.doLayout();
                                        }
                                    }
                                })
                        });
                    if (this.tabPanel == null) {
                        this.tabPanel = new Ext.TabPanel({
                                border: false,
                                autoDestroy: true,
                                enableTabScroll: true,
                                items: [grid],
                                activeTab: 0
                            });
                    } else {
                        this.tabPanel.add(grid);
                        this.tabPanel.setActiveTab(0);
                    }
                }
            }
            return this.tabPanel;
        },
        displayTree: function (evt) {
            var panel = new Heron.widgets.XMLTreePanel();
            panel.xmlTreeFromText(panel, evt.text);
            return panel;
        },
        displayXML: function (evt) {
            var opts = {
                html: '<div class="hr-html-panel-body"><pre>' + Heron.Utils.formatXml(evt.text, true) + '</pre></div>',
                preventBodyReset: true,
                autoScroll: true
            };
            return new Ext.Panel(opts);
        },
        displayInfo: function (infoStr) {
            var opts = {
                html: '<div class="hr-html-panel-body"><pre>' + infoStr + '</pre></div>',
                preventBodyReset: true,
                autoScroll: true
            };
            return new Ext.Panel(opts);
        },
        exportData: function (evt) {
            var self = evt.gfiPanel;
            if (!self.tabPanel || !self.tabPanel.activeTab) {
                alert(__('No features available or non-grid display chosen'));
                return;
            }
            var featureType = self.tabPanel.activeTab.featureType;
            var store = self.tabPanel.activeTab.store;
            var exportConfig = {
                CSV: {
                    formatter: 'CSVFormatter',
                    fileName: featureType + '.csv',
                    mimeType: 'text/csv'
                },
                XLS: {
                    formatter: 'ExcelFormatter',
                    fileName: featureType + '.xls',
                    mimeType: 'application/vnd.ms-excel'
                }
            };
            var config = exportConfig[evt.exportFormat];
            if (!config) {
                alert(__('Invalid export format configured: ' + evt.exportFormat));
                return;
            }
            var data = Heron.data.DataExporter.formatStore(store, config, true);
            Heron.data.DataExporter.download(data, config)
        }
    });
Ext.reg('hr_featureinfopanel', Heron.widgets.search.FeatureInfoPanel);
Ext.namespace("Heron.widgets.search");
Ext.namespace("Heron.utils");
Heron.widgets.search.FeatureInfoPopup = Ext.extend(GeoExt.Popup, {
        title: __('FeatureInfo popup'),
        layout: 'fit',
        resizable: true,
        width: 320,
        height: 200,
        anchorPosition: "auto",
        panIn: false,
        draggable: true,
        unpinnable: false,
        maximizable: false,
        collapsible: false,
        closeAction: 'hide',
        olControl: null,
        anchored: true,
        hideonmove: false,
        layer: "",
        initComponent: function () {
            this.map = Heron.App.getMap();
            if (this.hideonmove) {
                this.anchorPosition = "bottom-left";
            }
            Heron.widgets.search.FeatureInfoPopup.superclass.initComponent.call(this);
            var self = this;
            var controlProps = {
                hover: false,
                drillDown: true,
                maxFeatures: 5,
                queryVisible: true,
                infoFormat: 'application/vnd.ogc.gml'
            };
            controlProps = Ext.apply(controlProps, this.controlDefaults);
            if (!this.olControl) {
                var controls = this.map.getControlsByClass("OpenLayers.Control.WMSGetFeatureInfo");
                if (controls && controls.length > 0) {
                    for (var index = 0; index < controls.length; index++) {
                        this.olControl = controls[index];
                        this.olControl.infoFormat = controlProps.infoFormat;
                        this.olControl.maxFeatures = controlProps.maxFeatures;
                        break;
                    }
                }
                if (!this.olControl) {
                    this.olControl = new OpenLayers.Control.WMSGetFeatureInfo({
                            maxFeatures: controlProps.maxFeatures,
                            queryVisible: true,
                            hover: controlProps.hover,
                            infoFormat: controlProps.infoFormat
                        });
                    this.map.addControl(this.olControl);
                }
            }
            this.olControl.events.register("getfeatureinfo", this, this.handleGetFeatureInfo);
            this.olControl.events.register("beforegetfeatureinfo", this, this.handleBeforeGetFeatureInfo);
            if (this.hideonmove) {
                if (this.olControl.handler) {
                    if (this.olControl.handler.callbacks.move) {
                        this.olControl.handler.callbacks.move = function () {
                            self.olControl.cancelHover();
                            self.hide();
                        }
                    }
                }
            }
            var fiPanel = [{
                    xtype: 'hr_featureinfopanel',
                    title: null,
                    header: false,
                    border: false,
                    displayPanels: ['Grid'],
                    exportFormats: [],
                    maxFeatures: controlProps.maxFeatures,
                    hover: controlProps.hover,
                    drillDown: controlProps.drillDown,
                    infoFormat: controlProps.infoFormat,
                    layer: this.layer,
                    olControl: this.olControl
                }
            ];
            fiPanel[0] = Ext.apply(fiPanel[0], this.featureinfopanelProps);
            this.add(fiPanel);
        },
        handleBeforeGetFeatureInfo: function (evt) {
            if (evt.object !== this.olControl) {
                this.hide();
            }
        },
        handleGetFeatureInfo: function (evt) {
            if (evt.object !== this.olControl) {
                return;
            }
            if (!evt.features || evt.features.length == 0) {
                this.hide();
                return;
            }
            this.location = this.map.getLonLatFromPixel(evt.xy);
            this.show();
        },
        deactivate: function () {
            this.hide();
        }
    });
Ext.reg('hr_featureinfopopup', Heron.widgets.search.FeatureInfoPopup);
Ext.namespace("Heron.widgets");
Heron.widgets.XMLTreePanel = Ext.extend(Ext.tree.TreePanel, {
        initComponent: function () {
            Ext.apply(this, {
                    autoScroll: true,
                    rootVisible: false,
                    root: this.root ? this.root : {
                        nodeType: 'async',
                        text: 'Ext JS',
                        draggable: false,
                        id: 'source'
                    }
                });
            Heron.widgets.XMLTreePanel.superclass.initComponent.apply(this, arguments);
        },
        xmlTreeFromUrl: function (url) {
            var self = this;
            Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    params: null,
                    success: function (result, request) {
                        self.xmlTreeFromDoc(self, result.responseXML);
                    },
                    failure: function (result, request) {
                        alert('error in ajax request');
                    }
                });
        },
        xmlTreeFromText: function (self, text) {
            var doc = new OpenLayers.Format.XML().read(text);
            self.xmlTreeFromDoc(self, doc);
            return doc;
        },
        xmlTreeFromDoc: function (self, doc) {
            self.setRootNode(self.treeNodeFromXml(self, doc.documentElement || doc));
        },
        treeNodeFromXml: function (self, XmlEl) {
            var t = ((XmlEl.nodeType == 3) ? XmlEl.nodeValue : XmlEl.tagName);
            if (t.replace(/\s/g, '').length == 0) {
                return null;
            }
            var result = new Ext.tree.TreeNode({
                    text: t
                });
            var xmlns = 'xmlns',
                xsi = 'xsi';
            if (XmlEl.nodeType == 1) {
                Ext.each(XmlEl.attributes, function (a) {
                        var nodeName = a.nodeName;
                        if (!(XmlEl.parentNode.nodeType == 9 && (nodeName.substring(0, xmlns.length) === xmlns || nodeName.substring(0, xsi.length) === xsi))) {
                            var c = new Ext.tree.TreeNode({
                                    text: a.nodeName
                                });
                            c.appendChild(new Ext.tree.TreeNode({
                                        text: a.nodeValue
                                    }));
                            result.appendChild(c);
                        }
                    });
                Ext.each(XmlEl.childNodes, function (el) {
                        if ((el.nodeType == 1) || (el.nodeType == 3)) {
                            var c = self.treeNodeFromXml(self, el);
                            if (c) {
                                result.appendChild(c);
                            }
                        }
                    });
            }
            return result;
        }
    });
Ext.reg('hr_xmltreepanel', Heron.widgets.XMLTreePanel);
Ext.namespace("Heron.widgets");
Heron.widgets.HTMLPanel = Ext.extend(Ext.Panel, {
        initComponent: function () {
            Heron.widgets.HTMLPanel.superclass.initComponent.call(this);
            this.addListener('render', function () {
                    this.loadMask = new Ext.LoadMask(this.body, {
                            msg: __('Loading...')
                        })
                });
        }
    });
Ext.reg('hr_htmlpanel', Heron.widgets.HTMLPanel);
Ext.namespace("Heron.widgets");
Heron.widgets.Bookmarks = (function () {
        var contexts = undefined;
        var map = undefined;
        var bookmarksPanel = undefined;
        var instance = {
            init: function (hroptions) {},
            setMapContext: function (contextid, id) {
                var elmm = Ext.getCmp(contextid);
                contexts = elmm.hropts;
                if (contexts) {
                    var map = Heron.App.getMap();
                    for (var i = 0; i < contexts.length; i++) {
                        if (contexts[i].id == id) {
                            if (contexts[i].x && contexts[i].y && contexts[i].zoom) {
                                map.setCenter(new OpenLayers.LonLat(contexts[i].x, contexts[i].y), contexts[i].zoom, false, true);
                            } else if (contexts[i].x && contexts[i].y && !contexts[i].zoom) {
                                map.setCenter(new OpenLayers.LonLat(contexts[i].x, contexts[i].y), map.getZoom(), false, true);
                            } else if (!(contexts[i].x && contexts[i].y) && contexts[i].zoom) {
                                map.setCenter(new OpenLayers.LonLat(map.center.lon, map.center.lat), contexts[i].zoom, false, true);
                            }
                            if (contexts[i].layers) {
                                var mapLayers = map.layers;
                                var ctxLayers = contexts[i].layers;
                                var ctxName = contexts[i].name;
                                if ((ctxLayers.length) || (!ctxLayers.length && ctxName.length)) {
                                    if (!contexts[i].addLayers) {
                                        for (var n = 0; n < mapLayers.length; n++) {
                                            if (mapLayers[n].getVisibility()) {
                                                if (!mapLayers[n].isBaseLayer) {
                                                    mapLayers[n].setVisibility(false);
                                                }
                                            }
                                        }
                                    }
                                    for (var m = 0; m < ctxLayers.length; m++) {
                                        for (n = 0; n < mapLayers.length; n++) {
                                            if (mapLayers[n].name == ctxLayers[m]) {
                                                if (mapLayers[n].isBaseLayer) {
                                                    map.setBaseLayer(mapLayers[n]);
                                                }
                                                mapLayers[n].setVisibility(true);
                                            }
                                        }
                                    }
                                    if (map.baseLayer) {
                                        map.setBaseLayer(map.baseLayer);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            removeBookmark: function (contextid, id) {
                var elmm = Ext.getCmp(contextid);
                elmm.removeBookmark(id);
            },
            setBookmarksPanel: function (abookmarksPanel) {
                bookmarksPanel = abookmarksPanel;
            },
            getBookmarksPanel: function () {
                return bookmarksPanel;
            }
        };
        return (instance);
    })();
Heron.widgets.BookmarksPanel = Ext.extend(Heron.widgets.HTMLPanel, {
        autoScroll: true,
        bodyStyle: {
            overflow: 'auto'
        },
        initComponent: function () {
            this.version = 1;
            Heron.widgets.BookmarksPanel.superclass.initComponent.call(this);
            if (!this.title) {
                this.title = __('Bookmarks');
            }
            if (!this.bookmarkTerm) {
                this.bookmarkTerm = __('bookmark');
            }
            var contexts = undefined;
            var localStorageBookmarks = this.getlocalStorageBookmarks();
            if (localStorageBookmarks) {
                contexts = this.hropts.concat(localStorageBookmarks);
            } else {
                contexts = this.hropts;
            }
            this.hropts = contexts;
            Heron.widgets.Bookmarks.init(contexts);
            Heron.widgets.Bookmarks.setBookmarksPanel(this);
            this.createAddBookmarkWindow();
            this.addListener("afterrender", this.afterrender);
        },
        afterrender: function () {
            this.updateHtml(this.getHtml());
        },
        getHtml: function () {
            var firstProjectContext = true;
            var firstUserContext = true;
            var htmllines = '<div class="hr-html-panel-body">';
            var divMargin = '3px 5px 3px 0px';
            var divToolMargin = '2px 0px 2px 0px';
            var your = __("Your");
            var remove = __("Remove");
            var removeTooltip = "";
            var divWidth = 210;
            if (this.el !== undefined) {
                divWidth = this.getInnerWidth() - 50;
            }
            var contexts = this.hropts;
            if (typeof (contexts) !== "undefined") {
                for (var i = 0; i < contexts.length; i++) {
                    if (contexts[i].id.substr(0, 11) == "hr_bookmark") {
                        if (firstUserContext) {
                            htmllines += '<div style="clear: left;"><br></div>';
                            htmllines += '<hr>';
                            htmllines += '<div class="hr-legend-panel-header" style="margin-top: 5px;">' + your + ' ' + this.title.toLowerCase() + '</div>';
                            firstUserContext = false;
                            removeTooltip = remove + " " + this.bookmarkTerm;
                        }
                        if (this.isValidBookmark(contexts[i])) {
                            htmllines += '<div style="margin: ' + divMargin + '; float: left; width: ' + divWidth + 'px;"><a href="#" id="' + contexts[i].id + '"title="' + contexts[i].desc + '" onclick="Heron.widgets.Bookmarks.setMapContext(\'' + this.id + "','" + contexts[i].id + '\'); return false;">' + contexts[i].name + '</a></div>';
                        } else {
                            htmllines += '<div style="margin: ' + divMargin + '; float: left; width: ' + divWidth + 'px;"><a href="#" id="' + contexts[i].id + '"title="' + contexts[i].desc + '" onclick="Heron.widgets.Bookmarks.setMapContext(\'' + this.id + "','" + contexts[i].id + '\'); return false;" style="color: gray">' + contexts[i].name + '</a></div>';
                        }
                        htmllines += '<div class="x-tool x-tool-close" title="' + removeTooltip + ' \'' + contexts[i].name + '\'" style="margin: ' + divToolMargin + '; float: left; width:15px;" onclick="Heron.widgets.Bookmarks.removeBookmark(\'' + this.id + "','" + contexts[i].id + '\')">&nbsp;</div>';
                    } else {
                        if (firstProjectContext) {
                            htmllines += '<div class="hr-legend-panel-header">Project ' + this.title.toLowerCase() + '</div>';
                            firstProjectContext = false;
                        }
                        htmllines += '<div style="margin: ' + divMargin + '; float: left; width:100%;"><a href="#" id="' + contexts[i].id + '"title="' + contexts[i].desc + '" onclick="Heron.widgets.Bookmarks.setMapContext(\'' + this.id + "','" + contexts[i].id + '\'); return false;">' + contexts[i].name + '</a></div>';
                    }
                }
            }
            htmllines += '</div>';
            return htmllines
        },
        updateHtml: function () {
            this.update(this.getHtml());
        },
        onAddBookmark: function () {
            if (this.supportsHtml5Storage()) {
                this.AddBookmarkWindow.show();
            } else {
                alert(__('Your browser does not support local storage for user-defined bookmarks'));
            }
        },
        addBookmark: function () {
            var strBookmarkMaxNr = localStorage.getItem("hr_bookmarkMax");
            if (strBookmarkMaxNr) {
                var bookmarkmaxNr = Number(strBookmarkMaxNr);
                if (bookmarkmaxNr !== NaN) {
                    bookmarkmaxNr += 1;
                } else {
                    bookmarkmaxNr = 1;
                }
            } else {
                bookmarkmaxNr = 1;
            }
            this.scId = 'hr_bookmark' + bookmarkmaxNr;
            this.scName = this.edName.getValue();
            this.scDesc = this.edDesc.getValue();
            if (!this.scName || this.scName.length == 0) {
                Ext.Msg.alert(__('Warning'), __('Bookmark name cannot be empty'));
                return false;
            }
            this.getMapContent();
            var newbookmark = {
                id: this.scId,
                version: this.version,
                type: 'bookmark',
                name: this.scName,
                desc: this.scDesc,
                layers: this.scvisibleLayers,
                x: this.scX,
                y: this.scY,
                zoom: this.scZoom,
                units: this.scUnits,
                projection: this.scProjection
            };
            var newbookmarkJSON = Ext.encode(newbookmark);
            localStorage.setItem(this.scId, newbookmarkJSON);
            localStorage.setItem("hr_bookmarkMax", bookmarkmaxNr);
            this.hropts.push(newbookmark);
            this.updateHtml();
            return true;
        },
        removeBookmark: function (id) {
            localStorage.removeItem(id);
            var strBookmarkMaxNr = localStorage.getItem("hr_bookmarkMax")
            var bookmarkmaxNr = Number(strBookmarkMaxNr)
            if (bookmarkmaxNr == Number(id.substr(4))) {
                bookmarkmaxNr -= 1
                localStorage.setItem("hr_bookmarkMax", bookmarkmaxNr)
            }
            var contexts = this.hropts;
            var newcontexts = new Array();
            for (var i = 0; i < contexts.length; i++) {
                if (contexts[i].id !== id) {
                    newcontexts.push(contexts[i]);
                }
            }
            this.hropts = newcontexts;
            this.updateHtml();
        },
        getlocalStorageBookmarks: function () {
            if (!this.supportsHtml5Storage()) {
                return null;
            }
            var bookmarkmaxNr = localStorage.getItem("hr_bookmarkMax");
            if (bookmarkmaxNr) {
                var bookmarks = new Array();
                for (var index = 1; index <= bookmarkmaxNr; index++) {
                    var bookmarkJSON = localStorage.getItem("hr_bookmark" + index);
                    if (bookmarkJSON) {
                        try {
                            var bookmark = Ext.decode(bookmarkJSON)
                            bookmarks.push(bookmark);
                        } catch (err) {}
                    }
                }
                return bookmarks;
            }
            return null;
        },
        isValidBookmark: function (context) {
            var map = Heron.App.getMap();
            if (context.layers) {
                var mapLayers = map.layers;
                var ctxLayers = context.layers;
                for (var m = 0; m < ctxLayers.length; m++) {
                    var layerPresent = false;
                    for (var n = 0; n < mapLayers.length; n++) {
                        if (mapLayers[n].name == ctxLayers[m]) {
                            layerPresent = true;
                            break;
                        }
                    }
                    if (!layerPresent) {
                        return false;
                    }
                }
            }
            if (context.projection !== map.projection) {
                return false;
            }
            if (context.units !== map.units) {
                return false;
            }
            var maxExtent = map.maxExtent;
            if (context.x < maxExtent.left && context.x > maxExtent.right) {
                return false;
            }
            if (context.y < maxExtent.bottom && context.y > maxExtent.top) {
                return false;
            }
            if (context.zoom > map.numZoomLevels) {
                return false;
            }
            return true;
        },
        getMapContent: function () {
            var map = Heron.App.getMap();
            var mapCenter = map.getCenter();
            this.scUnits = map.units;
            this.scProjection = map.projection;
            this.scX = mapCenter.lon;
            this.scY = mapCenter.lat;
            this.scZoom = map.getZoom();
            var mapLayers = map.layers;
            this.scvisibleLayers = new Array();
            for (var n = 0; n < mapLayers.length; n++) {
                if (mapLayers[n].getVisibility()) {
                    this.scvisibleLayers.push(mapLayers[n].name);
                }
            }
        },
        createAddBookmarkWindow: function () {
            var labelWidth = 65;
            var fieldWidth = 300;
            var formPanel = new Ext.form.FormPanel({
                    title: "",
                    baseCls: 'x-plain',
                    autoHeight: true,
                    defaultType: "textfield",
                    labelWidth: labelWidth,
                    anchor: "100%",
                    items: [{
                            id: "ed_name",
                            fieldLabel: __("Name"),
                            displayField: "Name",
                            width: fieldWidth,
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function (textfield, ev) {
                                    this.onNameKeyUp(textfield, ev);
                                },
                                scope: this
                            }
                        }, {
                            id: "ed_desc",
                            fieldLabel: __("Description"),
                            displayField: "Decription",
                            width: fieldWidth
                        }
                    ]
                });
            this.AddBookmarkWindow = new Ext.Window({
                    title: __("Add a bookmark"),
                    width: 400,
                    autoHeight: true,
                    plain: true,
                    statefull: true,
                    stateId: "ZoomToWindow",
                    bodyStyle: "padding: 5px;",
                    buttonAlign: "center",
                    resizable: false,
                    closeAction: "hide",
                    items: [formPanel],
                    listeners: {
                        show: function () {
                            this.onShowWindow();
                        },
                        scope: this
                    },
                    buttons: [{
                            id: "btn_add",
                            text: "Add",
                            disabled: true,
                            handler: function () {
                                if (this.addBookmark()) {
                                    this.AddBookmarkWindow.hide();
                                }
                            },
                            scope: this
                        }, {
                            name: "btn_cancel",
                            text: "Cancel",
                            handler: function () {
                                this.AddBookmarkWindow.hide();
                            },
                            scope: this
                        }
                    ]
                });
            this.edName = Ext.getCmp("ed_name");
            this.edDesc = Ext.getCmp("ed_desc");
            this.btnAdd = Ext.getCmp("btn_add");
        },
        onNameKeyUp: function (textfield, ev) {
            var value = this.edName.getValue();
            if (value && OpenLayers.String.trim(value).length > 0) {
                this.btnAdd.enable();
            } else {
                this.btnAdd.disable();
            }
        },
        onShowWindow: function () {
            this.edName.setValue('');
            this.edDesc.setValue('');
            this.edName.focus(false, 200);
        },
        supportsHtml5Storage: function () {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }
    });
Ext.reg('hr_bookmarkspanel', Heron.widgets.BookmarksPanel);
Ext.reg('hr_contextbrowserpanel', Heron.widgets.BookmarksPanel);

// LayerTreePanel (Original)
Ext.namespace("Heron.widgets");
Heron.widgets.LayerTreePanel = Ext.extend(Ext.tree.TreePanel, {
        title: __('Layers'),
        textbaselayers: __('Base Layers'),
        textoverlays: __('Overlays'),
        lines: false,
        layerResolutions: {},
        appliedResolution: 0.0,
        autoScroll: true,
        initComponent: function () {
            var treeConfig;
            if (this.hropts && this.hropts.tree) {
                treeConfig = this.hropts.tree;
            } else {
                treeConfig = [{
                        nodeType: "gx_overlaylayercontainer",
                        text: this.textoverlays,
                        expanded: true
                    }, {
                        nodeType: "gx_baselayercontainer",
                        text: this.textbaselayers,
                        expanded: true
                    }
                ]
            }
            treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
            var layerTree = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                containerScroll: true,
                loader: new Ext.tree.TreeLoader({
                        applyLoader: false,
                        uiProviders: {
                            "layerNodeUI": GeoExt.tree.LayerNodeUI
                        }
                    }),
                root: {
                    nodeType: "async",
                    children: Ext.decode(treeConfig)
                },
                rootVisible: false,
                enableDD: true,
                lines: this.lines
            };
            Ext.apply(this, options);
            Heron.widgets.LayerTreePanel.superclass.initComponent.call(this);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("expandnode", this.onExpandNode);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onExpandNode: function (node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.leaf) {
                    this.setNodeEnabling(child, Heron.App.getMap());
                }
            }
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            self.applyMapMoveEnd();
            map.events.register('moveend', null, function (evt) {
                    self.applyMapMoveEnd();
                });
        },
        applyMapMoveEnd: function () {
            var map = Heron.App.getMap();
            if (map) {
                if (map.resolution != this.appliedResolution) {
                    this.setNodeEnabling(this.getRootNode(), map);
                    this.appliedResolution = map.resolution;
                }
            }
        },
        setNodeEnabling: function (rootNode, map) {
            rootNode.cascade(function (node) {
                    var layer = node.layer;
                    if (!layer) {
                        return;
                    }
                    var layerMinResolution = layer.minResolution ? layer.minResolution : map.resolutions[map.resolutions.length - 1];
                    var layerMaxResolution = layer.maxResolution ? layer.maxResolution : map.resolutions[0];
                    node.enable();
                    if (map.resolution < layerMinResolution || map.resolution > layerMaxResolution) {
                        node.disable();
                    }
                });
        }
    });
Ext.reg('hr_layertreepanel', Heron.widgets.LayerTreePanel);

// gist edit LayerTreeChh
Ext.namespace("Heron.widgets");
Heron.widgets.LayerTreeChh = Ext.extend(Ext.tree.TreePanel, {
        title: __('Layers'),
        textbaselayers: __('Base Layers'),
        textoverlays: __('Overlays'),
        lines: false,
        layerResolutions: {},
        appliedResolution: 0.0,
        autoScroll: true,
        initComponent: function () {
            var treeConfig;
            if (this.hropts && this.hropts.tree) {
                treeConfig = this.hropts.tree;
            } else {
                treeConfig = [{
                        nodeType: "gx_overlaylayercontainer",
                        text: this.textoverlays,
                        expanded: true
                    }/* , {
                        nodeType: "gx_baselayercontainer",
                        text: this.textbaselayers,
                        expanded: true
                    } */
                ]
            }
            treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
            var layerTree = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                containerScroll: true,
                loader: new Ext.tree.TreeLoader({
                        applyLoader: false,
                        uiProviders: {
                            "layerNodeUI": GeoExt.tree.LayerNodeUI
                        }
                    }),
                root: {
                    nodeType: "async",
                    children: Ext.decode(treeConfig)
                },
                rootVisible: false,
                enableDD: true,
                lines: this.lines
            };
            Ext.apply(this, options);
            Heron.widgets.LayerTreePanel.superclass.initComponent.call(this);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("expandnode", this.onExpandNode);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onExpandNode: function (node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.leaf) {
                    this.setNodeEnabling(child, Heron.App.getMap());
                }
            }
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            self.applyMapMoveEnd();
            map.events.register('moveend', null, function (evt) {
                    self.applyMapMoveEnd();
                });
        },
        applyMapMoveEnd: function () {
            var map = Heron.App.getMap();
            if (map) {
                if (map.resolution != this.appliedResolution) {
                    this.setNodeEnabling(this.getRootNode(), map);
                    this.appliedResolution = map.resolution;
                }
            }
        },
        setNodeEnabling: function (rootNode, map) {
            rootNode.cascade(function (node) {
                    var layer = node.layer;
                    if (!layer) {
                        return;
                    }
                    var layerMinResolution = layer.minResolution ? layer.minResolution : map.resolutions[map.resolutions.length - 1];
                    var layerMaxResolution = layer.maxResolution ? layer.maxResolution : map.resolutions[0];
                    node.enable();
                    if (map.resolution < layerMinResolution || map.resolution > layerMaxResolution) {
                        node.disable();
                    }
                });
        }
    });
Ext.reg('hr_layertreeChh', Heron.widgets.LayerTreeChh);

// gist edit LayerTreePara
Ext.namespace("Heron.widgets");
Heron.widgets.LayerTreePara = Ext.extend(Ext.tree.TreePanel, {
        title: __('Layers'),
        textbaselayers: __('Base Layers'),
        textoverlays: __('Overlays'),
        lines: false,
        layerResolutions: {},
        appliedResolution: 0.0,
        autoScroll: true,
        initComponent: function () {
            var treeConfig;
            if (this.hropts && this.hropts.tree) {
                treeConfig = this.hropts.tree;
            } else {
                treeConfig = [{
                        nodeType: "gx_overlaylayercontainer",
                        text: this.textoverlays,
                        expanded: true
                    }/* , {
                        nodeType: "gx_baselayercontainer",
                        text: this.textbaselayers,
                        expanded: true
                    } */
                ]
            }
            treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
            var layerTree = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                containerScroll: true,
                loader: new Ext.tree.TreeLoader({
                        applyLoader: false,
                        uiProviders: {
                            "layerNodeUI": GeoExt.tree.LayerNodeUI
                        }
                    }),
                root: {
                    nodeType: "async",
                    children: Ext.decode(treeConfig)
                },
                rootVisible: false,
                enableDD: true,
                lines: this.lines
            };
            Ext.apply(this, options);
            Heron.widgets.LayerTreePanel.superclass.initComponent.call(this);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("expandnode", this.onExpandNode);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onExpandNode: function (node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.leaf) {
                    this.setNodeEnabling(child, Heron.App.getMap());
                }
            }
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            self.applyMapMoveEnd();
            map.events.register('moveend', null, function (evt) {
                    self.applyMapMoveEnd();
                });
        },
        applyMapMoveEnd: function () {
            var map = Heron.App.getMap();
            if (map) {
                if (map.resolution != this.appliedResolution) {
                    this.setNodeEnabling(this.getRootNode(), map);
                    this.appliedResolution = map.resolution;
                }
            }
        },
        setNodeEnabling: function (rootNode, map) {
            rootNode.cascade(function (node) {
                    var layer = node.layer;
                    if (!layer) {
                        return;
                    }
                    var layerMinResolution = layer.minResolution ? layer.minResolution : map.resolutions[map.resolutions.length - 1];
                    var layerMaxResolution = layer.maxResolution ? layer.maxResolution : map.resolutions[0];
                    node.enable();
                    if (map.resolution < layerMinResolution || map.resolution > layerMaxResolution) {
                        node.disable();
                    }
                });
        }
    });
Ext.reg('hr_layertreePara', Heron.widgets.LayerTreePara);

// gist edit LayerTreeBase
Ext.namespace("Heron.widgets");
Heron.widgets.LayerTreeBase = Ext.extend(Ext.tree.TreePanel, {
        title: __('Layers'),
        textbaselayers: __('Base Layers'),
        textoverlays: __('Overlays'),
        lines: false,
        layerResolutions: {},
        appliedResolution: 0.0,
        autoScroll: true,
        initComponent: function () {
            var treeConfig;
            if (this.hropts && this.hropts.tree) {
                treeConfig = this.hropts.tree;
            } else {
                treeConfig = [//{
                        //nodeType: "gx_overlaylayercontainer",
                        //text: this.textoverlays,
                        //expanded: true},
                     {
                        nodeType: "gx_baselayercontainer",
                        text: this.textbaselayers,
                        expanded: true
                    }
                ]
            }
            treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
            var layerTree = this;
            var options = {
                border: true,
                title: this.title,
                autoScroll: true,
                containerScroll: true,
                loader: new Ext.tree.TreeLoader({
                        applyLoader: false,
                        uiProviders: {
                            "layerNodeUI": GeoExt.tree.LayerNodeUI
                        }
                    }),
                root: {
                    nodeType: "async",
                    children: Ext.decode(treeConfig)
                },
                rootVisible: false,
                enableDD: true,
                lines: this.lines
            };
            Ext.apply(this, options);
            Heron.widgets.LayerTreePanel.superclass.initComponent.call(this);
            this.addListener("beforedblclick", this.onBeforeDblClick);
            this.addListener("afterrender", this.onAfterRender);
            this.addListener("expandnode", this.onExpandNode);
        },
        onBeforeDblClick: function (node, evt) {
            return false;
        },
        onExpandNode: function (node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.leaf) {
                    this.setNodeEnabling(child, Heron.App.getMap());
                }
            }
        },
        onAfterRender: function () {
            var self = this;
            var map = Heron.App.getMap();
            self.applyMapMoveEnd();
            map.events.register('moveend', null, function (evt) {
                    self.applyMapMoveEnd();
                });
        },
        applyMapMoveEnd: function () {
            var map = Heron.App.getMap();
            if (map) {
                if (map.resolution != this.appliedResolution) {
                    this.setNodeEnabling(this.getRootNode(), map);
                    this.appliedResolution = map.resolution;
                }
            }
        },
        setNodeEnabling: function (rootNode, map) {
            rootNode.cascade(function (node) {
                    var layer = node.layer;
                    if (!layer) {
                        return;
                    }
                    var layerMinResolution = layer.minResolution ? layer.minResolution : map.resolutions[map.resolutions.length - 1];
                    var layerMaxResolution = layer.maxResolution ? layer.maxResolution : map.resolutions[0];
                    node.enable();
                    if (map.resolution < layerMinResolution || map.resolution > layerMaxResolution) {
                        node.disable();
                    }
                });
        }
    });
Ext.reg('hr_layertreeBase', Heron.widgets.LayerTreeBase);


Ext.namespace("Heron.widgets");
Heron.widgets.LayerCombo = Ext.extend(Ext.form.ComboBox, {
        map: null,
        store: null,
        width: 'auto',
        listWidth: 'auto',
        emptyText: __('Choose a Layer'),
        tooltip: __('Choose a Layer'),
        sortOrder: 'ASC',
        selectFirst: false,
        hideTrigger: false,
        layerFilter: function (map) {
            return map.layers;
        },
        displayField: 'name',
        forceSelection: true,
        triggerAction: 'all',
        mode: 'local',
        editable: false,
        initComponent: function () {
            Heron.widgets.LayerCombo.superclass.initComponent.apply(this, arguments);
            if (!this.map) {
                this.map = Heron.App.getMap();
            }
            this.addEvents({
                    'selectlayer': true
                });
            this.store = this.createLayerStore(this.layerFilter(this.map));
            this.displayField = this.store.fields.keys[1];
            if (this.selectFirst) {
                var record = this.store.getAt(0);
                if (record) {
                    this.selectedLayer = record.getLayer();
                    this.value = record.get('title');
                }
            }
            if (this.initialValue) {
                this.setValue(this.initialValue);
            }
            this.on('select', function (combo, record, idx) {
                    this.selectedLayer = record.getLayer(idx);
                    this.fireEvent('selectlayer', this.selectedLayer);
                }, this);
        },
        createLayerStore: function (layers) {
            return new GeoExt.data.LayerStore({
                    layers: layers,
                    sortInfo: this.sortOrder ? {
                        field: 'title',
                        direction: this.sortOrder
                    } : null
                });
        },
        setLayers: function (layers) {
            var store = this.createLayerStore(layers);
            this.bindStore(store, false);
        },
        listeners: {
            render: function (c) {
                c.el.set({
                        qtip: this.tooltip
                    });
                c.trigger.set({
                        qtip: this.tooltip
                    });
            }
        }
    });
Ext.reg('hr_layercombo', Heron.widgets.LayerCombo);
Ext.namespace("Heron.widgets");
Heron.widgets.BaseLayerCombo = Ext.extend(Heron.widgets.LayerCombo, {
        map: null,
        store: null,
        width: 140,
        listWidth: 140,
        emptyText: __('Choose a Base Layer'),
        tooltip: __('BaseMaps'),
        zoom: 8,
        layerFilter: function (map) {
            return map.getLayersBy('isBaseLayer', true);
        },
        hideTrigger: false,
        displayField: 'name',
        forceSelection: true,
        triggerAction: 'all',
        mode: 'local',
        initComponent: function () {
            if (this.initialConfig.map !== null && this.initialConfig.map instanceof OpenLayers.Map && this.initialConfig.map.allOverlays === false) {
                this.map = this.initialConfig.map;
                this.on('selectlayer', function (layer) {
                        this.map.setBaseLayer(layer);
                    }, this);
                this.map.events.register('changebaselayer', this, function (obj) {
                        this.setValue(obj.layer.name);
                    });
                this.initialValue = this.map.baseLayer.name;
            }
            Heron.widgets.BaseLayerCombo.superclass.initComponent.apply(this, arguments);
        }
    });
Ext.reg('hr_baselayer_combobox', Heron.widgets.BaseLayerCombo);
Ext.namespace("Heron.widgets");
Heron.widgets.LayerLegendPanel = Ext.extend(GeoExt.LegendPanel, {
        title: __('Legend'),
        bodyStyle: 'padding:5px',
        autoScroll: true,
        defaults: {
            useScaleParameter: false,
            baseParams: {}
        },
        dynamic: true,
        initComponent: function () {
            if (this.hropts) {
                this.prefetchLegends = this.hropts.prefetchLegends;
            }
            Heron.widgets.LayerLegendPanel.superclass.initComponent.call(this);
        },
        onRender: function () {
            Heron.widgets.LayerLegendPanel.superclass.onRender.apply(this, arguments);
            this.layerStore.addListener("update", this.onUpdateLayerStore, this);
        },
        onUpdateLayerStore: function (store, record, index) {
            this.addLegend(record, index);
        },
        addLegend: function (record, index) {
            record.store = this.layerStore;
            var layer = record.getLayer();
            if (layer.noLegend) {
                layer.hideInLegend = true;
            }
            if (layer.hideInLegend && !record.get('hideInLegend')) {
                record.set('hideInLegend', true);
            }
            var legend = undefined;
            if (this.items) {
                legend = this.getComponent(this.getIdForLayer(layer));
            }
            if ((this.prefetchLegends && !legend) || (((layer.map && layer.visibility) || layer.getVisibility()) && !legend && !layer.hideInLegend)) {
                Heron.widgets.LayerLegendPanel.superclass.addLegend.apply(this, arguments);
                this.doLayout();
            }
            this.doLayout();
        },
        onListenerDoLayout: function (node) {
            node.doLayout();
        },
        listeners: {
            activate: function (node) {
                this.onListenerDoLayout(this);
            },
            expand: function (node) {
                this.onListenerDoLayout(this);
            }
        }
    });
Ext.reg('hr_layerlegendpanel', Heron.widgets.LayerLegendPanel);
OpenLayers.Control.LoadingPanel = OpenLayers.Class(OpenLayers.Control, {
        counter: 0,
        maximized: false,
        visible: true,
        initialize: function (options) {
            OpenLayers.Control.prototype.initialize.apply(this, [options]);
        },
        setVisible: function (visible) {
            this.visible = visible;
            if (visible) {
                OpenLayers.Element.show(this.div);
            } else {
                OpenLayers.Element.hide(this.div);
            }
        },
        getVisible: function () {
            return this.visible;
        },
        hide: function () {
            this.setVisible(false);
        },
        show: function () {
            this.setVisible(true);
        },
        toggle: function () {
            this.setVisible(!this.getVisible());
        },
        addLayer: function (evt) {
            if (evt.layer) {
                evt.layer.events.register('loadstart', this, this.increaseCounter);
                evt.layer.events.register('loadend', this, this.decreaseCounter);
            }
        },
        removeLayer: function (evt) {
            if (evt.layer) {
                evt.layer.events.unregister('loadstart', this, this.increaseCounter);
                evt.layer.events.unregister('loadend', this, this.decreaseCounter);
            }
        },
        getWaitText: function () {
            return __("Waiting for") + ' ' + this.counter + ' ' + (this.counter <= 1 ? __('service') : __('services'));
        },
        setMap: function (map) {
            OpenLayers.Control.prototype.setMap.apply(this, arguments);
            this.map.events.register('preaddlayer', this, this.addLayer);
            this.map.events.register('removelayer', this, this.removeLayer);
            for (var i = 0; i < this.map.layers.length; i++) {
                var layer = this.map.layers[i];
                layer.events.register('loadstart', this, this.increaseCounter);
                layer.events.register('loadend', this, this.decreaseCounter);
            }
        },
        increaseCounter: function () {
            this.counter++;
            if (this.counter > 0) {
                this.div.innerHTML = this.getWaitText();
                if (!this.maximized && this.visible) {
                    this.maximizeControl();
                }
            }
        },
        decreaseCounter: function () {
            if (this.counter > 0) {
                this.div.innerHTML = this.getWaitText();
                this.counter--;
            }
            if (this.counter == 0) {
                if (this.maximized && this.visible) {
                    this.minimizeControl();
                }
            }
        },
        draw: function () {
            OpenLayers.Control.prototype.draw.apply(this, arguments);
            return this.div;
        },
        minimizeControl: function (evt) {
            this.div.style.display = "none";
            this.maximized = false;
            if (evt != null) {
                OpenLayers.Event.stop(evt);
            }
        },
        maximizeControl: function (evt) {
            this.div.style.display = "block";
            this.maximized = true;
            if (evt != null) {
                OpenLayers.Event.stop(evt);
            }
        },
        destroy: function () {
            if (this.map) {
                this.map.events.unregister('preaddlayer', this, this.addLayer);
                if (this.map.layers) {
                    for (var i = 0; i < this.map.layers.length; i++) {
                        var layer = this.map.layers[i];
                        layer.events.unregister('loadstart', this, this.increaseCounter);
                        layer.events.unregister('loadend', this, this.decreaseCounter);
                    }
                }
            }
            OpenLayers.Control.prototype.destroy.apply(this, arguments);
        },
        CLASS_NAME: "OpenLayers.Control.LoadingPanel"
    });
Ext.namespace("Heron.widgets");
Heron.widgets.MapPanelOptsDefaults = {
    center: '0,0',
    map: {
        units: 'degrees',
        maxExtent: '-180,-90,180,90',
        extent: '-180,-90,180,90',
        maxResolution: 0.703125,
        numZoomLevels: 20,
        zoom: 1,
        allOverlays: false,
        fractionalZoom: false,
        permalinks: {
            paramPrefix: 'map',
            encodeType: false,
            prettyLayerNames: true
        },
        controls: [new OpenLayers.Control.Attribution(), new OpenLayers.Control.ZoomBox(), new OpenLayers.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }), new OpenLayers.Control.LoadingPanel(), new OpenLayers.Control.PanPanel(), new OpenLayers.Control.ZoomPanel()]
    }
};
Heron.widgets.MapPanel = Ext.extend(GeoExt.MapPanel, {
        initComponent: function () {
            var gxMapPanelOptions = {
                id: "gx-map-panel",
                split: false,
                layers: this.hropts.layers,
                items: this.items ? this.items : [{
                        xtype: "gx_zoomslider",
                        vertical: true,
                        height: 150,
                        x: 18,
                        y: 85,
                        plugins: new GeoExt.ZoomSliderTip({
                                template: __("Scale") + ": 1 : {scale}<br>" + __("Resolution") + ": {resolution}<br>" + __("Zoom") + ": {zoom}"
                            })
                    }
                ],
                bbar: {
                    items: [{
                            id: 'map-panel-epsg',
                            text: "",
                            width: 80,
                            xtype: "tbtext"
                        }, {
                            xtype: 'tbseparator'
                        }, {
                            id: 'x-coord',
                            text: "X:",
                            width: 80,
                            xtype: "tbtext"
                        }, {
                            id: 'y-coord',
                            text: "Y:",
                            width: 80,
                            xtype: "tbtext"
                        }, {
                            xtype: 'tbseparator'
                        }, {
                            id: 'bbar_measure',
                            text: "",
                            xtype: "tbtext"
                        }
                    ]
                },
                tbar: new Ext.Toolbar({
                        enableOverflow: true,
                        items: []
                    })
            };
            if (this.hropts.hasOwnProperty('bbar')) {
                if (!this.hropts.bbar) {
                    gxMapPanelOptions.bbar = null
                } else if (typeof this.hropts.bbar == "object") {
                    Ext.apply(gxMapPanelOptions.bbar, this.hropts.bbar);
                }
            }
            Ext.apply(gxMapPanelOptions, Heron.widgets.MapPanelOptsDefaults);
            if (this.hropts.settings) {
                Ext.apply(gxMapPanelOptions.map, this.hropts.settings);
            }
            if (typeof gxMapPanelOptions.map.maxExtent == "string") {
                gxMapPanelOptions.map.maxExtent = OpenLayers.Bounds.fromString(gxMapPanelOptions.map.maxExtent);
                gxMapPanelOptions.maxExtent = gxMapPanelOptions.map.maxExtent;
            }
            if (typeof gxMapPanelOptions.map.extent == "string") {
                gxMapPanelOptions.map.extent = OpenLayers.Bounds.fromString(gxMapPanelOptions.map.extent);
                gxMapPanelOptions.extent = gxMapPanelOptions.map.extent;
            }
            if (!gxMapPanelOptions.map.center) {
                gxMapPanelOptions.map.center = OpenLayers.LonLat.fromString('0,0');
            } else if (typeof gxMapPanelOptions.map.center == "string") {
                gxMapPanelOptions.map.center = OpenLayers.LonLat.fromString(gxMapPanelOptions.map.center);
            }
            gxMapPanelOptions.center = gxMapPanelOptions.map.center;
            if (gxMapPanelOptions.map.zoom) {
                gxMapPanelOptions.zoom = gxMapPanelOptions.map.zoom;
            }
            if (gxMapPanelOptions.map.controls) {
                gxMapPanelOptions.controls = gxMapPanelOptions.map.controls;
            }
            gxMapPanelOptions.map.layers = this.hropts.layers;
            Ext.apply(this, gxMapPanelOptions);
            if (this.map.permalinks) {
                this.prettyStateKeys = this.map.permalinks.prettyLayerNames;
                this.stateId = this.map.permalinks.paramPrefix;
                this.permalinkProvider = new GeoExt.state.PermalinkProvider({
                        encodeType: this.map.permalinks.encodeType
                    });
                Ext.state.Manager.setProvider(this.permalinkProvider);
            }
            Heron.widgets.MapPanel.superclass.initComponent.call(this);
            if (this.hropts.settings && this.hropts.settings.formatX) {
                this.formatX = this.hropts.settings.formatX;
            }
            if (this.hropts.settings && this.hropts.settings.formatY) {
                this.formatY = this.hropts.settings.formatY;
            }
            Heron.App.setMap(this.getMap());
            Heron.App.setMapPanel(this);
            Heron.widgets.ToolbarBuilder.build(this, this.hropts.toolbar);
        },
        formatX: function (lon, precision) {
            return "X: " + lon.toFixed(precision);
        },
        formatY: function (lat, precision) {
            return "Y: " + lat.toFixed(precision);
        },
        getPermalink: function () {
            return this.permalinkProvider.getLink();
        },
        getMap: function () {
            return this.map;
        },
        afterRender: function () {
            Heron.widgets.MapPanel.superclass.afterRender.apply(this, arguments);
            var xy_precision = 3;
            if (this.hropts && this.hropts.settings && this.hropts.settings.hasOwnProperty('xy_precision')) {
                xy_precision = this.hropts.settings.xy_precision;
            }
            var formatX = this.formatX;
            var formatY = this.formatY;
            var onMouseMove = function (e) {
                var lonLat = this.getLonLatFromPixel(e.xy);
                if (!lonLat) {
                    return;
                }
                if (this.displayProjection) {
                    lonLat.transform(this.getProjectionObject(), this.displayProjection);
                }
                var xcoord = Ext.getCmp("x-coord");
                if (xcoord) {
                    xcoord.setText(formatX(lonLat.lon, xy_precision));
                }
                var ycoord = Ext.getCmp("y-coord");
                if (ycoord) {
                    ycoord.setText(formatY(lonLat.lat, xy_precision));
                }
            };
            var map = this.getMap();
            map.events.register("mousemove", map, onMouseMove);
            var epsgTxt = map.getProjection();
            if (epsgTxt) {
                var epsg = Ext.getCmp("map-panel-epsg");
                if (epsg) {
                    epsg.setText(epsgTxt);
                }
            }
        }
    });
Ext.reg('hr_mappanel', Heron.widgets.MapPanel);
Ext.namespace("Heron.widgets");
Heron.widgets.MenuHandler = (function () {
        var options = null;

        function getContainer() {
            return Ext.getCmp(options.pageContainer);
        }

        function loadPage(page) {
            var container = Ext.getCmp(options.pageContainer);
            if (page && container && options.pageRoot) {
                container.load(options.pageRoot + '/' + page + '.html?t=' + new Date().getMilliseconds());
            }
        }

        function loadURL(url) {
            var container = Ext.getCmp(options.pageContainer);
            if (url && container) {
                container.load({
                        url: url,
                        nocache: true,
                        scripts: true
                    });
            }
        }

        function setActiveCard(card) {
            if (card && options.cardContainer) {
                Ext.getCmp(options.cardContainer).getLayout().setActiveItem(card);
            }
        }
        var instance = {
            init: function (hroptions) {
                if (hroptions && !options) {
                    options = hroptions;
                    setActiveCard(options.defaultCard);
                    loadPage(options.defaultPage);
                }
            },
            onSelect: function (item) {
                setActiveCard(item.card);
                if (item.page) {
                    loadPage(item.page);
                } else if (item.url) {
                    loadURL(item.url)
                }
            },
            onLinkSelect: function (card, page) {
                if (card) {
                    setActiveCard(card);
                }
                if (page) {
                    loadPage(page);
                }
            }
        };
        return (instance);
    })();
Heron.widgets.MenuPanel = Ext.extend(Ext.Panel, {
        initComponent: function () {
            this.addListener('afterrender', function () {
                    if (this.hropts) {
                        Heron.widgets.MenuHandler.init(this.hropts);
                    }
                });
            Heron.widgets.MenuPanel.superclass.initComponent.apply(this, arguments);
        }
    });
Ext.reg('hr_menupanel', Heron.widgets.MenuPanel);
Ext.namespace("Heron.widgets");
Heron.widgets.MultiLayerNode = Ext.extend(GeoExt.tree.LayerNode, {
        layerNames: [],
        layers: [],
        constructor: function (config) {
            if (config.layers) {
                this.layerNames = config.layers.split(",");
                if (this.layerNames[0]) {
                    arguments[0].layer = this.layerNames[0];
                }
            }
            for (var i = 0; i < this.layerNames.length; i++) {
                if (!this.layerStore || this.layerStore == "auto") {
                    this.layerStore = GeoExt.MapPanel.guess().layers;
                }
                var j = this.layerStore.findBy(function (o) {
                        return o.get("title") == this.layerNames[i];
                    }, this);
                if (j != -1) {
                    this.layers[i] = this.layerStore.getAt(j).getLayer();
                }
            }
            Heron.widgets.MultiLayerNode.superclass.constructor.apply(this, arguments);
        },
        render: function (bulkRender) {
            this.layer = this.layers[0];
            Heron.widgets.MultiLayerNode.superclass.render.apply(this, arguments);
        },
        onLayerVisibilityChanged: function () {
            this.layer = this.layers[0];
            Heron.widgets.MultiLayerNode.superclass.onLayerVisibilityChanged.apply(this, arguments);
        },
        onCheckChange: function (node, checked) {
            for (var i = 0; i < this.layers.length; i++) {
                this.layer = this.layers[i];
                Heron.widgets.MultiLayerNode.superclass.onCheckChange.apply(this, arguments);
            }
        },
        onStoreAdd: function (store, records, index) {
            for (var i = 0; i < this.layers.length; i++) {
                this.layer = this.layers[i];
                Heron.widgets.MultiLayerNode.superclass.onStoreAdd.apply(this, arguments);
            }
        },
        onStoreRemove: function (store, record, index) {
            for (var i = 0; i < this.layers.length; i++) {
                this.layer = this.layers[i];
                Heron.widgets.MultiLayerNode.superclass.onStoreRemove.apply(this, arguments);
            }
        },
        onStoreUpdate: function (store, record, operation) {
            for (var i = 0; i < this.layers.length; i++) {
                this.layer = this.layers[i];
                Heron.widgets.MultiLayerNode.superclass.onStoreUpdate.apply(this, arguments);
            }
        },
        destroy: function () {
            for (var i = 0; i < this.layers.length; i++) {
                this.layer = this.layers[i];
                Heron.widgets.MultiLayerNode.superclass.destroy.apply(this, arguments);
            }
        }
    });
Ext.tree.TreePanel.nodeTypes.hr_multilayer = Heron.widgets.MultiLayerNode;
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.OpenLSSearchCombo = Ext.extend(Ext.form.ComboBox, {
        map: null,
        width: 240,
        listWidth: 400,
        loadingText: __('Searching...'),
        emptyText: __('Search with OpenLS'),
        zoom: 8,
        minChars: 4,
        queryDelay: 200,
        maxRows: '10',
        url: 'http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?',
        hideTrigger: true,
        displayField: 'text',
        forceSelection: false,
        autoSelect: false,
        queryParam: 'zoekterm',
        initComponent: function () {
            Heron.widgets.search.OpenLSSearchCombo.superclass.initComponent.apply(this, arguments);
            this.store = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                            url: this.url,
                            method: 'GET'
                        }),
                    fields: [{
                            name: "lon",
                            type: "number"
                        }, {
                            name: "lat",
                            type: "number"
                        }, "text"
                    ],
                    reader: new Heron.data.OpenLS_XLSReader()
                });
            if (this.zoom > 0) {
                this.on("select", function (combo, record, index) {
                        this.setValue(record.data.text);
                        var position = new OpenLayers.LonLat(record.data.lon, record.data.lat);
                        position.transform(new OpenLayers.Projection("EPSG:28992"), this.map.getProjectionObject());
                        this.map.setCenter(position, this.zoom);
                        this.collapse();
                    }, this);
            }
        }
    });
Ext.reg('hr_openlssearchcombo', Heron.widgets.search.OpenLSSearchCombo);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.NominatimSearchCombo = Ext.extend(Ext.form.ComboBox, {
        map: null,
        width: 240,
        listWidth: 400,
        loadingText: __('Searching...'),
        emptyText: __('Search Nominatim'),
        zoom: 8,
        minChars: 4,
        queryDelay: 50,
        maxRows: '10',
        url: 'http://open.mapquestapi.com/nominatim/v1/search?format=json',
        lang: 'en',
        charset: 'UTF8',
        hideTrigger: true,
        displayField: 'display_name',
        forceSelection: true,
        queryParam: 'q',
        initComponent: function () {
            Heron.widgets.search.NominatimSearchCombo.superclass.initComponent.apply(this, arguments);
            this.store = new Ext.data.JsonStore({
                    proxy: new Ext.data.HttpProxy({
                            url: this.url,
                            method: 'GET'
                        }),
                    idProperty: 'place_id',
                    successProperty: null,
                    totalProperty: null,
                    fields: ["place_id", "display_name", {
                            name: "lat",
                            type: "number"
                        }, {
                            name: "lon",
                            type: "number"
                        }
                    ]
                });
            if (this.zoom > 0) {
                this.on("select", function (combo, record, index) {
                        this.setValue(record.data.display_name);
                        var position = new OpenLayers.LonLat(record.data.lon, record.data.lat);
                        position.transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
                        this.map.setCenter(position, this.zoom);
                        this.collapse();
                    }, this);
            }
        }
    });
Ext.reg('hr_nominatimsearchcombo', Heron.widgets.search.NominatimSearchCombo);
Ext.namespace("Heron.widgets");
Heron.widgets.PrintPreviewWindow = Ext.extend(Ext.Window, {
        title: __('Print Preview'),
        printCapabilities: null,
        modal: true,
        border: false,
        resizable: false,
        width: 400,
        autoHeight: true,
        layout: 'fit',
        method: 'POST',
        showTitle: true,
        mapTitle: null,
        mapTitleYAML: "mapTitle",
        showComment: true,
        mapComment: null,
        mapCommentYAML: "mapComment",
        showFooter: true,
        mapFooter: null,
        mapFooterYAML: "mapFooter",
        showRotation: true,
        showLegend: true,
        mapLegend: null,
        showLegendChecked: false,
        mapLimitScales: true,
        excludeLayers: ['OpenLayers.Handler.Polygon', 'OpenLayers.Handler.RegularPolygon', 'OpenLayers.Handler.Path', 'OpenLayers.Handler.Point'],
        legendDefaults: {
            useScaleParameter: true,
            baseParams: {
                FORMAT: "image/png"
            }
        },
        initComponent: function () {
            if (this.hropts) {
                Ext.apply(this, this.hropts);
            }
            if (!this.url) {
                alert(__('No print provider url property passed in hropts.'));
                return;
            }
            var busyMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: __('Loading print data...')
                });
            busyMask.show();
            var self = this;
            Ext.Ajax.request({
                    url: this.url + '/info.json',
                    method: 'GET',
                    params: null,
                    success: function (result, request) {
                        self.printCapabilities = Ext.decode(result.responseText);
                        self.addItems();
                        busyMask.hide();
                    },
                    failure: function (result, request) {
                        busyMask.hide();
                        alert(__('Error getting Print options from server: ') + this.url);
                    }
                });
            Heron.widgets.PrintPreviewWindow.superclass.initComponent.call(this);
        },
        addItems: function () {
            var legendPanel = new Heron.widgets.LayerLegendPanel({
                    renderTo: document.body,
                    hidden: true,
                    defaults: this.legendDefaults
                });
            var self = this;
            var item = new GeoExt.ux.PrintPreview({
                    autoHeight: true,
                    printMapPanel: {
                        limitScales: this.mapLimitScales,
                        map: {
                            controls: [new OpenLayers.Control.Navigation({
                                        zoomBoxEnabled: false,
                                        zoomWheelEnabled: (this.showRotation) ? true : false
                                    }), new OpenLayers.Control.PanPanel()]
                        }
                    },
                    printProvider: {
                        method: this.method,
                        capabilities: this.printCapabilities,
                        listeners: {
                            "print": function () {
                                self.close();
                            },
                            "printexception": function (printProvider, result) {
                                alert(__('Error from Print server: ') + result.statusText);
                            },
                            "beforeencodelayer": function (printProvider, layer) {
                                for (var i = 0; i < self.excludeLayers.length; i++) {
                                    if (layer.name == self.excludeLayers[i]) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                    },
                    sourceMap: this.mapPanel,
                    showTitle: this.showTitle,
                    mapTitle: this.mapTitle,
                    mapTitleYAML: this.mapTitleYAML,
                    showComment: this.showComment,
                    mapComment: this.mapComment,
                    mapCommentYAML: this.mapCommentYAML,
                    showFooter: this.showFooter,
                    mapFooter: this.mapFooter,
                    mapFooterYAML: this.mapFooterYAML,
                    showRotation: this.showRotation,
                    showLegend: this.showLegend,
                    mapLegend: (this.showLegend) ? legendPanel : null,
                    showLegendChecked: this.showLegendChecked
                });
            if (this.showRotation) {
                var ctrlPanel = new OpenLayers.Control.Zoom();
                item.printMapPanel.map.addControl(ctrlPanel);
            }
            this.add(item);
            this.doLayout();
            this.show();
            this.center();
        },
        listeners: {
            show: function (node) {}
        }
    });
Ext.reg('hr_printpreviewwindow', Heron.widgets.PrintPreviewWindow);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.FeatureGridPanel = Ext.extend(Ext.grid.GridPanel, {
        downloadable: true,
        exportFormats: ['CSV', 'XLS', 'GMLv2', 'GeoJSON', 'WellKnownText'],
        columnCapitalize: true,
        loadMask: true,
        exportConfigs: {
            CSV: {
                formatter: 'CSVFormatter',
                fileExt: '.csv',
                mimeType: 'text/csv'
            },
            XLS: {
                formatter: 'ExcelFormatter',
                fileExt: '.xls',
                mimeType: 'application/vnd.ms-excel'
            },
            GMLv2: {
                formatter: 'OpenLayersFormatter',
                format: new OpenLayers.Format.GML.v2({
                        featureType: 'heronfeat',
                        featureNS: 'http://heron-mc.org'
                    }),
                fileExt: '.gml',
                mimeType: 'text/xml'
            },
            GeoJSON: {
                formatter: 'OpenLayersFormatter',
                format: 'OpenLayers.Format.GeoJSON',
                fileExt: '.json',
                mimeType: 'text/plain'
            },
            WellKnownText: {
                formatter: 'OpenLayersFormatter',
                format: 'OpenLayers.Format.WKT',
                fileExt: '.wkt',
                mimeType: 'text/plain'
            }
        },
        separateSelectionLayer: false,
        zoomOnFeatureSelect: false,
        zoomOnRowDoubleClick: true,
        zoomLevelPointSelect: 10,
        zoomLevelPoint: 10,
        zoomToDataExtent: false,
        autoConfig: true,
        vectorLayerOptions: {
            noLegend: true,
            displayInLayerSwitcher: false
        },
        initComponent: function () {
            if (this.columns) {
                this.autoConfig = false;
            }
            var layer = this.layer = new OpenLayers.Layer.Vector(this.title, this.vectorLayerOptions);
            this.map = Heron.App.getMap();
            this.map.addLayer(this.layer);
            Ext.apply(this, this.hropts);
            var self = this;
            if (this.zoomOnFeatureSelect) {
                layer.events.on({
                        "featureselected": function (e) {
                            self.zoomToFeature(self, e.feature.geometry);
                        },
                        "dblclick": function (e) {
                            self.zoomToFeature(self, e.feature.geometry);
                        },
                        "scope": layer
                    });
            }
            this.setupStore(this.features);
            if (!this.sm) {
                this.sm = new GeoExt.grid.FeatureSelectionModel();
            }
            if (this.zoomOnRowDoubleClick) {
                this.on('celldblclick', function (grid, rowIndex, columnIndex, e) {
                        var record = grid.getStore().getAt(rowIndex);
                        var feature = record.getFeature();
                        self.zoomToFeature(self, feature.geometry);
                    });
            }
            if (this.separateSelectionLayer) {
                this.selLayer = new OpenLayers.Layer.Vector(this.title + '_Sel', {
                        noLegend: true,
                        displayInLayerSwitcher: false
                    });
                this.selLayer.styleMap.styles['default'] = layer.styleMap.styles['select'];
                this.selLayer.style = this.selLayer.styleMap.styles['default'].defaultStyle;
                layer.styleMap.styles['select'] = layer.styleMap.styles['default'].clone();
                layer.styleMap.styles['select'].defaultStyle.fillColor = 'white';
                layer.styleMap.styles['select'].defaultStyle.fillOpacity = 0.0;
                this.map.addLayer(this.selLayer);
                this.map.setLayerIndex(this.selLayer, this.map.layers.length - 1);
                this.layer.events.on({
                        featureselected: this.updateSelectionLayer,
                        featureunselected: this.updateSelectionLayer,
                        scope: this
                    });
            }
            var tbarItems = [this.tbarText = new Ext.Toolbar.TextItem({
                        text: __('Init')
                    })];
            tbarItems.push('->');
            if (this.downloadable) {
                var downloadMenuItems = [];
                for (var j = 0; j < this.exportFormats.length; j++) {
                    var exportFormat = this.exportFormats[j];
                    var item = {
                        text: __('as') + ' ' + exportFormat,
                        cls: 'x-btn',
                        iconCls: 'icon-table-export',
                        exportFormat: exportFormat,
                        self: self,
                        handler: self.exportData
                    };
                    downloadMenuItems.push(item);
                }
                if (this.downloadInfo && this.downloadInfo.downloadFormats) {
                    var downloadFormats = this.downloadInfo.downloadFormats;
                    for (var k = 0; k < downloadFormats.length; k++) {
                        var downloadFormat = downloadFormats[k];
                        var item = {
                            text: __('as') + ' ' + downloadFormat.name,
                            cls: 'x-btn',
                            iconCls: 'icon-table-export',
                            downloadFormat: downloadFormat.outputFormat,
                            fileExt: downloadFormat.fileExt,
                            self: self,
                            handler: self.downloadData
                        };
                        downloadMenuItems.push(item);
                    }
                }
                tbarItems.push({
                        text: __('Download'),
                        cls: 'x-btn-text-icon',
                        iconCls: 'icon-table-save',
                        tooltip: __('Choose a Download Format'),
                        menu: new Ext.menu.Menu({
                                style: {
                                    overflow: 'visible'
                                },
                                items: downloadMenuItems
                            })
                    });
            }
            tbarItems.push('->');
            tbarItems.push({
                    text: __('Clear'),
                    cls: 'x-btn-text-icon',
                    iconCls: 'icon-table-clear',
                    tooltip: __('Remove all results'),
                    handler: function () {
                        self.removeFeatures();
                    }
                });
            this.tbar = new Ext.Toolbar({
                    enableOverflow: true,
                    items: tbarItems
                });
            Heron.widgets.search.FeatureGridPanel.superclass.initComponent.call(this);
            this.addListener("afterrender", this.onPanelRendered, this);
            this.addListener("show", this.onPanelShow, this);
            this.addListener("hide", this.onPanelHide, this);
        },
        loadFeatures: function (features, featureType) {
            this.removeFeatures();
            this.featureType = featureType;
            if (!features || features.length == 0) {
                return;
            }
            this.showLayer();
            this.store.loadData(features);
            this.updateTbarText();
            if (this.zoomToDataExtent) {
                if (features.length == 1 && features[0].geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                    var point = features[0].geometry.getCentroid();
                    this.map.setCenter(new OpenLayers.LonLat(point.x, point.y), this.zoomLevelPoint);
                } else {
                    this.map.zoomToExtent(this.layer.getDataExtent());
                }
            }
        },
        removeFeatures: function () {
            if (this.store) {
                this.store.removeAll(false);
            }
            if (this.selLayer) {
                this.selLayer.removeAllFeatures({
                        silent: true
                    });
            }
            this.updateTbarText();
        },
        showLayer: function () {
            if (this.layer) {
                if (this.selLayer) {
                    this.map.setLayerIndex(this.selLayer, this.map.layers.length - 1);
                    this.map.setLayerIndex(this.layer, this.map.layers.length - 2);
                } else {
                    this.map.setLayerIndex(this.layer, this.map.layers.length - 1);
                }
                if (!this.layer.getVisibility()) {
                    this.layer.setVisibility(true);
                }
                if (this.selLayer && !this.selLayer.getVisibility()) {
                    this.selLayer.setVisibility(true);
                }
            }
        },
        hideLayer: function () {
            if (this.layer && this.layer.getVisibility()) {
                this.layer.setVisibility(false);
            }
            if (this.selLayer && this.selLayer.getVisibility()) {
                this.selLayer.setVisibility(false);
            }
        },
        zoomToFeature: function (self, geometry) {
            if (!geometry) {
                return;
            }
            if (geometry.getVertices().length == 1) {
                var point = geometry.getCentroid();
                self.map.setCenter(new OpenLayers.LonLat(point.x, point.y), self.zoomLevelPointSelect);
            } else {
                self.map.zoomToExtent(geometry.getBounds());
            }
        },
        zoomButtonRenderer: function () {
            var id = Ext.id();
            (function () {
                    new Ext.Button({
                            renderTo: id,
                            text: 'Zoom'
                        });
                }).defer(25);
            return (String.format('<div id="{0}"></div>', id));
        },
        setupStore: function (features) {
            if (this.store && !this.autoConfig) {
                return;
            }
            var storeFields = [];
            if (this.autoConfig && features) {
                this.columns = [];
                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var fieldName;
                    for (fieldName in feature.attributes) {
                        var column = {
                            header: this.columnCapitalize ? fieldName.substr(0, 1).toUpperCase() + fieldName.substr(1).toLowerCase() : fieldName,
                            width: 100,
                            dataIndex: fieldName,
                            sortable: true
                        };
                        this.columns.push(column);
                        storeFields.push({
                                name: column.dataIndex
                            });
                    }
                    break;
                }
            } else {
                Ext.each(this.columns, function (column) {
                        if (column.dataIndex) {
                            storeFields.push({
                                    name: column.dataIndex,
                                    type: column.type
                                });
                        }
                        column.sortable = true;
                    });
            }
            var storeConfig = {
                layer: this.layer,
                fields: storeFields
            };
            Ext.apply(storeConfig, this.hropts.storeOpts);
            this.store = new GeoExt.data.FeatureStore(storeConfig);
        },
        updateSelectionLayer: function (evt) {
            this.selLayer.removeAllFeatures({
                    silent: true
                });
            var features = this.layer.selectedFeatures;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i].clone();
                this.selLayer.addFeatures(feature);
            }
        },
        onPanelRendered: function () {
            if (this.ownerCt) {
                this.ownerCt.addListener("parenthide", this.onParentHide, this);
                this.ownerCt.addListener("parentshow", this.onParentShow, this);
            }
        },
        onPanelShow: function () {
            if (this.selModel.selectControl) {
                this.selModel.selectControl.activate();
            }
        },
        onPanelHide: function () {
            if (this.selModel.selectControl) {
                this.selModel.selectControl.deactivate();
            }
        },
        onParentShow: function () {
            this.showLayer();
        },
        onParentHide: function () {
            this.removeFeatures();
            this.hideLayer();
        },
        cleanup: function () {
            this.removeFeatures();
            this.map.removeLayer(this.layer);
            if (this.selLayer) {
                this.map.removeLayer(this.selLayer);
            }
        },
        updateTbarText: function () {
            var objCount = this.store ? this.store.getCount() : 0;
            this.tbarText.setText(objCount + ' ' + (objCount != 1 ? __('Results') : __('Result')));
        },
        exportData: function (evt) {
            var self = evt.self;
            var store = self.store;
            var config = self.exportConfigs[evt.exportFormat];
            if (!config) {
                Ext.Msg.alert(__('Warning'), __('Invalid export format configured: ' + evt.exportFormat));
                return;
            }
            var featureType = self.featureType ? self.featureType : 'heron';
            config.fileName = featureType + config.fileExt;
            config.columns = (store.fields && store.fields.items && store.fields.items.length > 3) ? store.fields.items.slice(3) : null;
            var data = Heron.data.DataExporter.formatStore(store, config, true);
            Heron.data.DataExporter.download(data, config);
        },
        downloadData: function (evt) {
            var self = evt.self;
            var downloadInfo = self.downloadInfo;
            downloadInfo.params.outputFormat = evt.downloadFormat;
            downloadInfo.params.filename = downloadInfo.params.typename + evt.fileExt;
            var paramStr = OpenLayers.Util.getParameterString(downloadInfo.params);
            var url = OpenLayers.Util.urlAppend(downloadInfo.url, paramStr);
            if (url.length > 2048) {
                Ext.Msg.alert(__('Warning'), __('Download URL string too long (max 2048 chars): ') + url.length);
                return;
            }
            Heron.data.DataExporter.directDownload(url);
        }
    });
Ext.reg('hr_featuregridpanel', Heron.widgets.search.FeatureGridPanel);
Ext.reg('hr_featselgridpanel', Heron.widgets.search.FeatureGridPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.SearchCenterPanel = Ext.extend(Ext.Panel, {
        initComponent: function () {
            var self = this;
            Ext.apply(this, {
                    layout: 'card',
                    activeItem: 0,
                    bbar: [{
                            text: __('< Search'),
                            ref: '../prevButton',
                            disabled: true,
                            handler: function () {
                                self.showSearchPanel(self);
                            }
                        }, '->', {
                            text: __('Result >'),
                            ref: '../nextButton',
                            disabled: true,
                            handler: function () {
                                self.showResultGridPanel(self);
                            }
                        }
                    ]
                });
            if (!this.items) {
                this.items = [this.hropts.searchPanel];
            }
            if (this.ownerCt) {
                this.ownerCt.addListener("hide", this.onParentHide, this);
                this.ownerCt.addListener("show", this.onParentShow, this);
                this.addEvents({
                        "parenthide": true,
                        "parentshow": true
                    });
            }
            Heron.widgets.search.SearchCenterPanel.superclass.initComponent.call(this);
            this.addListener("afterrender", this.onRendered, this);
        },
        showSearchPanel: function (self) {
            self.getLayout().setActiveItem(this.searchPanel);
            self.prevButton.disable();
            self.nextButton.enable();
        },
        showResultGridPanel: function (self) {
            self.getLayout().setActiveItem(this.resultPanel);
            self.prevButton.enable();
            self.nextButton.disable();
        },
        onRendered: function () {
            this.searchPanel = this.getComponent(0);
            if (this.searchPanel) {
                this.searchPanel.addListener('searchissued', this.onSearchIssued, this);
                this.searchPanel.addListener('searchsuccess', this.onSearchSuccess, this);
                this.searchPanel.addListener('searchcomplete', this.onSearchComplete, this);
                this.searchPanel.addListener('searchreset', this.onSearchReset, this);
            }
        },
        onSearchIssued: function (searchPanel) {
            this.showSearchPanel(this);
            this.nextButton.disable();
        },
        onSearchComplete: function (searchPanel) {},
        onSearchReset: function (searchPanel) {
            if (this.resultPanel) {
                this.resultPanel.removeFeatures();
            }
        },
        onSearchSuccess: function (searchPanel, result) {
            if (this.hropts.resultPanel.autoConfig && this.resultPanel) {
                this.resultPanel.cleanup();
                this.remove(this.resultPanel);
                this.resultPanel = null;
            }
            var features = result.olResponse.features;
            if (!this.resultPanel) {
                this.hropts.resultPanel.features = features;
                this.hropts.resultPanel.downloadInfo = result.downloadInfo;
                this.resultPanel = new Heron.widgets.search.FeatureGridPanel(this.hropts.resultPanel);
                this.add(this.resultPanel);
            }
            this.resultPanel.loadFeatures(features, searchPanel.getFeatureType());
            if (features && features.length > 0) {
                this.showResultGridPanel(this);
            }
        },
        onParentShow: function () {
            if (this.resultPanel) {
                this.showSearchPanel(this);
            }
            this.fireEvent('parentshow');
        },
        onParentHide: function () {
            this.fireEvent('parenthide');
        }
    });
Ext.reg('hr_searchcenterpanel', Heron.widgets.search.SearchCenterPanel);
Ext.reg('hr_featselsearchpanel', Heron.widgets.search.SearchCenterPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.MultiSearchCenterPanel = Ext.extend(Heron.widgets.search.SearchCenterPanel, {
        config: [],
        initComponent: function () {
            this.config = this.hropts;
            var searchNames = [];
            Ext.each(this.config, function (item) {
                    searchNames.push(item.searchPanel.name ? item.searchPanel.name : __('Undefined (check your config)'));
                });
            this.combo = new Ext.form.ComboBox({
                    store: searchNames,
                    value: searchNames[0],
                    editable: false,
                    typeAhead: false,
                    triggerAction: 'all',
                    emptyText: __('Select a search...'),
                    selectOnFocus: true,
                    width: 250,
                    listeners: {
                        scope: this,
                        'select': this.onSearchSelect
                    }
                });
            this.tbar = [{
                    'text': __('Search') + ': '
                },
                this.combo
            ];
            this.setPanels(this.config[0].searchPanel, this.config[0].resultPanel);
            Heron.widgets.search.MultiSearchCenterPanel.superclass.initComponent.call(this);
        },
        onSearchSelect: function (comboBox) {
            var self = this;
            Ext.each(this.config, function (item) {
                    if (item.searchPanel.name == comboBox.value) {
                        self.switchPanels(item.searchPanel, item.resultPanel);
                    }
                });
            this.showSearchPanel(this);
        },
        onSearchSuccess: function (searchPanel, result) {
            Heron.widgets.search.MultiSearchCenterPanel.superclass.onSearchSuccess.call(this, searchPanel, result);
            this.lastResultFeatures = result.features;
        },
        setPanels: function (searchPanel, resultPanel) {
            if (this.hropts.searchPanel && this.hropts.searchPanel.name === searchPanel.name) {
                return false;
            }
            this.hropts.searchPanel = searchPanel;
            this.hropts.resultPanel = resultPanel;
            return true;
        },
        switchPanels: function (searchPanel, resultPanel) {
            if (!this.setPanels(searchPanel, resultPanel)) {
                return;
            }
            if (this.searchPanel) {
                this.lastSearchName = this.searchPanel.name;
                this.remove(this.searchPanel, true);
            }
            if (this.resultPanel) {
                this.resultPanel.cleanup();
                this.remove(this.resultPanel, true);
                this.resultPanel = null;
            }
            if (this.hropts.searchPanel.hropts && this.hropts.searchPanel.hropts.fromLastResult) {
                this.hropts.searchPanel.hropts.filterFeatures = this.lastResultFeatures;
                this.hropts.searchPanel.hropts.lastSearchName = this.lastSearchName;
            }
            this.searchPanel = Ext.create(this.hropts.searchPanel);
            this.add(this.searchPanel);
            this.searchPanel.show();
            this.getLayout().setActiveItem(this.searchPanel);
            this.onRendered();
        }
    });
Ext.reg('hr_multisearchcenterpanel', Heron.widgets.search.MultiSearchCenterPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.FormSearchPanel = Ext.extend(GeoExt.form.FormPanel, {
        onSearchCompleteZoom: 11,
        autoWildCardAttach: false,
        caseInsensitiveMatch: false,
        logicalOperator: OpenLayers.Filter.Logical.AND,
        layerOpts: undefined,
        statusPanelOpts: {
            html: '&nbsp;',
            height: 132,
            preventBodyReset: true,
            bodyCfg: {
                style: {
                    padding: '6px',
                    border: '0px'
                }
            },
            style: {
                marginTop: '24px',
                paddingTop: '24px',
                fontFamily: 'Verdana, tahoma, Helvetica, sans-serif',
                fontSize: '11px',
                color: '#0000C0'
            }
        },
        progressMessages: [__('Working on it...'), __('Still searching, please be patient...')],
        header: true,
        bodyStyle: 'padding: 6px',
        style: {
            fontFamily: 'Verdana, tahoma, Helvetica, sans-serif',
            fontSize: '12px'
        },
        downloadFormats: [{
                name: 'GML (version 2.1.2)',
                outputFormat: 'text/xml; subtype=gml/2.1.2',
                fileExt: '.gml'
            }
        ],
        defaults: {
            enableKeyEvents: true,
            listeners: {
                specialKey: function (field, el) {
                    if (el.getKey() == Ext.EventObject.ENTER) {
                        var form = this.ownerCt;
                        if (!form && !form.search) {
                            return;
                        }
                        form.action = null;
                        form.search();
                    }
                }
            }
        },
        initComponent: function () {
            this.addEvents({
                    "searchcomplete": true,
                    "searchcanceled": true,
                    "searchfailed": true,
                    "searchsuccess": true
                });
            Ext.apply(this, this.hropts);
            Heron.widgets.search.FormSearchPanel.superclass.initComponent.call(this);
            var items = [this.createStatusPanel(), this.createActionButtons()];
            this.add(items);
            this.addListener("beforeaction", this.onSearchIssued, this);
            this.addListener("searchcanceled", this.onSearchCanceled, this);
            this.addListener("actioncomplete", this.onSearchComplete, this);
            this.addListener("actionfailed", this.onSearchFailed, this);
        },
        createActionButtons: function () {
            this.searchButton = new Ext.Button({
                    text: __('Search'),
                    tooltip: __('Search'),
                    disabled: false,
                    handler: function () {
                        this.search();
                    },
                    scope: this
                });
            this.cancelButton = new Ext.Button({
                    text: 'Cancel',
                    tooltip: __('Cancel ongoing search'),
                    disabled: true,
                    handler: function () {
                        this.fireEvent('searchcanceled', this);
                    },
                    scope: this
                });
            return this.actionButtons = new Ext.ButtonGroup({
                    fieldLabel: null,
                    labelSeparator: '',
                    anchor: "-50",
                    title: null,
                    border: false,
                    bodyBorder: false,
                    items: [this.cancelButton, this.searchButton]
                });
        },
        createStatusPanel: function () {
            return this.statusPanel = new Heron.widgets.HTMLPanel(this.statusPanelOpts);
        },
        updateStatusPanel: function (text) {
            if (!text) {
                text = '&nbsp;';
            }
            if (this.statusPanel.body) {
                this.statusPanel.body.update(text);
            } else {
                this.statusPanel.html = text;
            }
        },
        getFeatureType: function () {
            return this.protocol ? this.protocol.featureType : 'heron';
        },
        onSearchIssued: function (form, action) {
            this.protocol = action.form.protocol;
            this.searchState = "searchissued";
            this.features = null;
            this.updateStatusPanel(__('Searching...'));
            this.cancelButton.enable();
            this.searchButton.disable();
            var self = this;
            var startTime = new Date().getTime() / 1000;
            this.timer = setInterval(function () {
                    if (self.searchState != 'searchissued') {
                        return;
                    }
                    self.updateStatusPanel(Math.floor(new Date().getTime() / 1000 - startTime) + ' ' + __('Seconds') + ' - ' +
                        Heron.Utils.randArrayElm(self.progressMessages));
                }, 4000);
        },
        onSearchFailed: function (form, action) {
            this.searchAbort();
        },
        onSearchCanceled: function (searchPanel) {
            this.searchState = 'searchcanceled';
            this.searchAbort();
            this.updateStatusPanel(__('Search Canceled'));
        },
        onSearchComplete: function (form, action) {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.cancelButton.disable();
            this.searchButton.enable();
            if (this.searchState == 'searchcanceled') {
                this.searchState = null;
                return;
            }
            this.searchState = "searchcomplete";
            var result = {
                olResponse: action.response
            };
            this.fireEvent('searchcomplete', this, result);
            if (action && action.response && action.response.success()) {
                var features = this.features = action.response.features;
                var featureCount = features ? features.length : 0;
                this.updateStatusPanel(__('Search Completed: ') + featureCount + ' ' + (featureCount != 1 ? __('Results') : __('Result')));
                var filter = GeoExt.form.toFilter(action.form, action.options);
                var filterFormat = new OpenLayers.Format.Filter.v1_1_0({
                        srsName: this.protocol.srsName
                    });
                var filterStr = OpenLayers.Format.XML.prototype.write.apply(filterFormat, [filterFormat.write(filter)]);
                result.downloadInfo = {
                    type: 'wfs',
                    url: this.protocol.options.url,
                    downloadFormats: this.downloadFormats,
                    params: {
                        typename: this.protocol.featureType,
                        maxFeatures: this.protocol.maxFeatures,
                        "Content-Disposition": "attachment",
                        filename: this.protocol.featureType,
                        srsName: this.protocol.srsName,
                        service: "WFS",
                        version: "1.1.0",
                        request: "GetFeature",
                        filter: filterStr
                    }
                };
                if (this.onSearchCompleteAction) {
                    var lropts = this.layerOpts;
                    if (lropts) {
                        var map = Heron.App.getMap();
                        for (var l = 0; l < lropts.length; l++) {
                            if (lropts[l]['layerOn']) {
                                var mapLayers = map.getLayersByName(lropts[l]['layerOn']);
                                for (var n = 0; n < mapLayers.length; n++) {
                                    if (mapLayers[n].isBaseLayer) {
                                        map.setBaseLayer(mapLayers[n]);
                                    } else {
                                        mapLayers[n].setVisibility(true);
                                    }
                                    if (lropts[l]['layerOpacity']) {
                                        mapLayers[n].setOpacity(lropts[l]['layerOpacity']);
                                    }
                                }
                            }
                        }
                    }
                    this.onSearchCompleteAction(result);
                }
                this.fireEvent('searchsuccess', this, result);
            } else {
                this.fireEvent('searchfailed', this, action.response);
                this.updateStatusPanel(__('Search Failed') + ' details: ' + action.response.priv.responseText);
            }
        },
        onSearchCompleteAction: function (result) {
            var features = result.olResponse.features;
            if (!features || features.length == 0) {
                return;
            }
            var map = Heron.App.getMap();
            if (features.length == 1 && features[0].geometry.CLASS_NAME == "OpenLayers.Geometry.Point" && this.onSearchCompleteZoom) {
                var point = features[0].geometry.getCentroid();
                map.setCenter(new OpenLayers.LonLat(point.x, point.y), this.onSearchCompleteZoom);
            } else {
                var geometryCollection = new OpenLayers.Geometry.Collection();
                for (var i = 0; i < features.length; i++) {
                    geometryCollection.addComponent(features[i].geometry);
                }
                geometryCollection.calculateBounds();
                map.zoomToExtent(geometryCollection.getBounds());
            }
        },
        search: function () {
            this.action = null;
            Heron.widgets.search.FormSearchPanel.superclass.search.call(this, {
                    wildcard: this.autoWildCardAttach ? GeoExt.form.CONTAINS : -1,
                    matchCase: !this.caseInsensitiveMatch,
                    logicalOp: this.logicalOperator
                });
        },
        searchAbort: function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.protocol) {
                this.protocol.abort(this.response);
            }
            this.protocol = null;
            this.searchButton.enable();
            this.cancelButton.disable();
            this.updateStatusPanel(__('Search aborted'));
        }
    });
Ext.reg('hr_formsearchpanel', Heron.widgets.search.FormSearchPanel);
Ext.reg('hr_searchpanel', Heron.widgets.search.FormSearchPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.SpatialSearchPanel = Ext.extend(Ext.Panel, {
        layout: 'form',
        bodyStyle: 'padding: 24px 12px 12px 12px',
        border: false,
        name: __('Spatial Search'),
        description: '',
        fromLastResult: false,
        lastSearchName: null,
        filterFeatures: null,
        showFilterFeatures: true,
        maxFilterGeometries: 24,
        selectLayerStyle: {
            pointRadius: 10,
            strokeColor: "#dd0000",
            strokeWidth: 1,
            fillOpacity: 0.4,
            fillColor: "#cc0000"
        },
        layerSortOrder: 'ASC',
        layerFilter: function (map) {
            return map.getLayersBy('metadata', {
                    test: function (metadata) {
                        return metadata && metadata.wfs;
                    }
                })
        },
        progressMessages: [__('Working on it...'), __('Still searching, please be patient...'), __('Still searching, have you selected an area with too many objects?')],
        initComponent: function () {
            this.addEvents(this.getEvents());
            Heron.widgets.search.SpatialSearchPanel.superclass.initComponent.call(this);
            this.map = Heron.App.getMap();
            this.addSelectionLayer();
            this.addListener("selectionlayerupdate", this.onSelectionLayerUpdate, this);
            this.addListener("targetlayerselected", this.onTargetLayerSelected, this);
            this.addListener("drawingcomplete", this.onDrawingComplete, this);
            this.addListener("searchissued", this.onSearchIssued, this);
            this.addListener("searchcomplete", this.onSearchComplete, this);
            this.addListener("searchcanceled", this.onSearchCanceled, this);
            this.addListener("beforehide", this.onBeforeHide, this);
            this.addListener("beforeshow", this.onBeforeShow, this);
            this.addListener("beforedestroy", this.onBeforeDestroy, this);
            this.addListener("afterrender", this.onPanelRendered, this);
            if (this.ownerCt) {
                this.ownerCt.addListener("parenthide", this.onParentHide, this);
                this.ownerCt.addListener("parentshow", this.onParentShow, this);
            }
        },
        addSelectionLayer: function () {
            if (this.selectionLayer) {
                return;
            }
            this.selectionLayer = new OpenLayers.Layer.Vector(__('Selection'), {
                    style: this.selectLayerStyle,
                    displayInLayerSwitcher: false,
                    hideInLegend: false,
                    isBaseLayer: false
                });
            this.map.addLayers([this.selectionLayer]);
        },
        getEvents: function () {
            return {
                "drawcontroladded": true,
                "selectionlayerupdate": true,
                "targetlayerselected": true,
                "drawingcomplete": true,
                "searchissued": true,
                "searchcomplete": true,
                "searchcanceled": true,
                "searchfailed": true,
                "searchsuccess": true,
                "searchreset": true
            };
        },
        createStatusPanel: function () {
            var infoText = __('Select the Layer to query') + '<p>' + this.description + '</p>';
            if (this.lastSearchName) {
                infoText += '<p>' + __('Using geometries from the result: ') + '<br/>' + this.lastSearchName;
                if (this.filterFeatures) {
                    infoText += '<br/>' + __('with') + ' ' + this.filterFeatures.length + ' ' + __('features');
                }
                infoText += '</p>';
            }
            this.statusPanel = new Heron.widgets.HTMLPanel({
                    html: infoText,
                    preventBodyReset: true,
                    bodyCfg: {
                        style: {
                            padding: '6px',
                            border: '1px'
                        }
                    },
                    style: {
                        marginTop: '10px',
                        marginBottom: '10px',
                        fontFamily: 'Verdana, tahoma, Helvetica, sans-serif',
                        fontSize: '11px',
                        color: '#0000C0'
                    }
                });
            return this.statusPanel;
        },
        createDrawToolPanel: function (config) {
            var defaultConfig = {
                html: '<div class="olControlEditingToolbar olControlNoSelect">&nbsp;</div>',
                preventBodyReset: true,
                style: {
                    marginTop: '32px',
                    marginBottom: '24px'
                },
                activateControl: true,
                listeners: {
                    afterrender: function (htmlPanel) {
                        var div = htmlPanel.body.dom.firstChild;
                        if (!div) {
                            Ext.Msg.alert('Warning', 'Cannot render draw controls');
                            return;
                        }
                        this.addDrawControls(div);
                        if (this.activateControl) {
                            this.activateDrawControl();
                        }
                    },
                    scope: this
                }
            };
            config = Ext.apply(defaultConfig, config);
            return this.drawToolPanel = new Heron.widgets.HTMLPanel(config);
        },
        addDrawControls: function (div) {
            this.drawControl = new OpenLayers.Control.EditingToolbar(this.selectionLayer, {
                    div: div
                });
            this.drawControl.controls[0].panel_div.title = __('Return to map navigation');
            this.drawControl.controls[1].panel_div.title = __('Draw point');
            this.drawControl.controls[2].panel_div.title = __('Draw line');
            this.drawControl.controls[3].panel_div.title = __('Draw polygon');
            var drawCircleControl = new OpenLayers.Control.DrawFeature(this.selectionLayer, OpenLayers.Handler.RegularPolygon, {
                    title: __('Draw circle (click and drag)'),
                    displayClass: 'olControlDrawCircle',
                    handlerOptions: {
                        citeCompliant: this.drawControl.citeCompliant,
                        sides: 30,
                        irregular: false
                    }
                });
            this.drawControl.addControls([drawCircleControl]);
            var drawRectangleControl = new OpenLayers.Control.DrawFeature(this.selectionLayer, OpenLayers.Handler.RegularPolygon, {
                    displayClass: 'olControlDrawRectangle',
                    title: __('Draw Rectangle (click and drag)'),
                    handlerOptions: {
                        citeCompliant: this.drawControl.citeCompliant,
                        sides: 4,
                        irregular: true
                    }
                });
            this.drawControl.addControls([drawRectangleControl]);
            this.map.addControl(this.drawControl);
            this.activeControl = drawRectangleControl;
            this.fireEvent('drawcontroladded');
        },
        removeDrawControls: function () {
            if (this.drawControl) {
                var self = this;
                Ext.each(this.drawControl.controls, function (control) {
                        self.map.removeControl(control);
                    });
                this.map.removeControl(this.drawControl);
                this.drawControl = null;
            }
        },
        activateDrawControl: function () {
            if (!this.drawControl || this.drawControlActive) {
                return;
            }
            var self = this;
            Ext.each(this.drawControl.controls, function (control) {
                    control.events.register('featureadded', self, self.onFeatureDrawn);
                    control.deactivate();
                    if (self.activeControl && control == self.activeControl) {
                        control.activate();
                    }
                });
            this.drawControlActive = true;
        },
        deactivateDrawControl: function () {
            if (!this.drawControl) {
                return;
            }
            var self = this;
            Ext.each(this.drawControl.controls, function (control) {
                    control.events.unregister('featureadded', self, self.onFeatureDrawn);
                    if (control.active) {
                        self.activeControl = control;
                    }
                    control.deactivate();
                });
            this.updateStatusPanel();
            this.drawControlActive = false;
        },
        onFeatureDrawn: function () {},
        createTargetLayerCombo: function (config) {
            var defaultConfig = {
                xtype: "hr_layercombo",
                fieldLabel: __('Search in'),
                sortOrder: this.layerSortOrder,
                layerFilter: this.layerFilter,
                selectFirst: true,
                listeners: {
                    selectlayer: function (layer) {
                        this.targetLayer = layer;
                        this.fireEvent('targetlayerselected');
                    },
                    scope: this
                }
            };
            config = Ext.apply(defaultConfig, config);
            return this.targetLayerCombo = new Heron.widgets.LayerCombo(config);
        },
        getFeatureType: function () {
            return this.targetLayer ? this.targetLayer.name : 'heron';
        },
        updateStatusPanel: function (text) {
            if (!text) {
                text = '&nbsp;';
            }
            if (this.statusPanel.body) {
                this.statusPanel.body.update(text);
            } else {
                this.statusPanel.html = text;
            }
        },
        onBeforeHide: function () {
            if (this.selectionLayer) {
                this.selectionLayer.setVisibility(false);
            }
        },
        onBeforeShow: function () {
            if (this.selectionLayer) {
                this.selectionLayer.setVisibility(true);
            }
        },
        onBeforeDestroy: function () {
            this.deactivateDrawControl();
            if (this.selectionLayer) {
                this.selectionLayer.removeAllFeatures();
                this.map.removeLayer(this.selectionLayer);
            }
        },
        onDrawingComplete: function (searchPanel, selectionLayer) {},
        onTargetLayerSelected: function () {},
        onSelectionLayerUpdate: function () {},
        onSearchIssued: function () {
            this.searchState = "searchissued";
            this.response = null;
            this.features = null;
            this.updateStatusPanel(__('Searching...'));
            var self = this;
            var startTime = new Date().getTime() / 1000;
            this.timer = setInterval(function () {
                    if (self.searchState != 'searchissued') {
                        return;
                    }
                    self.updateStatusPanel(Math.floor(new Date().getTime() / 1000 - startTime) + ' ' + __('Seconds') + ' - ' +
                        Heron.Utils.randArrayElm(self.progressMessages));
                }, 4000);
        },
        onSearchCanceled: function (searchPanel) {
            this.searchState = 'searchcanceled';
            this.searchAbort();
            this.updateStatusPanel(__('Search Canceled'));
        },
        onSearchComplete: function (searchPanel, result) {
            this.protocol = null;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.sketch) {
                this.selectionLayer.removeAllFeatures();
                this.sketch = false;
            }
            this.fireEvent('selectionlayerupdate');
            if (this.searchState == 'searchcanceled') {
                this.fireEvent('searchfailed', searchPanel, null);
                return;
            }
            this.searchState = "searchcomplete";
            var olResponse = result.olResponse;
            if (!olResponse || !olResponse.success() || olResponse.priv.responseText.indexOf('ExceptionReport') > 0) {
                this.fireEvent('searchfailed', searchPanel, olResponse);
                this.updateStatusPanel(__('Search Failed') + ' details: ' + olResponse.priv.responseText);
                return;
            }
            this.onSearchSuccess(searchPanel, result);
        },
        onSearchSuccess: function (searchPanel, result) {
            var features = this.features = this.filterFeatures = result.olResponse.features;
            var featureCount = features ? features.length : 0;
            this.updateStatusPanel(__('Search Completed: ') + featureCount + ' ' + (featureCount != 1 ? __('Results') : __('Result')));
            this.fireEvent('searchsuccess', searchPanel, result);
        },
        search: function (geometries, options) {
            var targetLayer = options.targetLayer;
            var wfsOptions = targetLayer.metadata.wfs;
            if (wfsOptions.protocol == 'fromWMSLayer') {
                this.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(targetLayer, {
                        outputFormat: 'GML2'
                    });
                if (this.protocol.url instanceof Array) {
                    this.protocol.url = Heron.Utils.randArrayElm(this.protocol.url);
                    this.protocol.options.url = this.protocol.url;
                }
            } else {
                this.protocol = wfsOptions.protocol;
            }
            var geometry = geometries[0];
            var spatialFilterType = options.spatialFilterType || OpenLayers.Filter.Spatial.INTERSECTS;
            var filter = new OpenLayers.Filter.Spatial({
                    type: spatialFilterType,
                    value: geometry
                });
            if (geometries.length > 1) {
                var filters = [];
                geometry = new OpenLayers.Geometry.Collection();
                Ext.each(geometries, function (g) {
                        geometry.addComponent(g);
                        filters.push(new OpenLayers.Filter.Spatial({
                                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                                    value: g
                                }));
                    });
                filter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.OR,
                        filters: filters
                    });
            }
            if (geometry.CLASS_NAME.indexOf('LineString') > 0 && wfsOptions.maxQueryLength) {
                var length = Math.round(geometry.getGeodesicLength(options.projection));
                if (length > wfsOptions.maxQueryLength) {
                    this.selectionLayer.removeAllFeatures();
                    var units = options.units;
                    Ext.Msg.alert(__('Warning - Line Length is ') + length + units, __('You drew a line with length above the layer-maximum of ') + wfsOptions.maxQueryLength + units);
                    return false;
                }
            }
            if (geometry.CLASS_NAME.indexOf('Polygon') > 0 && wfsOptions.maxQueryArea) {
                var area = Math.round(geometry.getGeodesicArea(options.projection));
                if (area > wfsOptions.maxQueryArea) {
                    this.selectionLayer.removeAllFeatures();
                    var areaUnits = options.units + '2';
                    Ext.Msg.alert(__('Warning - Area is ') + area + areaUnits, __('You selected an area for this layer above its maximum of ') + wfsOptions.maxQueryArea + areaUnits);
                    return false;
                }
            }
            var filterFormat = new OpenLayers.Format.Filter.v1_1_0({
                    srsName: this.protocol.srsName
                });
            var filterStr = OpenLayers.Format.XML.prototype.write.apply(filterFormat, [filterFormat.write(filter)]);
            var maxFeatures = this.single == true ? this.maxFeatures : undefined;
            this.response = this.protocol.read({
                    maxFeatures: maxFeatures,
                    filter: filter,
                    callback: function (olResponse) {
                        if (!this.protocol) {
                            return;
                        }
                        var downloadInfo = {
                            type: 'wfs',
                            url: this.protocol.options.url,
                            downloadFormats: wfsOptions.downloadFormats,
                            params: {
                                typename: this.protocol.featureType,
                                maxFeatures: maxFeatures,
                                "Content-Disposition": "attachment",
                                filename: targetLayer.name,
                                srsName: this.protocol.srsName,
                                service: "WFS",
                                version: "1.1.0",
                                request: "GetFeature",
                                filter: filterStr
                            }
                        };
                        var result = {
                            olResponse: olResponse,
                            downloadInfo: downloadInfo,
                            layer: targetLayer
                        };
                        this.fireEvent('searchcomplete', this, result);
                    },
                    scope: this
                });
            this.fireEvent('searchissued', this);
            return true;
        },
        searchAbort: function () {
            if (this.protocol) {
                this.protocol.abort(this.response);
            }
            this.protocol = null;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    });
Ext.reg('hr_spatialsearchpanel', Heron.widgets.search.SpatialSearchPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.SearchByDrawPanel = Ext.extend(Heron.widgets.search.SpatialSearchPanel, {
        name: __('Search by Drawing'),
        initComponent: function () {
            this.items = [this.createTargetLayerCombo(), this.createDrawToolPanel(), this.createStatusPanel(), this.createActionButtons()];
            Heron.widgets.search.SearchByDrawPanel.superclass.initComponent.call(this);
            this.addListener("drawcontroladded", this.activateDrawControl, this);
        },
        createActionButtons: function () {
            return this.cancelButton = new Ext.Button({
                    text: 'Cancel',
                    tooltip: __('Cancel ongoing search'),
                    disabled: true,
                    handler: function () {
                        this.fireEvent('searchcanceled', this);
                    },
                    scope: this
                });
        },
        onDrawingComplete: function (searchPanel, selectionLayer) {
            this.searchFromSketch();
        },
        onFeatureDrawn: function () {
            this.fireEvent('drawingcomplete', this, this.selectionLayer);
        },
        onPanelRendered: function () {
            this.updateStatusPanel(__('Select a drawing tool and draw to search immediately.'));
            this.targetLayer = this.targetLayerCombo.selectedLayer;
            if (this.targetLayer) {
                this.fireEvent('targetlayerselected', this.targetLayer);
            }
        },
        onParentShow: function () {
            this.activateDrawControl();
        },
        onParentHide: function () {
            this.deactivateDrawControl();
        },
        onSearchCanceled: function (searchPanel) {
            Heron.widgets.search.SearchByFeaturePanel.superclass.onSearchCanceled.call(this);
            this.cancelButton.disable();
            if (this.selectionLayer) {
                this.selectionLayer.removeAllFeatures();
            }
        },
        onSearchComplete: function (searchPanel, result) {
            Heron.widgets.search.SearchByFeaturePanel.superclass.onSearchComplete.call(this, searchPanel, result);
            this.cancelButton.disable();
        },
        searchFromSketch: function () {
            var selectionLayer = this.selectionLayer;
            var geometry = selectionLayer.features[0].geometry;
            if (!this.search([geometry], {
                        projection: selectionLayer.projection,
                        units: selectionLayer.units,
                        targetLayer: this.targetLayer
                    })) {}
            this.sketch = true;
            this.cancelButton.enable();
        }
    });
Ext.reg('hr_searchbydrawpanel', Heron.widgets.search.SearchByDrawPanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.SearchByFeaturePanel = Ext.extend(Heron.widgets.search.SpatialSearchPanel, {
        name: __('Search by Feature Selection'),
        targetLayerFilter: function (map) {
            return map.getLayersBy('metadata', {
                    test: function (metadata) {
                        return metadata && metadata.wfs && !metadata.isSourceLayer;
                    }
                })
        },
        initComponent: function () {
            this.searchByFeatureFieldset = new Ext.form.FieldSet({
                    xtype: "fieldset",
                    checkboxToggle: false,
                    items: []
                });
            this.resetButton = new Ext.Button({
                    anchor: "20%",
                    text: 'Reset',
                    tooltip: __('Start a new search'),
                    listeners: {
                        click: function () {
                            this.resetForm();
                        },
                        scope: this
                    }
                });
            this.items = [this.createSourceLayerCombo(), this.createDrawFieldSet(), this.createTargetLayerCombo({
                        selectFirst: false
                    }), this.createSearchTypeCombo(), this.createActionButtons(), this.createStatusPanel(), this.resetButton];
            Heron.widgets.search.SearchByFeaturePanel.superclass.initComponent.call(this);
        },
        activateSearchByFeature: function () {
            this.deactivateSearchByFeature();
            this.sourceLayerCombo.addListener('selectlayer', this.onSourceLayerSelect, this);
            this.selectionLayer.events.register('featureadded', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.register('featuresadded', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.register('featureremoved', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.register('featuresremoved', this, this.onSelectionLayerUpdate);
        },
        deactivateSearchByFeature: function () {
            this.sourceLayerCombo.removeListener('selectlayer', this.onSourceLayerSelect, this);
            this.selectionLayer.events.unregister('featureadded', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.unregister('featuresadded', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.unregister('featureremoved', this, this.onSelectionLayerUpdate);
            this.selectionLayer.events.unregister('featuresremoved', this, this.onSelectionLayerUpdate);
        },
        resetForm: function () {
            this.selectionLayer.removeAllFeatures();
            this.searchButton.disable();
            this.sourceLayerCombo.reset();
            this.targetLayerCombo.reset();
            this.spatialFilterType = OpenLayers.Filter.Spatial.INTERSECTS;
            this.drawFieldSet.hide();
            this.deactivateDrawControl();
            this.selectionStatusField.hide();
            this.targetLayerCombo.hide();
            this.searchTypeCombo.hide();
            this.actionButtons.hide();
            this.updateStatusPanel(__('Select a source Layer and then draw to select objects from that layer. <br/>Then select a target Layer to search in using the geometries of the selected objects.'));
            this.fireEvent('searchreset');
        },
        createActionButtons: function () {
            this.searchButton = new Ext.Button({
                    text: __('Search'),
                    tooltip: __('Search in target layer using the feature-geometries from the selection'),
                    disabled: true,
                    handler: function () {
                        this.searchFromFeatures();
                    },
                    scope: this
                });
            this.cancelButton = new Ext.Button({
                    text: 'Cancel',
                    tooltip: __('Cancel ongoing search'),
                    disabled: true,
                    listeners: {
                        click: function () {
                            this.fireEvent('searchcanceled', this);
                        },
                        scope: this
                    }
                });
            return this.actionButtons = new Ext.ButtonGroup({
                    fieldLabel: __('Actions'),
                    anchor: "100%",
                    title: null,
                    border: false,
                    items: [this.cancelButton, this.searchButton]
                });
        },
        createDrawFieldSet: function () {
            this.selectionStatusField = new Heron.widgets.HTMLPanel({
                    html: __('No objects selected'),
                    preventBodyReset: true,
                    bodyCfg: {
                        style: {
                            padding: '2px',
                            border: '0px'
                        }
                    },
                    style: {
                        marginTop: '2px',
                        marginBottom: '2px',
                        fontFamily: 'Verdana, tahoma, Helvetica, sans-serif',
                        fontSize: '11px',
                        color: '#0000C0'
                    }
                });
            return this.drawFieldSet = new Ext.form.FieldSet({
                    xtype: "fieldset",
                    title: null,
                    anchor: "100%",
                    items: [this.createDrawToolPanel({
                                style: {
                                    marginTop: '12px',
                                    marginBottom: '12px'
                                },
                                activateControl: false
                            }), this.selectionStatusField]
                });
        },
        createSearchTypeCombo: function () {
            var store = new Ext.data.ArrayStore({
                    fields: ['name', 'value'],
                    data: [
                        ['INTERSECTS (default)', OpenLayers.Filter.Spatial.INTERSECTS],
                        ['WITHIN', OpenLayers.Filter.Spatial.WITHIN],
                        ['CONTAINS', OpenLayers.Filter.Spatial.CONTAINS]
                    ]
                });
            return this.searchTypeCombo = new Ext.form.ComboBox({
                    mode: 'local',
                    listWidth: 160,
                    value: store.getAt(0).get("name"),
                    fieldLabel: __('Type of Search'),
                    store: store,
                    displayField: 'name',
                    valueField: 'value',
                    forceSelection: true,
                    triggerAction: 'all',
                    editable: false,
                    listeners: {
                        select: function (cb, record) {
                            this.spatialFilterType = record.data['value'];
                        },
                        scope: this
                    }
                });
        },
        createSourceLayerCombo: function () {
            return this.sourceLayerCombo = new Heron.widgets.LayerCombo({
                    fieldLabel: __('Choose Layer to select with'),
                    emptyText: __('Choose a Layer'),
                    sortOrder: this.layerSortOrder,
                    layerFilter: this.layerFilter
                });
        },
        updateSelectionStatusField: function (text) {
            if (this.selectionStatusField.body) {
                this.selectionStatusField.body.update(text);
            } else {
                this.selectionStatusField.html = text;
            }
        },
        onFeatureDrawn: function (evt) {
            var selectionLayer = this.selectionLayer;
            selectionLayer.removeAllFeatures();
            selectionLayer.addFeatures(evt.feature);
            var geometries = [selectionLayer.features[0].geometry];
            if (!this.search(geometries, {
                        targetLayer: this.sourceLayer,
                        projection: this.selectionLayer.projection,
                        units: this.selectionLayer.units
                    })) {
                return;
            }
            this.searchSelect = true;
            this.searchButton.enable();
            this.cancelButton.disable();
        },
        onSourceLayerSelect: function (layer) {
            if (this.sourceLayer && this.sourceLayer.metadata) {
                this.sourceLayer.metadata.isSourceLayer = false;
            }
            this.sourceLayer = layer;
            if (this.sourceLayer && this.sourceLayer.metadata) {
                this.sourceLayer.metadata.isSourceLayer = true;
            }
            this.searchButton.enable();
            this.cancelButton.disable();
            this.drawFieldSet.show();
            this.activateDrawControl();
            this.selectionStatusField.show();
            this.updateStatusPanel();
            this.updateSelectionStatusField(__('Select a draw tool and draw to select objects from') + (this.sourceLayer ? '<br/>"' + this.sourceLayer.name + '"' : ''));
        },
        onSelectionLayerUpdate: function () {},
        onTargetLayerSelected: function () {
            this.searchTypeCombo.show();
            this.actionButtons.show();
            this.searchButton.enable();
            this.cancelButton.disable();
            this.doLayout();
            this.updateStatusPanel(__('Select the spatial operator (optional) and use the Search button to start your search.'));
        },
        onPanelRendered: function () {
            if (this.fromLastResult && this.filterFeatures) {
                this.selectionLayer.addFeatures(this.filterFeatures);
            }
            this.activateSearchByFeature();
            this.resetForm();
        },
        onParentShow: function () {
            this.activateSearchByFeature();
        },
        onParentHide: function () {
            this.deactivateSearchByFeature();
            this.resetForm();
        },
        onBeforeDestroy: function () {
            this.deactivateSearchByFeature();
            if (this.selectionLayer) {
                this.selectionLayer.removeAllFeatures();
                this.map.removeLayer(this.selectionLayer);
            }
        },
        onSearchCanceled: function (searchPanel) {
            Heron.widgets.search.SearchByFeaturePanel.superclass.onSearchCanceled.call(this);
            this.resetForm();
        },
        onSearchSuccess: function (searchPanel, result) {
            var features = this.features = this.filterFeatures = result.olResponse.features;
            this.searchButton.enable();
            this.cancelButton.disable();
            if (this.searchSelect) {
                this.selectionLayer.removeAllFeatures();
                this.selectionLayer.addFeatures(features);
                this.targetLayerCombo.hide();
                this.updateStatusPanel();
                if (this.selectionLayer.features.length == 0) {
                    this.updateSelectionStatusField(__('No objects selected.'));
                    return;
                }
                if (this.selectionLayer.features.length > this.maxFilterGeometries) {
                    this.updateSelectionStatusField(__('Too many geometries for spatial filter: ') + this.selectionLayer.features.length + ' ' + 'max: ' + this.maxFilterGeometries);
                    return;
                }
                this.searchSelect = false;
                this.targetLayerCombo.setLayers(this.targetLayerFilter(this.map));
                this.targetLayerCombo.show();
                var text = this.selectionLayer.features.length + ' ' + __('objects selected from "') + (this.sourceLayer ? this.sourceLayer.name : '') + '"';
                this.updateSelectionStatusField(text);
                this.updateStatusPanel(__('Select a target layer to search using the geometries of the selected objects'));
            } else {
                Heron.widgets.search.SearchByFeaturePanel.superclass.onSearchSuccess.call(this, searchPanel, result);
            }
        },
        searchFromFeatures: function () {
            var geometries = [];
            var features = this.selectionLayer.features;
            for (var i = 0; i < features.length; i++) {
                geometries.push(features[i].geometry);
            }
            this.searchButton.disable();
            this.cancelButton.enable();
            if (!this.search(geometries, {
                        spatialFilterType: this.spatialFilterType,
                        targetLayer: this.targetLayer,
                        projection: this.selectionLayer.projection,
                        units: this.selectionLayer.units
                    })) {
                this.selectionLayer.removeAllFeatures();
            }
        }
    });
Ext.reg('hr_searchbyfeaturepanel', Heron.widgets.search.SearchByFeaturePanel);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.GXP_QueryPanel = Ext.extend(gxp.QueryPanel, {
        description: __('Ready'),
        wfsVersion: '1.1.0',
        title: __('Query Panel'),
        bodyStyle: 'padding: 12px',
        layerSortOrder: 'ASC',
        caseInsensitiveMatch: false,
        autoWildCardAttach: false,
        wfsLayers: undefined,
        layerFilter: function (map) {
            return map.getLayersBy('metadata', {
                    test: function (metadata) {
                        return metadata && metadata.wfs && !metadata.wfs.noBBOX;
                    }
                })
        },
        progressMessages: [__('Working on it...'), __('Still searching, please be patient...'), __('Still searching, have you selected an area with too many objects?')],
        initComponent: function () {
            var map = this.map = Heron.App.getMap();
            var self = this;
            this.wfsLayers = this.getWFSLayers();
            var config = {
                map: map,
                layerStore: new Ext.data.JsonStore({
                        data: {
                            layers: this.wfsLayers
                        },
                        sortInfo: this.layerSortOrder ? {
                            field: 'title',
                            direction: this.layerSortOrder
                        } : null,
                        root: "layers",
                        fields: ["title", "name", "namespace", "url", "schema", "options"]
                    }),
                listeners: {
                    ready: function (panel, store) {
                        store.addListener("exception", this.onQueryException, this);
                    },
                    layerchange: function (panel, record) {
                        this.layerRecord = record;
                    },
                    beforequery: function (panel, store) {
                        var area = Math.round(map.getExtent().toGeometry().getGeodesicArea(map.projection));
                        var filter = this.getFilter();
                        return true;
                    },
                    query: function (panel, store) {
                        this.fireEvent('searchissued', this);
                    },
                    storeload: function (panel, store) {
                        var features = [];
                        store.each(function (record) {
                                features.push(record.get("feature"));
                            });
                        var protocol = store.proxy.protocol;
                        var wfsOptions = this.layerRecord.get('options');
                        var filterFormat = new OpenLayers.Format.Filter.v1_1_0({
                                srsName: protocol.srsName
                            });
                        var filterStr = OpenLayers.Format.XML.prototype.write.apply(filterFormat, [filterFormat.write(protocol.filter)]);
                        var downloadInfo = {
                            type: 'wfs',
                            url: protocol.options.url,
                            downloadFormats: wfsOptions.downloadFormats,
                            params: {
                                typename: protocol.featureType,
                                maxFeatures: undefined,
                                "Content-Disposition": "attachment",
                                filename: protocol.featureType,
                                srsName: protocol.srsName,
                                service: "WFS",
                                version: "1.1.0",
                                request: "GetFeature",
                                filter: filterStr
                            }
                        };
                        var result = {
                            olResponse: store.proxy.response,
                            downloadInfo: downloadInfo
                        };
                        this.fireEvent('searchcomplete', panel, result);
                        store.removeListener("exception", this.onQueryException, this);
                    }
                }
            };
            Ext.apply(this, config);
            this.addEvents({
                    "searchissued": true,
                    "searchcomplete": true,
                    "searchfailed": true,
                    "searchsuccess": true,
                    "searchaborted": true
                });
            Heron.widgets.search.GXP_QueryPanel.superclass.initComponent.call(this);
            this.statusPanel = this.add({
                    xtype: "hr_htmlpanel",
                    html: this.description,
                    height: 132,
                    preventBodyReset: true,
                    bodyCfg: {
                        style: {
                            padding: '6px',
                            border: '0px'
                        }
                    },
                    style: {
                        marginTop: '24px',
                        paddingTop: '24px',
                        fontFamily: 'Verdana, tahoma, Helvetica, sans-serif',
                        fontSize: '11px',
                        color: '#0000C0'
                    }
                });
            this.addButton(this.createActionButtons());
            this.addListener("searchissued", this.onSearchIssued, this);
            this.addListener("searchcomplete", this.onSearchComplete, this);
            this.addListener("beforedestroy", this.onBeforeDestroy, this);
            this.addListener("afterrender", this.onPanelRendered, this);
            if (this.ownerCt) {
                this.ownerCt.addListener("parenthide", this.onParentHide, this);
                this.ownerCt.addListener("parentshow", this.onParentShow, this);
            }
        },
        createActionButtons: function () {
            this.searchButton = new Ext.Button({
                    text: __('Search'),
                    tooltip: __('Search in target layer using the selected filters'),
                    disabled: false,
                    handler: function () {
                        this.search();
                    },
                    scope: this
                });
            this.cancelButton = new Ext.Button({
                    text: 'Cancel',
                    tooltip: __('Cancel current search'),
                    disabled: true,
                    listeners: {
                        click: function () {
                            this.searchAbort();
                        },
                        scope: this
                    }
                });
            return this.actionButtons = new Ext.ButtonGroup({
                    fieldLabel: null,
                    anchor: "100%",
                    title: null,
                    border: false,
                    width: 160,
                    padding: '2px',
                    bodyBorder: false,
                    style: {
                        border: '0px'
                    },
                    items: [this.cancelButton, this.searchButton]
                });
        },
        getWFSLayers: function () {
            var self = this;
            if (this.wfsLayers) {
                return this.wfsLayers;
            }
            var wmsLayers = this.layerFilter(this.map);
            var wfsLayers = [];
            Ext.each(wmsLayers, function (wmsLayer) {
                    var wfsOpts = wmsLayer.metadata.wfs;
                    var protocol = wfsOpts.protocol;
                    if (wfsOpts.protocol === 'fromWMSLayer') {
                        protocol = OpenLayers.Protocol.WFS.fromWMSLayer(wmsLayer);
                        if (protocol.url instanceof Array) {
                            protocol.url = Heron.Utils.randArrayElm(protocol.url);
                            protocol.options.url = protocol.url;
                        }
                    } else {
                        return;
                    }
                    var url = protocol.url.indexOf('?') == protocol.url.length - 1 ? protocol.url.slice(0, -1) : protocol.url;
                    var featureType = protocol.featureType;
                    var featurePrefix = wfsOpts.featurePrefix;
                    var fullFeatureType = featurePrefix ? featurePrefix + ':' + featureType : featureType;
                    var wfsVersion = protocol.version ? protocol.version : self.version;
                    var outputFormat = protocol.outputFormat ? '&outputFormat=' + protocol.outputFormat : '';
                    var wfsLayer = {
                        title: wmsLayer.name,
                        name: featureType,
                        namespace: wfsOpts.featureNS,
                        url: url,
                        schema: url + '?service=WFS&version=' + wfsVersion + '&request=DescribeFeatureType&typeName=' + fullFeatureType + outputFormat,
                        options: wfsOpts
                    };
                    wfsLayers.push(wfsLayer);
                });
            return wfsLayers;
        },
        getFeatureType: function () {
            return this.layerRecord ? this.layerRecord.get('name') : 'heron';
        },
        updateStatusPanel: function (text) {
            this.statusPanel.body.update(text);
        },
        onPanelRendered: function () {},
        onParentShow: function () {},
        onParentHide: function () {},
        onBeforeDestroy: function () {},
        onQueryException: function (type, action, obj, response_error, o_records) {
            this.searchButton.enable();
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.updateStatusPanel(__('Search Failed'));
        },
        onSearchIssued: function () {
            this.searchState = "searchissued";
            this.response = null;
            this.features = null;
            this.updateStatusPanel(__('Searching...'));
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.searchButton.disable();
            var self = this;
            var startTime = new Date().getTime() / 1000;
            this.timer = setInterval(function () {
                    if (self.searchState != 'searchissued') {
                        return;
                    }
                    self.updateStatusPanel(Math.floor(new Date().getTime() / 1000 - startTime) + ' ' + __('Seconds') + ' - ' +
                        self.progressMessages[Math.floor(Math.random() * self.progressMessages.length)]);
                }, 4000);
        },
        onSearchComplete: function (searchPanel, result) {
            this.searchButton.enable();
            this.cancelButton.disable();
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.searchState == 'searchaborted') {
                return;
            }
            this.searchState = "searchcomplete";
            var features = result.olResponse.features;
            var featureCount = features ? features.length : 0;
            this.updateStatusPanel(__('Search Completed: ') + featureCount + ' ' + (featureCount != 1 ? __('Results') : __('Result')));
            this.fireEvent('searchsuccess', searchPanel, result);
        },
        searchAbort: function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.featureStore && this.featureStore.proxy && this.featureStore.proxy.protocol) {
                this.featureStore.proxy.protocol.abort(this.featureStore.proxy.response);
            }
            this.fireEvent('searchaborted', this);
            this.searchState = 'searchaborted';
            this.searchButton.enable();
            this.cancelButton.disable();
            this.updateStatusPanel(__('Search aborted'));
        },
        search: function () {
            this.query();
            this.cancelButton.enable();
        }
    });
Ext.reg('hr_gxpquerypanel', Heron.widgets.search.GXP_QueryPanel);
Ext.namespace("Heron.widgets.ToolbarBuilder");
Heron.widgets.ToolbarBuilder.defs = {
    baselayer: {
        options: {
            id: "baselayercombo"
        },
        create: function (mapPanel, options) {
            if (!options.initialConfig) {
                options.initialConfig = {};
            }
            options.initialConfig.map = mapPanel.getMap();
            return new Heron.widgets.BaseLayerCombo(options);
        }
    },
    geocoder: {
        options: {
            id: "geocodercombo"
        },
        create: function (mapPanel, options) {
            return new Heron.widgets.search.GeocoderCombo(options);
        }
    },
    scale: {
        options: {
            id: "scalecombo"
        },
        create: function (mapPanel, options) {
            return new Heron.widgets.ScaleSelectorCombo(options);
        }
    },
    featureinfo: {
        options: {
            tooltip: __('Feature information'),
            iconCls: "icon-getfeatureinfo",
            enableToggle: true,
            pressed: false,
            id: "featureinfo",
            toggleGroup: "toolGroup",
            popupWindowDefaults: {
                title: __('Feature Info'),
                anchored: false,
                hideonmove: false
            },
            controlDefaults: {
                maxFeatures: 8,
                hover: false,
                drillDown: true,
                infoFormat: "application/vnd.ogc.gml",
                queryVisible: true
            }
        },
        create: function (mapPanel, options) {
            if (options.getfeatureControl) {
                options.controlDefaults = Ext.apply(options.controlDefaults, options.getfeatureControl);
            }
            options.control = new OpenLayers.Control.WMSGetFeatureInfo(options.controlDefaults);
            if (options.popupWindow) {
                var self = this;
                var popupWindowProps = options.popupWindowDefaults;
                popupWindowProps = Ext.apply(popupWindowProps, options.popupWindow);
                if (options.control) {
                    popupWindowProps.olControl = options.control;
                }
                popupWindowProps.controlDefaults = Ext.apply({}, options.getfeatureControl);
                popupWindowProps.featureinfopanelProps = Ext.apply({}, options.popupWindow.featureInfoPanel);
                var createPopupWindow = function () {
                    if (!self.featurePopupWindow) {
                        self.featurePopupWindow = new Heron.widgets.search.FeatureInfoPopup(popupWindowProps);
                    }
                };
                if (options.pressed) {
                    createPopupWindow();
                }
                options.handler = function () {
                    createPopupWindow();
                    self.featurePopupWindow.hide();
                };
            }
            return new GeoExt.Action(options);
        }
    },
    tooltips: {
        options: {
            tooltip: __('Feature tooltips'),
            iconCls: "icon-featuretooltip",
            enableToggle: true,
            pressed: false,
            id: "tooltips",
            toggleGroup: "tooltipsGrp",
            popupWindowDefaults: {
                title: __('FeatureTooltip'),
                anchored: true,
                hideonmove: true,
                height: 150
            },
            controlDefaults: {
                maxFeatures: 1,
                hover: true,
                drillDown: false,
                infoFormat: "application/vnd.ogc.gml",
                queryVisible: true
            }
        },
        create: function (mapPanel, options) {
            return Heron.widgets.ToolbarBuilder.defs.featureinfo.create(mapPanel, options);
        }
    },
    pan: {
        options: {
            tooltip: __('Pan'),
            iconCls: "icon-hand",
            enableToggle: true,
            pressed: true,
            control: new OpenLayers.Control.Navigation(),
            id: "pan",
            toggleGroup: "toolGroup"
        },
        create: function (mapPanel, options) {
            return new GeoExt.Action(options);
        }
    },
    zoomin: {
        options: {
            tooltip: __('Zoom in'),
            iconCls: "icon-zoom-in",
            enableToggle: true,
            pressed: false,
            control: new OpenLayers.Control.ZoomBox({
                    title: __('Zoom in'),
                    out: false
                }),
            id: "zoomin",
            toggleGroup: "toolGroup"
        },
        create: function (mapPanel, options) {
            return new GeoExt.Action(options);
        }
    },
    zoomout: {
        options: {
            tooltip: __('Zoom out'),
            iconCls: "icon-zoom-out",
            enableToggle: true,
            pressed: false,
            control: new OpenLayers.Control.ZoomBox({
                    title: __('Zoom out'),
                    out: true
                }),
            id: "zoomout",
            toggleGroup: "toolGroup"
        },
        create: function (mapPanel, options) {
            return new GeoExt.Action(options);
        }
    },
    zoomvisible: {
        options: {
            tooltip: __('Zoom to full extent'),
            iconCls: "icon-zoom-visible",
            enableToggle: false,
            pressed: false,
            control: new OpenLayers.Control.ZoomToMaxExtent(),
            id: "zoomvisible"
        },
        create: function (mapPanel, options) {
            return new GeoExt.Action(options);
        }
    },
    zoomprevious: {
        options: {
            tooltip: __('Zoom previous'),
            iconCls: "icon-zoom-previous",
            enableToggle: false,
            disabled: true,
            pressed: false,
            id: "zoomprevious"
        },
        create: function (mapPanel, options) {
            if (!mapPanel.historyControl) {
                mapPanel.historyControl = new OpenLayers.Control.NavigationHistory();
                mapPanel.getMap().addControl(mapPanel.historyControl);
            }
            options.control = mapPanel.historyControl.previous;
            return new GeoExt.Action(options);
        }
    },
    zoomnext: {
        options: {
            tooltip: __('Zoom next'),
            iconCls: "icon-zoom-next",
            enableToggle: false,
            disabled: true,
            pressed: false,
            id: "zoomnext"
        },
        create: function (mapPanel, options) {
            if (!mapPanel.historyControl) {
                mapPanel.historyControl = new OpenLayers.Control.NavigationHistory();
                mapPanel.getMap().addControl(mapPanel.historyControl);
            }
            options.control = mapPanel.historyControl.next;
            return new GeoExt.Action(options);
        }
    },
    measurelength: {
        options: {
            tooltip: __('Measure length'),
            iconCls: "icon-measure-length",
            enableToggle: true,
            pressed: false,
            measureLastLength: 0.0,
            control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                    persist: true,
                    immediate: true,
                    displayClass: "olControlMeasureDistance",
                    handlerOptions: {
                        layerOptions: {
                            styleMap: new OpenLayers.StyleMap({
                                    "default": new OpenLayers.Style(null, {
                                            rules: [new OpenLayers.Rule({
                                                        symbolizer: {
                                                            "Point": {
                                                                pointRadius: 10,
                                                                graphicName: "square",
                                                                fillColor: "white",
                                                                fillOpacity: 0.25,
                                                                strokeWidth: 1,
                                                                strokeOpacity: 1,
                                                                strokeColor: "#333333"
                                                            },
                                                            "Line": {
                                                                strokeWidth: 1,
                                                                strokeOpacity: 1,
                                                                strokeColor: "#FF0000",
                                                                strokeDashstyle: "solid"
                                                            }
                                                        }
                                                    })]
                                        })
                                })
                        }
                    }
                }),
            id: "measurelength",
            toggleGroup: "toolGroup"
        },
        create: function (mapPanel, options) {
            var action = new GeoExt.Action(options);
            var map = mapPanel.getMap();
            var controls = map.getControlsByClass("OpenLayers.Control.Measure");
            Heron.widgets.ToolbarBuilder.onMeasurementsActivate = function (event) {
                Ext.getCmp("measurelength").measureLastLength = 0.0;
            };
            Heron.widgets.ToolbarBuilder.onMeasurements = function (event) {
                var units = event.units;
                var measure = event.measure;
                var out = "";
                if (event.order == 1) {
                    out += __('Length') + ": " + measure.toFixed(2) + " " + units;
                    var item = Ext.getCmp("measurelength");
                    item.measureLastLength = 0.0;
                } else {
                    out += __('Area') + ": " + measure.toFixed(2) + " " + units + "&#178;";
                }
                Ext.getCmp("bbar_measure").setText(out);
            };
            Heron.widgets.ToolbarBuilder.onMeasurementsPartial = function (event) {
                var units = event.units;
                var measure = event.measure;
                var out = "";
                if (event.order == 1) {
                    out += __('Length') + ": " + measure.toFixed(2) + " " + units;
                    var item = Ext.getCmp("measurelength");
                    item.measureLastLength = measure;
                } else {
                    out += __('Area') + ": " + measure.toFixed(2) + " " + units + "&#178;";
                }
                Ext.getCmp("bbar_measure").setText(out);
            };
            Heron.widgets.ToolbarBuilder.onMeasurementsDeactivate = function (event) {
                Ext.getCmp("bbar_measure").setText("");
            };
            for (var i = 0; i < controls.length; i++) {
                if (controls[i].displayClass == 'olControlMeasureDistance') {
                    controls[i].geodesic = options.geodesic;
                    controls[i].events.register("activate", map, Heron.widgets.ToolbarBuilder.onMeasurementsActivate);
                    controls[i].events.register("measure", map, Heron.widgets.ToolbarBuilder.onMeasurements);
                    controls[i].events.register("measurepartial", map, Heron.widgets.ToolbarBuilder.onMeasurementsPartial);
                    controls[i].events.register("deactivate", map, Heron.widgets.ToolbarBuilder.onMeasurementsDeactivate);
                    break;
                }
            }
            return action;
        }
    },
    measurearea: {
        options: {
            tooltip: __('Measure area'),
            iconCls: "icon-measure-area",
            enableToggle: true,
            pressed: false,
            control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
                    persist: true,
                    immediate: true,
                    displayClass: "olControlMeasureArea",
                    handlerOptions: {
                        layerOptions: {
                            styleMap: new OpenLayers.StyleMap({
                                    "default": new OpenLayers.Style(null, {
                                            rules: [new OpenLayers.Rule({
                                                        symbolizer: {
                                                            "Point": {
                                                                pointRadius: 10,
                                                                graphicName: "square",
                                                                fillColor: "white",
                                                                fillOpacity: 0.25,
                                                                strokeWidth: 1,
                                                                strokeOpacity: 1,
                                                                strokeColor: "#333333"
                                                            },
                                                            "Polygon": {
                                                                strokeWidth: 1,
                                                                strokeOpacity: 1,
                                                                strokeColor: "#FF0000",
                                                                strokeDashstyle: "solid",
                                                                fillColor: "#FFFFFF",
                                                                fillOpacity: 0.5
                                                            }
                                                        }
                                                    })]
                                        })
                                })
                        }
                    }
                }),
            id: "measurearea",
            toggleGroup: "toolGroup"
        },
        create: function (mapPanel, options) {
            var action = new GeoExt.Action(options);
            var map = mapPanel.getMap();
            var controls = map.getControlsByClass("OpenLayers.Control.Measure");
            for (var i = 0; i < controls.length; i++) {
                if (controls[i].displayClass == 'olControlMeasureArea') {
                    controls[i].geodesic = options.geodesic;
                    controls[i].events.register("activate", map, Heron.widgets.ToolbarBuilder.onMeasurementsActivate);
                    controls[i].events.register("measure", map, Heron.widgets.ToolbarBuilder.onMeasurements);
                    controls[i].events.register("measurepartial", map, Heron.widgets.ToolbarBuilder.onMeasurementsPartial);
                    controls[i].events.register("deactivate", map, Heron.widgets.ToolbarBuilder.onMeasurementsDeactivate);
                    break;
                }
            }
            return action;
        }
    },
    oleditor: {
        options: {
            tooltip: __('Draw Features'),
            iconCls: "icon-mapedit",
            enableToggle: true,
            pressed: false,
            id: "mapeditor",
            toggleGroup: "toolGroup",
            olEditorOptions: {
                activeControls: ['UploadFeature', 'DownloadFeature', 'Separator', 'Navigation', 'SnappingSettings', 'CADTools', 'Separator', 'DeleteAllFeatures', 'DeleteFeature', 'DragFeature', 'SelectFeature', 'Separator', 'DrawHole', 'ModifyFeature', 'Separator'],
                featureTypes: ['text', 'polygon', 'path', 'point'],
                language: 'en',
                DownloadFeature: {
                    url: Heron.globals.serviceUrl,
                    params: {
                        action: 'download',
                        mime: 'text/plain',
                        filename: 'editor',
                        encoding: 'none'
                    },
                    formats: [{
                            name: 'Well-Known-Text (WKT)',
                            fileExt: '.wkt',
                            mimeType: 'text/plain',
                            formatter: 'OpenLayers.Format.WKT'
                        }, {
                            name: 'Geographic Markup Language - v2 (GML2)',
                            fileExt: '.gml',
                            mimeType: 'text/xml',
                            formatter: new OpenLayers.Format.GML.v2({
                                    featureType: 'oledit',
                                    featureNS: 'http://geops.de'
                                })
                        }, {
                            name: 'Geographic Markup Language - v3 (GML3)',
                            fileExt: '.gml',
                            mimeType: 'text/xml',
                            formatter: new OpenLayers.Format.GML.v3({
                                    featureType: 'oledit',
                                    featureNS: 'http://geops.de'
                                })
                        }, {
                            name: 'GeoJSON',
                            fileExt: '.json',
                            mimeType: 'text/plain',
                            formatter: 'OpenLayers.Format.GeoJSON'
                        }, {
                            name: 'GPS Exchange Format (GPX)',
                            fileExt: '.gpx',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.GPX'
                        }, {
                            name: 'Keyhole Markup Language (KML)',
                            fileExt: '.kml',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.KML'
                        }
                    ],
                    fileProjection: new OpenLayers.Projection('EPSG:4326')
                },
                UploadFeature: {
                    url: Heron.globals.serviceUrl,
                    params: {
                        action: 'upload',
                        mime: 'text/html',
                        encoding: 'escape'
                    },
                    formats: [{
                            name: 'Well-Known-Text (WKT)',
                            fileExt: '.wkt',
                            mimeType: 'text/plain',
                            formatter: 'OpenLayers.Format.WKT'
                        }, {
                            name: 'Geographic Markup Language - v2 (GML2)',
                            fileExt: '.gml',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.GML'
                        }, {
                            name: 'Geographic Markup Language - v3 (GML3)',
                            fileExt: '.gml',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.GML.v3'
                        }, {
                            name: 'GeoJSON',
                            fileExt: '.json',
                            mimeType: 'text/plain',
                            formatter: 'OpenLayers.Format.GeoJSON'
                        }, {
                            name: 'GPS Exchange Format (GPX)',
                            fileExt: '.gpx',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.GPX'
                        }, {
                            name: 'Keyhole Markup Language (KML)',
                            fileExt: '.kml',
                            mimeType: 'text/xml',
                            formatter: 'OpenLayers.Format.KML'
                        }
                    ],
                    fileProjection: new OpenLayers.Projection('EPSG:4326')
                }
            }
        },
        create: function (mapPanel, options) {
            OpenLayers.Lang.setCode(options.olEditorOptions.language);
            var map = mapPanel.getMap();
            this.editor = new OpenLayers.Editor(map, options.olEditorOptions);
            this.startEditor = function (self) {
                self.editor.startEditMode();
            };
            this.stopEditor = function (self) {
                var editor = self.editor;
                if (!editor) {
                    return;
                }
                if (editor.editLayer) {}
                editor.stopEditMode();
            };
            var self = this;
            options.handler = function () {
                if (!self.editor.editMode) {
                    self.startEditor(self);
                } else {
                    self.stopEditor(self);
                }
            };
            if (options.pressed) {
                this.startEditor(self);
            }
            return new Ext.Action(options);
        }
    },
    any: {
        options: {
            tooltip: __('Anything is allowed here'),
            text: __('Any valid Toolbar.add() config goes here')
        },
        create: function (mapPanel, options) {
            return options;
        }
    },
    search_nominatim: {
        options: {
            tooltip: __('Search Nominatim'),
            id: "search_nominatim"
        },
        create: function (mapPanel, options) {
            return new Heron.widgets.search.NominatimSearchCombo(options);
        }
    },
    namesearch: {
        options: {
            id: "namesearch"
        },
        create: function (mapPanel, options) {
            return Ext.create(options);
        }
    },
    searchcenter: {
        options: {
            id: "searchcenter",
            tooltip: __('Search'),
            iconCls: "icon-find",
            pressed: false,
            enableToggle: false,
            searchWindowDefault: {
                title: __('Search'),
                layout: "fit",
                closeAction: "hide",
                x: 100,
                width: 400,
                height: 400
            }
        },
        create: function (mapPanel, options) {
            var searchWindow;
            var pressButton = function () {
                var sc = Ext.getCmp('searchcenter');
                if (sc && !sc.pressed) {
                    sc.toggle();
                }
            };
            var depressButton = function () {
                var sc = Ext.getCmp('searchcenter');
                if (sc && sc.pressed) {
                    sc.toggle();
                }
            };
            var showSearchWindow = function () {
                if (!searchWindow) {
                    var windowOptions = options.searchWindowDefault;
                    Ext.apply(windowOptions, options.searchWindow);
                    searchWindow = new Ext.Window(windowOptions);
                    searchWindow.on('hide', depressButton);
                    searchWindow.on('show', pressButton);
                }
                searchWindow.show();
            };
            var toggleSearchWindow = function () {
                if (searchWindow && searchWindow.isVisible()) {
                    searchWindow.hide();
                } else {
                    showSearchWindow();
                }
            };
            if (options.show) {
                options.pressed = true;
            }
            if (options.pressed || options.show) {
                showSearchWindow();
            }
            options.handler = function () {
                toggleSearchWindow();
            };
            if (options.enableToggle) {
                return new GeoExt.Action(options)
            } else {
                return new Ext.Action(options);
            }
        }
    },
    printdialog: {
        options: {
            id: "hr_printdialog",
            title: __('Print Dialog'),
            tooltip: __('Print Dialog Popup with Preview Map'),
            iconCls: "icon-printer",
            enableToggle: false,
            pressed: false,
            windowTitle: __('Print Preview'),
            windowWidth: 400,
            method: 'POST',
            url: null,
            legendDefaults: {
                useScaleParameter: false,
                baseParams: {
                    FORMAT: "image/png"
                }
            },
            showTitle: true,
            mapTitle: null,
            mapTitleYAML: "mapTitle",
            showComment: true,
            mapComment: null,
            mapCommentYAML: "mapComment",
            showFooter: false,
            mapFooter: null,
            mapFooterYAML: "mapFooter",
            showRotation: true,
            showLegend: true,
            showLegendChecked: false,
            mapLimitScales: true
        },
        create: function (mapPanel, options) {
            options.handler = function () {
                var printWindow = new Heron.widgets.PrintPreviewWindow({
                        title: options.windowTitle,
                        modal: true,
                        border: false,
                        resizable: false,
                        width: options.windowWidth,
                        autoHeight: true,
                        hropts: {
                            mapPanel: mapPanel,
                            method: options.method,
                            url: options.url,
                            legendDefaults: options.legendDefaults,
                            showTitle: options.showTitle,
                            mapTitle: options.mapTitle,
                            mapTitleYAML: options.mapTitleYAML,
                            showComment: options.showComment,
                            mapComment: options.mapComment,
                            mapCommentYAML: options.mapCommentYAML,
                            showFooter: options.showFooter,
                            mapFooter: options.mapFooter,
                            mapFooterYAML: options.mapFooterYAML,
                            showRotation: options.showRotation,
                            showLegend: options.showLegend,
                            showLegendChecked: options.showLegendChecked,
                            mapLimitScales: options.mapLimitScales
                        }
                    });
            };
            return new Ext.Action(options);
        }
    },
    printdirect: {
        options: {
            id: "printdirect",
            tooltip: __('Print Visible Map Area Directly'),
            iconCls: "icon-print-direct",
            enableToggle: false,
            pressed: false,
            method: 'POST',
            url: null,
            mapTitle: null,
            mapTitleYAML: "mapTitle",
            mapComment: __('This is a simple map directly printed.'),
            mapCommentYAML: "mapComment",
            mapFooter: null,
            mapFooterYAML: "mapFooter",
            mapPrintLayout: "A4",
            mapPrintDPI: "75",
            mapPrintLegend: false,
            excludeLayers: ['OpenLayers.Handler.Polygon', 'OpenLayers.Handler.RegularPolygon', 'OpenLayers.Handler.Path', 'OpenLayers.Handler.Point'],
            legendDefaults: {
                useScaleParameter: true,
                baseParams: {
                    FORMAT: "image/png"
                }
            }
        },
        create: function (mapPanel, options) {
            options.handler = function () {
                var busyMask = new Ext.LoadMask(Ext.getBody(), {
                        msg: __('Create PDF...')
                    });
                busyMask.show();
                Ext.Ajax.request({
                        url: options.url + '/info.json',
                        method: 'GET',
                        params: null,
                        success: function (result, request) {
                            var printCapabilities = Ext.decode(result.responseText);
                            var printProvider = new GeoExt.data.PrintProvider({
                                    method: options.method,
                                    capabilities: printCapabilities,
                                    customParams: {},
                                    listeners: {
                                        "printexception": function (printProvider, result) {
                                            alert(__('Error from Print server: ') + result.statusText);
                                        },
                                        "beforeencodelayer": function (printProvider, layer) {
                                            for (var i = 0; i < options.excludeLayers.length; i++) {
                                                if (layer.name == options.excludeLayers[i]) {
                                                    return false;
                                                }
                                            }
                                            return true;
                                        }
                                    }
                                });
                            printProvider.customParams[options.mapTitleYAML] = (options.mapTitle) ? options.mapTitle : '';
                            printProvider.customParams[options.mapCommentYAML] = (options.mapComment) ? options.mapComment : '';
                            printProvider.customParams[options.mapFooterYAML] = (options.mapFooter) ? options.mapFooter : '';
                            if ((printProvider.layouts.getCount() > 1) && (options.mapPrintLayout)) {
                                var index = printProvider.layouts.find('name', options.mapPrintLayout);
                                if (index != -1) {
                                    printProvider.setLayout(printProvider.layouts.getAt(index));
                                }
                            }
                            if ((printProvider.dpis.getCount() > 1) && (options.mapPrintDPI)) {
                                var index = printProvider.dpis.find('value', options.mapPrintDPI);
                                if (index != -1) {
                                    printProvider.setDpi(printProvider.dpis.getAt(index));
                                }
                            }
                            if (options.mapPrintLegend) {
                                var legendPanel = new Heron.widgets.LayerLegendPanel({
                                        renderTo: document.body,
                                        hidden: true,
                                        defaults: options.legendDefaults
                                    });
                            }
                            var printPage = new GeoExt.data.PrintPage({
                                    printProvider: printProvider
                                });
                            printPage.fit(mapPanel, true);
                            printProvider.print(mapPanel, printPage, options.mapPrintLegend && {
                                    legend: legendPanel
                                });
                            busyMask.hide();
                        },
                        failure: function (result, request) {
                            busyMask.hide();
                            alert(__('Error getting Print options from server: ') + options.url);
                        }
                    });
            };
            return new Ext.Action(options);
        }
    },
    coordinatesearch: {
        options: {
            id: "coordinatesearch",
            tooltip: __('Enter coordinates to go to location on map'),
            iconCls: "icon-map-pin",
            enableToggle: false,
            pressed: false,
            fieldLabelX: __('X'),
            fieldLabelY: __('Y'),
            onSearchCompleteZoom: 6,
            iconUrl: null,
            iconWidth: 32,
            iconHeight: 32,
            localIconFile: 'redpin.png'
        },
        create: function (mapPanel, options) {
            options.handler = function () {
                if (!this.coordPopup) {
                    this.coordPopup = new Ext.Window({
                            layout: 'fit',
                            resizable: false,
                            width: 280,
                            height: 120,
                            plain: true,
                            pageX: 200,
                            pageY: 75,
                            closeAction: 'hide',
                            title: __('Go to coordinates'),
                            items: new Heron.widgets.search.CoordSearchPanel({
                                    deferredRender: false,
                                    border: false,
                                    header: false,
                                    title: null,
                                    onSearchCompleteZoom: options.onSearchCompleteZoom,
                                    iconUrl: options.iconUrl,
                                    iconWidth: options.iconWidth,
                                    iconHeight: options.iconHeight,
                                    localIconFile: options.localIconFile,
                                    fieldLabelX: options.fieldLabelX,
                                    fieldLabelY: options.fieldLabelY,
                                    projection: options.projection
                                })
                        });
                }
                if (this.coordPopup.isVisible()) {
                    this.coordPopup.hide();
                } else {
                    this.coordPopup.show(this);
                }
            };
            return new Ext.Action(options);
        }
    },
    addbookmark: {
        options: {
            tooltip: __('Bookmark current map context (layers, zoom, extent)'),
            iconCls: "icon-bookmark",
            enableToggle: false,
            disabled: false,
            pressed: false,
            id: "addbookmark"
        },
        create: function (mapPanel, options) {
            options.handler = function () {
                var bookmarksPanel = Heron.widgets.Bookmarks.getBookmarksPanel(this);
                if (!bookmarksPanel) {
                    alert('no BookmarksPanel found');
                    return null;
                }
                bookmarksPanel.onAddBookmark();
            };
            return new GeoExt.Action(options);
        }
    }
};
Heron.widgets.ToolbarBuilder.setItemDef = function (type, createFun, defaultOptions) {
    Heron.widgets.ToolbarBuilder.defs[type].create = createFun;
    Heron.widgets.ToolbarBuilder.defs[type].options = defaultOptions ? defaultOptions : {};
};
Heron.widgets.ToolbarBuilder.build = function (mapPanel, config) {
    var toolbarItems = [];
    if (typeof (config) !== "undefined") {
        for (var i = 0; i < config.length; i++) {
            var itemDef = config[i];
            if (itemDef.type == "-") {
                toolbarItems.push("-");
                continue;
            }
            var createFun;
            var defaultItemDef = Heron.widgets.ToolbarBuilder.defs[itemDef.type];
            if (itemDef.create) {
                createFun = itemDef.create;
            } else if (defaultItemDef && defaultItemDef.create) {
                createFun = defaultItemDef.create;
            }
            if (!createFun) {
                continue;
            }
            var coreOptions = {
                map: mapPanel.getMap(),
                scope: mapPanel
            };
            var defaultItemOptions = {};
            if (defaultItemDef && defaultItemDef.options) {
                defaultItemOptions = defaultItemDef.options;
            }
            var extraOptions = itemDef.options ? itemDef.options : {};
            var options = Ext.apply(coreOptions, extraOptions, defaultItemOptions);
            var item = createFun(mapPanel, options);
            if (item) {
                toolbarItems.push(item);
            }
        }
    }
    mapPanel.getTopToolbar().add(toolbarItems);
};
Ext.namespace("Heron.widgets");
Heron.widgets.XMLTreePanel = Ext.extend(Ext.tree.TreePanel, {
        initComponent: function () {
            Ext.apply(this, {
                    autoScroll: true,
                    rootVisible: false,
                    root: this.root ? this.root : {
                        nodeType: 'async',
                        text: 'Ext JS',
                        draggable: false,
                        id: 'source'
                    }
                });
            Heron.widgets.XMLTreePanel.superclass.initComponent.apply(this, arguments);
        },
        xmlTreeFromUrl: function (url) {
            var self = this;
            Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    params: null,
                    success: function (result, request) {
                        self.xmlTreeFromDoc(self, result.responseXML);
                    },
                    failure: function (result, request) {
                        alert('error in ajax request');
                    }
                });
        },
        xmlTreeFromText: function (self, text) {
            var doc = new OpenLayers.Format.XML().read(text);
            self.xmlTreeFromDoc(self, doc);
            return doc;
        },
        xmlTreeFromDoc: function (self, doc) {
            self.setRootNode(self.treeNodeFromXml(self, doc.documentElement || doc));
        },
        treeNodeFromXml: function (self, XmlEl) {
            var t = ((XmlEl.nodeType == 3) ? XmlEl.nodeValue : XmlEl.tagName);
            if (t.replace(/\s/g, '').length == 0) {
                return null;
            }
            var result = new Ext.tree.TreeNode({
                    text: t
                });
            var xmlns = 'xmlns',
                xsi = 'xsi';
            if (XmlEl.nodeType == 1) {
                Ext.each(XmlEl.attributes, function (a) {
                        var nodeName = a.nodeName;
                        if (!(XmlEl.parentNode.nodeType == 9 && (nodeName.substring(0, xmlns.length) === xmlns || nodeName.substring(0, xsi.length) === xsi))) {
                            var c = new Ext.tree.TreeNode({
                                    text: a.nodeName
                                });
                            c.appendChild(new Ext.tree.TreeNode({
                                        text: a.nodeValue
                                    }));
                            result.appendChild(c);
                        }
                    });
                Ext.each(XmlEl.childNodes, function (el) {
                        if ((el.nodeType == 1) || (el.nodeType == 3)) {
                            var c = self.treeNodeFromXml(self, el);
                            if (c) {
                                result.appendChild(c);
                            }
                        }
                    });
            }
            return result;
        }
    });
Ext.reg('hr_xmltreepanel', Heron.widgets.XMLTreePanel);
Ext.namespace("Heron.widgets");
Heron.widgets.IFramePanel = Ext.extend(Ext.Panel, {
        name: 'iframe',
        iframe: null,
        src: Ext.isIE && Ext.isSecure ? Ext.SSL_SECURE_URL : 'about:blank',
        maskMessage: __('Loading...'),
        doMask: true,
        initComponent: function () {
            this.bodyCfg = {
                tag: 'iframe',
                frameborder: '0',
                src: this.src,
                name: this.name
            };
            Ext.apply(this, {});
            Heron.widgets.IFramePanel.superclass.initComponent.apply(this, arguments);
            this.addListener = this.on;
        },
        onRender: function () {
            Heron.widgets.IFramePanel.superclass.onRender.apply(this, arguments);
            this.iframe = Ext.isIE ? this.body.dom.contentWindow : window.frames[this.name];
            this.body.dom[Ext.isIE ? 'onreadystatechange' : 'onload'] = this.loadHandler.createDelegate(this);
        },
        loadHandler: function () {
            this.src = this.body.dom.src;
            this.removeMask();
        },
        getIframe: function () {
            return this.iframe;
        },
        getIframeBody: function () {
            var b = this.iframe.document.getElementsByTagName('body');
            if (!Ext.isEmpty(b)) {
                return b[0];
            } else {
                return '';
            }
        },
        getUrl: function () {
            return this.body.dom.src;
        },
        setUrl: function (source) {
            this.setMask();
            this.body.dom.src = source;
        },
        resetUrl: function () {
            this.setMask();
            this.body.dom.src = this.src;
        },
        refresh: function () {
            if (!this.isVisible()) {
                return;
            }
            this.setMask();
            this.body.dom.src = this.body.dom.src;
        },
        setMask: function () {
            if (this.doMask) {
                this.el.mask(this.maskMessage);
            }
        },
        removeMask: function () {
            if (this.doMask) {
                this.el.unmask();
            }
        }
    });
Ext.reg('hr_iframePpanel', Heron.widgets.IFramePanel);
Ext.namespace("Heron.widgets");
Heron.widgets.ScaleSelectorCombo = Ext.extend(Ext.form.ComboBox, {
        map: null,
        tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale + 0.5)]}</div></tpl>',
        editable: false,
        width: 130,
        listWidth: 120,
        emptyText: __('Scale'),
        tooltip: __('Scale'),
        triggerAction: 'all',
        mode: 'local',
        initComponent: function () {
            Heron.widgets.ScaleSelectorCombo.superclass.initComponent.apply(this, arguments);
            this.store = new GeoExt.data.ScaleStore({
                    map: this.map
                });
            for (var i = 0; i < this.store.getCount(); i++) {
                this.store.getAt(i).data.formattedScale = parseInt(this.store.getAt(i).data.scale + 0.5);
            }
            this.on('select', function (combo, record, index) {
                    this.map.zoomTo(record.data.level);
                }, this);
            this.map.events.register('zoomend', this, this.zoomendUpdate);
            this.map.events.triggerEvent("zoomend");
        },
        listeners: {
            render: function (c) {
                c.el.set({
                        qtip: this.tooltip
                    });
                c.trigger.set({
                        qtip: this.tooltip
                    });
            }
        },
        zoomendUpdate: function (record) {
            var scale = this.store.queryBy(function (record) {
                    return this.map.getZoom() == record.data.level;
                });
            if (scale.length > 0) {
                scale = scale.items[0];
                this.setValue("1 : " + parseInt(scale.data.scale + 0.5));
            } else {
                if (!this.rendered) {
                    return;
                }
                this.clearValue();
            }
        },
        beforeDestroy: function () {
            this.map.events.unregister('zoomend', this, this.zoomendUpdate);
            Heron.widgets.ScaleSelectorCombo.superclass.beforeDestroy.apply(this, arguments);
        }
    });
Ext.reg('hr_scaleselectorcombo', Heron.widgets.ScaleSelectorCombo);
Ext.namespace("Heron.widgets.search");
Heron.widgets.search.GeocoderCombo = Ext.extend(Ext.form.ComboBox, {
        map: null,
        emptyText: __('Search'),
        loadingText: __('Loading...'),
        srs: "EPSG:4326",
        zoom: 10,
        layerOpts: undefined,
        queryDelay: 200,
        valueField: "bounds",
        displayField: "name",
        locationField: "lonlat",
        url: "http://nominatim.openstreetmap.org/search?format=json",
        queryParam: "q",
        minChars: 3,
        hideTrigger: true,
        tooltip: __('Search'),
        initComponent: function () {
            if (this.map) {
                this.setMap(this.map);
            }
            if (Ext.isString(this.srs)) {
                this.srs = new OpenLayers.Projection(this.srs);
            }
            if (!this.store) {
                this.store = new Ext.data.JsonStore({
                        root: null,
                        fields: [{
                                name: "name",
                                mapping: "display_name"
                            }, {
                                name: "bounds",
                                convert: function (v, rec) {
                                    var bbox = rec.boundingbox;
                                    return [bbox[2], bbox[0], bbox[3], bbox[1]];
                                }
                            }, {
                                name: "lonlat",
                                convert: function (v, rec) {
                                    return [rec.lon, rec.lat];
                                }
                            }
                        ],
                        proxy: new Ext.data.ScriptTagProxy({
                                url: this.url,
                                callbackParam: "json_callback"
                            })
                    });
            }
            this.on({
                    added: this.handleAdded,
                    select: this.handleSelect,
                    focus: function () {
                        this.clearValue();
                        this.removeLocationFeature();
                    },
                    scope: this
                });
            return Heron.widgets.search.GeocoderCombo.superclass.initComponent.apply(this, arguments);
        },
        handleAdded: function () {
            if (!this.map) {
                this.setMap(Heron.App.getMap());
            }
        },
        handleSelect: function (combo, rec) {
            var value = this.getValue();
            if (Ext.isArray(value)) {
                var mapProj = this.map.getProjectionObject();
                delete this.center;
                delete this.locationFeature;
                if (this.zoom < 0) {
                    this.map.zoomToExtent(OpenLayers.Bounds.fromArray(value).transform(this.srs, mapProj));
                } else {
                    this.map.setCenter(OpenLayers.LonLat.fromArray(value).transform(this.srs, mapProj), Math.max(this.map.getZoom(), this.zoom));
                }
                this.center = this.map.getCenter();
                var lonlat = rec.get(this.locationField);
                if (this.layer && lonlat) {
                    var geom = new OpenLayers.Geometry.Point(this.center.lon, this.center.lat).transform(this.srs, mapProj);
                    this.locationFeature = new OpenLayers.Feature.Vector(geom, rec.data);
                    this.layer.addFeatures([this.locationFeature]);
                    var vm = this.map.getLayersByName(this.layer);
                    if (vm.length === 0) {
                        this.layer.setVisibility(true);
                    }
                }
                var lropts = this.layerOpts;
                if (lropts) {
                    var map = Heron.App.getMap();
                    for (var l = 0; l < lropts.length; l++) {
                        if (lropts[l]['layerOn']) {
                            var mapLayers = map.getLayersByName(lropts[l]['layerOn']);
                            for (var n = 0; n < mapLayers.length; n++) {
                                if (mapLayers[n].isBaseLayer) {
                                    map.setBaseLayer(mapLayers[n]);
                                } else {
                                    mapLayers[n].setVisibility(true);
                                }
                                if (lropts[l]['layerOpacity']) {
                                    mapLayers[n].setOpacity(lropts[l]['layerOpacity']);
                                }
                            }
                        }
                    }
                }
            }
            (function () {
                    this.triggerBlur();
                    this.el.blur();
                }).defer(100, this);
        },
        removeLocationFeature: function () {
            if (this.locationFeature) {
                this.layer.destroyFeatures([this.locationFeature]);
            }
        },
        clearResult: function () {
            if (this.center && !this.map.getCenter().equals(this.center)) {
                this.clearValue();
            }
        },
        setMap: function (map) {
            if (map instanceof GeoExt.MapPanel) {
                map = map.map;
            }
            this.map = map;
            map.events.on({
                    "moveend": this.clearResult,
                    scope: this
                });
        },
        addToMapPanel: Ext.emptyFn,
        beforeDestroy: function () {
            this.map.events.un({
                    "moveend": this.clearResult,
                    scope: this
                });
            this.removeLocationFeature();
            delete this.map;
            delete this.layer;
            delete this.center;
            Heron.widgets.search.GeocoderCombo.superclass.beforeDestroy.apply(this, arguments);
        },
        listeners: {
            render: function (c) {
                c.el.set({
                        qtip: this.tooltip
                    });
                c.trigger.set({
                        qtip: this.tooltip
                    });
            }
        }
    });
Ext.reg("hr_geocodercombo", Heron.widgets.search.GeocoderCombo);
Heron.version = '0.73rc3';