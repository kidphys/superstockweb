(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var phonecatApp = angular.module('superstock', ['smart-table', 'firebase']);

phonecatApp.controller('super-table', ['$scope', '$filter', '$firebaseArray', function (scope, filter, firebaseArray) {

    var longtermRef = new Firebase("https://superstock.firebaseio.com/longterm");
    scope.longterm = firebaseArray(longtermRef);
    var shortermRef = new Firebase("https://superstock.firebaseio.com/shortterm");
    scope.shorterm = firebaseArray(shortermRef);
    var superstockRef = new Firebase("https://superstock.firebaseio.com/superstock");
    scope.superstock = firebaseArray(superstockRef);
}]);

},{}]},{},[1]);
