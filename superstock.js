var phonecatApp = angular.module('superstock', ['smart-table', 'firebase']);

phonecatApp.controller('super-table',
    ['$scope', '$filter', '$firebaseArray', function(scope, filter, firebaseArray) {


        var longtermRef = new Firebase("https://superstock.firebaseio.com/longterm");
        scope.longterm = firebaseArray(longtermRef);
        var shortermRef = new Firebase("https://superstock.firebaseio.com/shortterm");
        scope.shorterm = firebaseArray(shortermRef);
        var superstockRef = new Firebase("https://superstock.firebaseio.com/superstock");
        scope.superstock = firebaseArray(superstockRef);

    }]);

