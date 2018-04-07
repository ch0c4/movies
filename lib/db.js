"use strict";

var postgres = require('pg');
var config = require('config');

var Pg = function() {
    this.connectionString = config.get('database_url');
    this.client = false;
};

Pg.prototype.connect = function() {
    var that = this;
    return new Promise((resolve, reject) => {
        that.client = new postgres.Client(that.connectionString);
        that.client.connect().then(() => {
            console.log("Connected to " + config.get('database_url'));
            resolve();
        }, (err) => {
            console.error(err);
            reject(err);
        });
    });
};

Pg.prototype.executeQuery = function(query) {
    var that = this;
    return new Promise((resolve, reject) => {
        that.client.query(query, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
};

Pg.prototype.executeQueryWithData = function(query, data) {
    var that = this;
    return new Promise((resolve, reject) => {
        that.client.query(query, data, (err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}

module.exports = Pg;