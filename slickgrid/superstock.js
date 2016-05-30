/**
All my functions is in underscore,
while the rest is in CamelCase
*/


/**
Turing a settings list to obj,
comfort to slickgrid
*/
function settings_to_args(settings) {
    return settings.reduce(function(obj, slider) {
      obj[slider.target] = obj[slider.target] || 0;
      obj[slider.target] = slider.value * slider.multiply;
      return obj;
    }, {});
}

function create_settings() {
    var slider_settings = [
        {id: 'slider-matchedPrice', value: 10, max: 200, label: 'Giá', target: 'matchPrice', multiply: 1},
        {id: 'slider-EPS', value: 10, max: 200, label: 'EPS', target: 'EPS', multiply: 1},
        {id: 'slider-accumulatedVol', value: 500, max: 20000, label: 'Giá trị giao dịch (nghìn)', target: 'accumulatedVol', multiply: 1000},
    ];
    return slider_settings;
}


/**
Build a slider control panel, *require* jquery mobile slider
*Require* jQuery mobile
Better theme & mobile friendly

ALSO: there should be only 1 page
*/
function build_mobile_filter_panel(id, settings, callback) {

    function _slider_template(options) {
        var template =
                '<label for="' + options.id + '">' + options.label + '</label> \
                <input type="range" name="slider-fill" id="' + options.id + '" value="' + options.value +
                '" min="0" max="' + options.max + '" data-highlight="true">';
        return $(template);
    }

    var built = false; // work around jQuery mobile call pagebeforechange twice
    var $target = $(id);

    $(document).bind('pagebeforechange', function(e, data){
        if(!built) {
            console.log('Page Before Changed, appending slider', e, data);
            for(var i = 0; i < settings.length; i++) {
                var slider_setting = settings[i];
                var $slider = _slider_template(slider_setting);
                $target.append($slider);
            }
            built = true;
        }
    });

    $(document).bind('pagechange', function(e, data) {
        /**
        After enhancement, somehow all event handlers dropped.
        Hence putting enhanceWithin() before binding event handlers help retained them
        */
        $target.enhanceWithin();
        console.log('Page changed, binding event to slider', data.toPage.attr('id'));
        for(var i = 0; i < settings.length; i++) {
            (function(slider) {
                var $slider = $('#' + slider.id);
                console.log('Binding slider', $slider);
                $slider.on('change', function() {
                    console.log('slider changed', $slider);
                    slider.value = $slider.val();
                    callback(slider);
                });
            })(settings[i]);
        }
    });

    $(document).bind('pageshow', function(e, data) {
        console.log('pageshow');
    });

    $(document).bind('pagebeforecreate', function(e, data) {
        console.log('pagebeforecreate');
    });

    $(document).bind('pagecreate', function(e, data) {
        console.log('pagecreate');
    });

    $(document).bind('pagecontainershow', function(e, data) {
        console.log('pagecontainershow');
    });
}

/**
Old method
*/
function attach_mobile_filter_panel(settings, callback) {
    for(var i = 0; i < settings.length; i++) {
        (function(slider) {
            var $slider = $(slider.id).bind('change', function() {
                slider.value = $slider.val();
                callback(slider.key, slider);
            });
        })(settings[i]);
    }
}

/**
Build a slider control panel, *require* jquery slider

settings is:
{
    filter1: {max: Number, current: Number},
    filter2: {max: Number, current: Number},
    filter3: {max: Number, current: Number},
}

Use as: build_control_panel('#panel', {}, callback);
*/
function build_control_panel(id, setting, callback) {
    var $target = $(id);
    for(var key in filterValue) {
        (function(key) {
            var $span = $('<span></span>');
            $target.append($span);
            $span.slider({
                   value: setting[key].value || 0,
                   max: setting[key].max || 1000000,
                   animate: true,
                   orientation: 'vertical',
                   slide: function(event, ui) {
                       setting[key].value = ui.value;
                       callback(key, ui.value);
                   }
            });
        })(key);
    }
}

/**
This is handy for building UI & testing
*/
function fetch_fields(field, callback) {
    var ref = new Firebase("https://superstock.firebaseio.com");
    ref.child(field).on('value', function(snapshot) {
        callback(snapshot.val().split('|'));
    });
}

function fetch_realtime_price(callback) {
    console.log('Loading firebase instance');
    var ref = new Firebase("https://superstock.firebaseio.com");
    ref.child('superstock_fields').on('value', function(field_snapshot) {
        var fields = field_snapshot.val()['symbol'].split('|');
        console.log('Loading fields done', fields);
        ref.child('superstock_titles').on('value', function(titles) {
            titles = titles.val()['Mã'].split('|');
            console.log('Loading titles done', titles);
            ref.child('superstock').on('value', function(data_snapshot){
                var data = data_snapshot.val();
                if(!data) {
                    throw 'There is no data to process';
                }
                var data_arr = Object.keys(data).map(function(key) {
                    return data[key].split('|');
                });
                console.log('Loading price data done', data_arr);
                callback(fields, data_arr, titles);
            });
        })
    });
}

function number_formatter(row, cell, value, columnDef, dataContext) {
    if(!isNaN(Number(value))) {
        return Number(value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return value;
}

/**
Similar to build_columns but with both fields and nicely display titles
*/
function build_columns_with_titles(fields) {
    return fields.map(function(f) {
        return {
            id: f.id,
            name: f.name,
            field: f.field,
            behavior: "select",
            cssClass: "cell-selection",
            width: 80,
            cannotTriggerInsert: true,
            resizable: true,
            selectable: false,
            sortable: true,
            defaultSortAsc: false,
            formatter: number_formatter,
        };
    });
}

function build_columns(fields) {
    return fields.map(function(f) {
        return {
            id: f,
            name: f,
            field: f,
            behavior: "select",
            cssClass: "cell-selection",
            width: 80,
            cannotTriggerInsert: true,
            resizable: true,
            selectable: false,
            sortable: true,
            defaultSortAsc: false,
            formatter: number_formatter,
        };
    });
}

function process(field_str, data) {
    var arr_obj = build_json_array(fields, data);
    return arr_obj;
}

function build_json_array(fields, data) {
    var res = [];
    for(var i = 0; i < data.length; i++) {
        var row = data[i];
        var obj = {id: i};
        for(var j = 0; j < fields.length; j++) {
            obj[fields[j]] = row[j];
        }
        res.push(obj);
    }
    return res;
}
