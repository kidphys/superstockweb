/**
All my functions is in underscore,
while the rest is in CamelCase
*/

/**
Build a slider control panel, *require* jquery mobile slider
*Require* jQuery mobile
Better theme & mobile friendly
*/
function _slider_template(slider_settings) {
    var template =
            '<label for="' + slider_settings.id + '">' + slider_settings.label + '</label> \
            <input type="range" name="slider-fill" id="' + slider_settings.id + '" value="' + slider_settings.value +
            '" min="0" max="' + slider_settings.max + '" step="50" data-highlight="true">';
    return $(template);
}

function build_mobile_filter_panel(id, settings) {
    var $target = $(id);
    for(var i = 0; i < settings.length; i++) {
        var slider_setting = settings[i];
        var $slider = _slider_template(slider_setting);
        $target.append($slider);
    }
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

function load_realtime_price(callback) {
    console.log('Loading firebase instance');
    var ref = new Firebase("https://superstock.firebaseio.com");
    ref.child('Fields').on('value', function(field_snapshot) {
        var fields = field_snapshot.val()['Symbol'].split('|');
        ref.child('Realtime').on('value', function(data_snapshot){
            var data = data_snapshot.val();
            var data_arr = Object.keys(data).map(function(key) {
                return data[key].split('|');
            });
            callback(fields, data_arr);
        });
    });
}

function number_formatter(row, cell, value, columnDef, dataContext) {
    if(!isNaN(Number(value))) {
        return Number(value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return value;
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