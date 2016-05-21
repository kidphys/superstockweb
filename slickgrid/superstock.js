
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