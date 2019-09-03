
const { agent, Test } = require('supertest');
const addContext = require('mochawesome/addContext');



agent.prototype.context = function (context) {
    this.context = context;
    return this;
}


var methods = require('methods');


// override HTTP verb methods
methods.forEach(function (method) {
    var original = agent.prototype[method];
    //console.log('ORIG', original);
    agent.prototype[method] = function (url, fn) { // eslint-disable-line no-unused-vars
        var req = original.call(this, url, fn);

        req.context = this.context;

        //console.log('REQ', req);

        return req;
    };
});


const originalAssert = Test.prototype.assert;

//console.log('ASS', Test.prototype)

Test.prototype.assert = function (resError, res, fn) {
    //console.log('THIS', this);
    console.log('METHOD', res.request.method);
    console.log('URL', res.request.url);
    console.log('HEADER', res.request.header);

    const request = res.request.method + ' ' + res.request.url;

    if (this.context) {
        addContext(this.context, {
            title: 'Request',
            value: request
        });
        addContext(this.context, {
            title: 'Response',
            value: ''
        });
    }


    originalAssert.call(this, resError, res, fn);
}

module.exports = { request: agent, cfg: { todo: '' } }
