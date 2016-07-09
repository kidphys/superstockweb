  function login_facebook(ref) {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });

    return ref;
  }

  /**
  Global setting mode
  */
  var filter_symbols = ['VND', 'SSI'];
  var slider_settings;
  var symbol_mode = false;


  function fetch_data_dynamically() {
    console.log('Start loading');
    $.mobile.loading('show');

    fetch_metadata(function(fields, titles, format) {
      console.log('Fetching meta data done');

      var column_settings = create_settings_with_format(fields, titles, format);

      /**
      Building mobile filter
      */
      slider_settings = create_filter_settings(column_settings);
      console.log('Slider settings', slider_settings);
      build_mobile_filter_panel('#filter_panel', slider_settings, function(slider) {
        slider_settings = slider_settings;
        var args = settings_to_args(slider_settings);
        console.log('updateFilter', args);
        slick.updateFilter(args);
      });
      $.mobile.changePage('#superstock_page');

      /**
      Build grid
      */
      slick = build_slick_grid('#myGrid', build_columns_with_titles(column_settings));

      /**
      Fetch data
      */
      fetch_realtime_price(function(data_arr) {
        console.log('Fetching price done');
        var items = build_json_array(fields, data_arr);
        slick.update(items);
      })
    });

  }

  var ref = new Firebase("https://superstock.firebaseio.com");

  var auth = Auth();
  auth.bind('#login',
    function login() {
      fetch_data_dynamically();
    },
    function logout() {
    });


  /**
  Sample to build a new grid
  */
  function build_summary_table() {
      var fields = ['symbol', 'eps', 'lnst', 'score'];
      var titles = ['Mã', 'EPS', 'LNST', 'Điểm'];
      var format = ['number', 'number', 'number', 'number'];
      var column_settings = create_settings_with_format(fields, titles, format);
      var slick = build_slick_grid('#summary_grid', build_columns_with_titles(column_settings));
      var items = build_json_array(fields, []);
      slick.update(items);
  }

  function refreshSymbolFilter() {
    slick.filterRowIn(filter_symbols, 'symbol');
  }
  function refreshSliderFilter() {
    var args = settings_to_args(slider_settings);
    console.log('updateFilter', args);
    slick.updateFilter(args);
  }

  $('#summary_page').click(function(){
    symbol_mode = !symbol_mode;
    if(symbol_mode) {
      refreshSymbolFilter();
    }
    else{
      refreshSliderFilter();
    }
  });

  $(document).ready(function() {
      function update_regularly() {
        setInterval(function() {
          for(var i = 0; i < items.length; i++) {
            items[i].accumulatedVol = Math.round(Math.random() * 5000000);
          }
          console.log('updating', items[0], items[0].accumulatedVol);
          slick.update(items);
        }, 2000);
      }
      // update_regularly();
  });