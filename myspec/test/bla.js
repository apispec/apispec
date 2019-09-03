const assert = require('assert');

const { request, cfg } = require('@apispec/runner');

console.log('CFG', cfg);

const sut = request('https://services.interactive-instruments.de/t14/wfs3/daraa');

describe('OGC API', function () {

    describe({
        title: 'Landing Page',
        description: 'Requirement 2',
        noFile: true
    }, function () {

        it('GET should return 200', function (done) {
            sut
                .context(this)
                .get('/')
                .query({ f: 'json' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);

        });

        it('should return 0 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), 0);
        });

    });

});
