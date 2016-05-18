
console.log('loggin in');

function creatUser() {
  var ref = new Firebase("https://superstock.firebaseio.com");
  ref.createUser({
    email    : "kidphys@gmail.com",
    password : "thisisapassword"
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}

function query() {
    var ref = new Firebase("https://superstock.firebaseio.com");
    setInterval(function() {
      ref.child('stocks').on('value', function(snapshot) {
          console.log('Data loaded', snapshot.val());
      });
    }, 1000);
}

function login() {
    var ref = new Firebase("https://superstock.firebaseio.com");
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        setInterval(function(){
            ref.child('stocks/VND').on('value', function(snapshot) {
                console.log('Data loaded', snapshot.val());
            });
        }, 1000);
      }
    });
}

function sync() {
  var secret = 'AwPTWX6kgpR43xlMX0B7QUy7KKPKYjZNPY0TXBKi';
  var ref = new Firebase("https://superstock.firebaseio.com");
  ref.authWithCustomToken(secret, function(error, result) {
      if (error) {
        console.log("Authentication Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", result.auth);
        console.log("Auth expires at:", new Date(result.expires * 1000));
        setInterval(function() {
          ref.child('superstocks').on('value', function(snapshot) {
            console.log('Data loaded', snapshot.val());
            display(snapshot.val());
          });
        }, 3000);
      }
  });
}

function display(snapshot) {
  var $tbody = $('tbody');
  $tbody.html('');
  var fields = ['Symbol', 'EPS', 'LNST', 'Score'];
  Object.keys(snapshot).map(function(key) {
    var rowHtml = '';
    for(var i = 0; i < fields.length; i++) {
      var field = fields[i];
      rowHtml += '<td>' + snapshot[key][field] + '</td>';
    }
    $tbody.append($('<tr/>').html(rowHtml));
  });
}

$(document).ready(function() {
  console.log('Loggin...');
  sync();
});
// $('#login').on('click', function() {
//     login();
// });

