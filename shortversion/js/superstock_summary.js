
/**
Depends on jQuery
*/

function render_table(id, rows) {
    console.log('render start');
    var $body = $(id + '>tbody');
    $body.empty();
    for(var i = 0; i < rows.length; i++) {
        $body.append(render_row(rows[i]))
    }
    console.log('render done', $body);
}

function render_row(row) {
    return "<tr>" +
        "<td>" + row.Symbol + "</td>" +
        "<td>" + row.EPS + "</td>" +
        "<td>" + row.LNST + "</td>" +
        "<td>" + row.Score + "</td>" +
            "</tr>";
}

function pipe_to_stock_object(text) {
    var arr = text.split('|');
    return {
        Symbol: arr[0],
        EPS: arr[1],
        LNST: arr[2],
        Score: arr[3],
    }
}

function sync_with_firebase() {
    var ref = new Firebase("https://superstock.firebaseio.com");
    ref.child('longterm').on('value', function(data){
        var obj = data.val();
        var rows = Object.keys(obj).map(function(symbol) {
            return pipe_to_stock_object(obj[symbol])
        });
        console.log('Loaded ', rows)
        render_table('#longterm', rows);
    });
}
