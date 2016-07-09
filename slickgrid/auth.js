/**
Authentication module

Depends on jQuery
*/

function Auth() {
    var is_logged_in = false;
    var ref = new Firebase("https://superstock.firebaseio.com");

    function is_login(success_callback, not_yet_callback) {
        ref.onAuth(function(authData) {
            if(authData) {
                success_callback(authData);
            }
            else{
                not_yet_callback();
            }
        });
    }

    function login_facebook(success_callback, error_callback) {
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
            error_callback(error)
          } else {
            console.log("Authenticated successfully with payload:", authData);
            success_callback();
          }
        });
    }

    function logout() {
        ref.unauth();
    }

    function bind_login_click($target, login_callback, logout_callback) {
        $target.click(function() {
            console.log('Clicked ', is_logged_in);
            if(is_logged_in) {
                logout();
                is_logged_in = false;
                logout_callback();
            }
            else{
                login_facebook(function() {
                    is_logged_in = true;
                    login_callback();
                }, function() {
                    is_logged_in = false;
                    logout_callback();
                });
            }
        })
    }

    return {
        /**
        Bind facebook login to a link
        */
        bind: function(id, login_callback, logout_callback) {
            var $target = $(id);
            bind_login_click($target,
                function success() {
                    login_callback();
                },
                function logout() {
                    logout_callback();
                    $target.find('span').text('Đăng nhập');
                    $('#user_fullname').empty();
                });

            is_login(
                function success(authData) {
                    is_logged_in = true;
                    login_callback();
                    $target.find('span').text('Đăng xuất');
                    $('#user_fullname').text('Xin chào, ' + authData.facebook.displayName);
                    $('#user_avatar').attr('src', authData.facebook.profileImageURL);
                },
                function not_yet() {
                    is_logged_in = false;
                    logout_callback();
                    $target.find('span').text('Đăng nhập');
                    $('#user_fullname').empty();
                    $('#user_avatar').attr('src', '');
                }
            );
        }
    }
}

