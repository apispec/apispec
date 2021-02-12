import fs from 'fs-extra';
import { resolve } from 'path';
// var forEach from 'for-each');
import klawSync from 'klaw-sync';
import jsonfile from 'jsonfile';
import Mocha from 'mocha';
// require('mocha-clean');
import config from '../cfg/config.js';

import reporter from './reporter.js';

const report = 'report/index.json';

function run(emit, opts) {
    const cfg = resolve(config.projectDir, '.mocharc.json');
    console.log(cfg);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const userOptions = fs.readJSONSync(cfg);

    const options = {
        ...userOptions,
        ...opts,
        reporterOptions: {
            reportDir: 'report',
            reportFilename: 'index',
            inline: true,
            code: true,
            charts: true,
            // TODO: does not work
            saveJson: false,
            saveHtml: 'false',
            htmlModule: '@apispec/report',
        },
    };

    console.log(
        '@apispec/core v%s (options: %s)',
        '???',
        JSON.stringify(options)
    );
    console.log('---------------');

    /* var options = {
        reporter: 'mochawesome'//reporter.mochawesome
    };
    options = Object.assign(options, opts);
*/
    const mocha = new Mocha(options);

    // TODO: delete hooks in barista-package
    // delete require.cache[path.resolve('../barista-package/src/init.js')]
    // TODO: if shared state should be persisted between runs (which might make sense when running one test at a time)
    // we cannot delete common.js from cache
    // beware that common.js is the only import for init.js
    // delete require.cache[path.resolve('../barista-package/src/common.js')]
    // delete require.cache[path.resolve('../barista-package/src/hook.js')]
    // delete require.cache[path.resolve('../barista-package/index.js')]
    const specDir = resolve(config.projectDir, 'spec');

    fs.access(specDir, fs.R_OK, (err) => {
        if (err) {
            console.error('ERROR', specDir);
            emit('action', {
                type: 'mochaui/report',
                data: initialReportState,
            });
        } else {
            // Add each .js file to the mocha instance
            klawSync(specDir, {
                nodir: true,
                filter: ({ path }) =>
                    path.substr(-3) === '.js' || path.substr(-4) === '.mjs',
            }).forEach(({ path }) => {
                // TODO: delete hooks in barista-package
                // delete require.cache[path.resolve(file)]
                mocha.addFile(path);
                console.log(path);
            });

            mocha
                .loadFilesAsync()
                .then(() =>
                    mocha.run((failures) => {
                        console.log('done');

                        jsonfile.readFile(report, (err, obj) => {
                            if (obj) {
                                emit('action', {
                                    type: 'mochaui/report',
                                    data: obj,
                                });
                            } else {
                                emit('action', {
                                    type: 'mochaui/report',
                                    data: { reportTitle: 'barista error' },
                                });
                            }
                        });

                        mocha.unloadFiles();
                    })
                )
                .catch((error) => console.error('ERROR', error));
        }
    });
}

export default {
    onConnect(emit) {
        reporter.onEnd((obj) => {
            console.log('reported');
            emit('action', {
                type: 'mochaui/report',
                payload: obj,
            });
        });
    },
    onAction(action, emit) {
        switch (action.type) {
            // TODO: run this automatically on startup, not triggered by client
            case 'mocha/init':
                console.log('sending initial report');

                run(emit, {
                    grep: '__DO__NOT_RUN_ANY_TESTS',
                });

                /* fs.access(report, fs.constants.R_OK, (err) => {
                    if (err) {
                        emit('action', { type: 'mochaui/report', data: { reportTitle: 'barista' } });
                        return;
                    } */
                /* jsonfile.readFile(report, function(err, obj) {
                        if (obj) {
                            emit('action', { type: 'mochaui/report', data: obj });
                        } else {
                            emit('action', { type: 'mochaui/report', data: { reportTitle: 'barista error' } });
                        }
                    }) */
                // });

                break;
            case 'mocha/run':
                console.log('running with options: ', action.payload);
                run(emit, action.payload || {});
                break;
            default:
                break;
        }
    },
};

const initialReportState = {
    reportTitle: 'XtraProxy E2E Tests v0.1.0',
    inlineAssets: true,
    stats: {
        suites: 3,
        tests: 7,
        passes: 2,
        pending: 4,
        failures: 1,
        start: '2016-11-14T18:32:16.486Z',
        end: '2016-11-14T18:32:16.597Z',
        duration: 111,
        testsRegistered: 7,
        passPercent: 66.7,
        pendingPercent: 57.1,
        other: 0,
        hasOther: false,
        skipped: 0,
        hasSkipped: false,
        passPercentClass: 'warning',
        pendingPercentClass: 'warning',
    },
    suites: {
        title: 'XtraProxy E2E Tests v0.1.0',
        uuid: 'bla',
        ctx: {
            _runnable: {
                title: '"after each" hook: request logging',
                body:
                    "function () {\n\tthis.currentTest.requests = 'none';\n\tvar recentRequests = shared.requests.slice(0);\n\tshared.requests = [];\n\n\tif (recentRequests.length) {\n\t\tthis.currentTest.requests = prettyRequest(recentRequests[0]);\n\t}\n\n\tconsole.log('RLOG' , this.currentTest.requests);\n}",
                async: 0,
                sync: true,
                _timeout: 2000,
                _slow: 75,
                _enableTimeouts: true,
                timedOut: false,
                _trace: {},
                _retries: -1,
                _currentRetry: 0,
                pending: false,
                type: 'hook',
                parent: '[Circular ~.suites]',
                ctx: '[Circular ~.suites.ctx]',
                _events: {},
                _eventsCount: 1,
                duration: 0,
                _error: null,
            },
            test: {
                title: '"after each" hook: request logging',
                body:
                    "function () {\n\tthis.currentTest.requests = 'none';\n\tvar recentRequests = shared.requests.slice(0);\n\tshared.requests = [];\n\n\tif (recentRequests.length) {\n\t\tthis.currentTest.requests = prettyRequest(recentRequests[0]);\n\t}\n\n\tconsole.log('RLOG' , this.currentTest.requests);\n}",
                async: 0,
                sync: true,
                _timeout: 2000,
                _slow: 75,
                _enableTimeouts: true,
                timedOut: false,
                _trace: {},
                _retries: -1,
                _currentRetry: 0,
                pending: false,
                type: 'hook',
                parent: '[Circular ~.suites]',
                ctx: '[Circular ~.suites.ctx]',
                _events: {},
                _eventsCount: 1,
                duration: 0,
                _error: null,
            },
        },
        suites: [
            {
                title: 'Firstrun Form',
                suites: [],
                tests: [
                    {
                        title:
                            'should either redirect to manager or show firstrun start page',
                        fullTitle:
                            'Firstrun Form should either redirect to manager or show firstrun start page',
                        timedOut: false,
                        duration: 22,
                        state: 'passed',
                        speed: 'fast',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
                        isRoot: false,
                        uuid: 'f8c5ed13-dd2b-44d8-8fc1-fc430be35848',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should initialize instance',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should initialize instance',
                        timedOut: false,
                        duration: 1,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">this</span>.timeout(<span class="hljs-number">60000</span>);<br><span class="hljs-keyword">if</span> (shared.firstrun) {<br>    <span class="hljs-keyword">var</span> pageid = <span class="hljs-number">0</span>;<br>    <span class="hljs-keyword">return</span> next.call(<span class="hljs-keyword">this</span>, pageid)<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{                        <br>            <span class="hljs-comment">//err.showDiff =should. true</span><br>            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>            <span class="hljs-keyword">throw</span> err;<br>        })<br>} <br><span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        isRoot: false,
                        uuid: 'e909ded4-530a-4275-baa6-23fc6509e47e',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should initialize instance',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should initialize instance',
                        timedOut: false,
                        duration: 1,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">this</span>.timeout(<span class="hljs-number">60000</span>);<br><span class="hljs-keyword">if</span> (shared.firstrun) {<br>    <span class="hljs-keyword">var</span> pageid = <span class="hljs-number">0</span>;<br>    <span class="hljs-keyword">return</span> next.call(<span class="hljs-keyword">this</span>, pageid)<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{                        <br>            <span class="hljs-comment">//err.showDiff =should. true</span><br>            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>            <span class="hljs-keyword">throw</span> err;<br>        })<br>} <br><span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        isRoot: false,
                        uuid: 'e909ded4-530a-4275-baa6-23fc6509e47e',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [
                    {
                        title:
                            'should either redirect to manager or show firstrun start page',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should either redirect to manager or show firstrun start page',
                        timedOut: false,
                        duration: 22,
                        state: 'passed',
                        speed: 'fast',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
                        isRoot: false,
                        uuid: 'f8c5ed13-dd2b-44d8-8fc1-fc430be35848',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                failures: [],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 2,
                totalPasses: 1,
                totalFailures: 0,
                totalPending: 1,
                totalSkipped: 0,
                hasPasses: true,
                hasFailures: false,
                hasPending: true,
                hasSkipped: false,
                duration: 23,
            },
            {
                title: 'Authentication Form',
                suites: [],
                tests: [
                    {
                        title: 'should contain auth state',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                        timedOut: false,
                        duration: 43,
                        state: 'passed',
                        speed: 'medium',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                        isRoot: false,
                        uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                    {
                        title: 'should redirect with token for valid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                        timedOut: false,
                        duration: 36,
                        state: 'failed',
                        pass: false,
                        fail: true,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        err: {
                            name: 'AssertionError',
                            message:
                                'expected redirect with 30{1-3} status code but got 200',
                            stack:
                                'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                        },
                        isRoot: false,
                        uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                    {
                        title: 'should show error message for invalid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code: '',
                        isRoot: false,
                        uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should show error message for invalid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code: '',
                        isRoot: false,
                        uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [
                    {
                        title: 'should contain auth state',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                        timedOut: false,
                        duration: 43,
                        state: 'passed',
                        speed: 'medium',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                        isRoot: false,
                        uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                ],
                failures: [
                    {
                        title: 'should redirect with token for valid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                        timedOut: false,
                        duration: 36,
                        state: 'failed',
                        pass: false,
                        fail: true,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        err: {
                            name: 'AssertionError',
                            message:
                                'expected redirect with 30{1-3} status code but got 200',
                            stack:
                                'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                        },
                        isRoot: false,
                        uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                ],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 3,
                totalPasses: 1,
                totalFailures: 1,
                totalPending: 1,
                totalSkipped: 0,
                hasPasses: true,
                hasFailures: true,
                hasPending: true,
                hasSkipped: false,
                duration: 79,
            },
            {
                title: 'User Management',
                suites: [],
                tests: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [],
                failures: [],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 2,
                totalPasses: 0,
                totalFailures: 0,
                totalPending: 2,
                totalSkipped: 0,
                hasPasses: false,
                hasFailures: false,
                hasPending: true,
                hasSkipped: false,
                duration: 0,
            },
        ],
        tests: [],
        pending: false,
        _beforeEach: [],
        _beforeAll: [
            {
                title: '"before all" hook: init',
                body:
                    "function () {\n  console.log(e2e_mocha.description);\n\n  this.test.parent.title = e2e_mocha.description + ' v' + e2e_mocha.version\n  this.test.parent.file = e2e_mocha.parameters.url\n  this.test.parent.root = false\n}",
                async: 0,
                sync: true,
                _timeout: 2000,
                _slow: 75,
                _enableTimeouts: true,
                timedOut: false,
                _trace: {},
                _retries: -1,
                _currentRetry: 0,
                pending: false,
                type: 'hook',
                parent: '[Circular ~.suites]',
                ctx: {
                    _runnable: {
                        title: '"after each" hook: request logging',
                        body:
                            "function () {\n\tthis.currentTest.requests = 'none';\n\tvar recentRequests = shared.requests.slice(0);\n\tshared.requests = [];\n\n\tif (recentRequests.length) {\n\t\tthis.currentTest.requests = prettyRequest(recentRequests[0]);\n\t}\n\n\tconsole.log('RLOG' , this.currentTest.requests);\n}",
                        async: 0,
                        sync: true,
                        _timeout: 2000,
                        _slow: 75,
                        _enableTimeouts: true,
                        timedOut: false,
                        _trace: {},
                        _retries: -1,
                        _currentRetry: 0,
                        pending: false,
                        type: 'hook',
                        parent: '[Circular ~.suites]',
                        ctx: '[Circular ~.suites._beforeAll.0.ctx]',
                        _events: {},
                        _eventsCount: 1,
                        duration: 0,
                        _error: null,
                    },
                    test: {
                        title: '"after each" hook: request logging',
                        body:
                            "function () {\n\tthis.currentTest.requests = 'none';\n\tvar recentRequests = shared.requests.slice(0);\n\tshared.requests = [];\n\n\tif (recentRequests.length) {\n\t\tthis.currentTest.requests = prettyRequest(recentRequests[0]);\n\t}\n\n\tconsole.log('RLOG' , this.currentTest.requests);\n}",
                        async: 0,
                        sync: true,
                        _timeout: 2000,
                        _slow: 75,
                        _enableTimeouts: true,
                        timedOut: false,
                        _trace: {},
                        _retries: -1,
                        _currentRetry: 0,
                        pending: false,
                        type: 'hook',
                        parent: '[Circular ~.suites]',
                        ctx: '[Circular ~.suites._beforeAll.0.ctx]',
                        _events: {},
                        _eventsCount: 1,
                        duration: 0,
                        _error: null,
                    },
                },
                _events: {},
                _eventsCount: 1,
                duration: 1,
                _error: null,
            },
        ],
        _afterEach: [
            {
                title: '"after each" hook: request logging',
                body:
                    "function () {\n\tthis.currentTest.requests = 'none';\n\tvar recentRequests = shared.requests.slice(0);\n\tshared.requests = [];\n\n\tif (recentRequests.length) {\n\t\tthis.currentTest.requests = prettyRequest(recentRequests[0]);\n\t}\n\n\tconsole.log('RLOG' , this.currentTest.requests);\n}",
                async: 0,
                sync: true,
                _timeout: 2000,
                _slow: 75,
                _enableTimeouts: true,
                timedOut: false,
                _trace: {},
                _retries: -1,
                _currentRetry: 0,
                pending: false,
                type: 'hook',
                parent: '[Circular ~.suites]',
                ctx: {
                    _runnable: '[Circular ~.suites._afterEach.0]',
                    test: '[Circular ~.suites._afterEach.0]',
                },
                _events: {},
                _eventsCount: 1,
                duration: 0,
                _error: null,
            },
        ],
        _afterAll: [],
        root: false,
        _timeout: 2000,
        _enableTimeouts: true,
        _slow: 75,
        _retries: -1,
        _onlyTests: [],
        _onlySuites: [],
        delayed: false,
        _events: {
            'pre-require': [null, null],
        },
        _eventsCount: 1,
        file: 'http://localhost:7080',
    },
    allTests: [
        {
            title:
                'should either redirect to manager or show firstrun start page',
            fullTitle:
                'Firstrun Form should either redirect to manager or show firstrun start page',
            timedOut: false,
            duration: 22,
            state: 'passed',
            speed: 'fast',
            pass: true,
            fail: false,
            pending: false,
            code:
                '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
            isRoot: false,
            uuid: '195622ec-9a84-4f49-86ce-1398e02d52ac',
            parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
            requests: 'none',
            skipped: false,
        },
        {
            title: 'should initialize instance',
            fullTitle: 'Firstrun Form should initialize instance',
            timedOut: false,
            duration: 1,
            pass: false,
            fail: false,
            pending: true,
            code:
                '<span class="hljs-keyword">this</span>.timeout(<span class="hljs-number">60000</span>);<br><span class="hljs-keyword">if</span> (shared.firstrun) {<br>    <span class="hljs-keyword">var</span> pageid = <span class="hljs-number">0</span>;<br>    <span class="hljs-keyword">return</span> next.call(<span class="hljs-keyword">this</span>, pageid)<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{                        <br>            <span class="hljs-comment">//err.showDiff =should. true</span><br>            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>            <span class="hljs-keyword">throw</span> err;<br>        })<br>} <br><span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
            isRoot: false,
            uuid: '622adcd6-30d3-4b4a-9576-bf6d199743e6',
            parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
            requests: 'none',
            skipped: false,
        },
        {
            title: 'should contain auth state',
            fullTitle: 'Authentication Form should contain auth state',
            timedOut: false,
            duration: 43,
            state: 'passed',
            speed: 'medium',
            pass: true,
            fail: false,
            pending: false,
            code:
                '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
            isRoot: false,
            uuid: 'e14f370a-5d98-46a3-a1bc-ad9ac4baa7a8',
            parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
            requests:
                'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
            skipped: false,
        },
        {
            title: 'should redirect with token for valid login',
            fullTitle:
                'Authentication Form should redirect with token for valid login',
            timedOut: false,
            duration: 36,
            state: 'failed',
            pass: false,
            fail: true,
            pending: false,
            code:
                '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
            err: {
                name: 'AssertionError',
                message:
                    'expected redirect with 30{1-3} status code but got 200',
                stack:
                    'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
            },
            isRoot: false,
            uuid: 'bacf0dc3-063f-48ce-90ec-e2afb9da8424',
            parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
            requests:
                'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
            skipped: false,
        },
        {
            title: 'should show error message for invalid login',
            fullTitle:
                'Authentication Form should show error message for invalid login',
            timedOut: false,
            duration: 0,
            pass: false,
            fail: false,
            pending: true,
            code: '',
            isRoot: false,
            uuid: '6ded31d2-e179-434d-84f8-cc7cc284a89c',
            parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
            requests: 'none',
            skipped: false,
        },
        {
            title: 'should have empty user list',
            fullTitle: 'User Management should have empty user list',
            timedOut: false,
            duration: 0,
            pass: false,
            fail: false,
            pending: true,
            code:
                '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
            isRoot: false,
            uuid: '24f4a1bf-9f2b-4989-91df-95789aac26a2',
            parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
            requests: 'none',
            skipped: false,
        },
        {
            title: 'should have empty group list',
            fullTitle: 'User Management should have empty group list',
            timedOut: false,
            duration: 0,
            pass: false,
            fail: false,
            pending: true,
            code:
                '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
            isRoot: false,
            uuid: '111229db-d964-460a-9ce2-2756ac17d983',
            parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
            requests: 'none',
            skipped: false,
        },
    ],
    allPending: [
        {
            title: 'should initialize instance',
            body:
                "function () {\n        this.timeout(60000);\n\n        if (shared.firstrun) {\n            var pageid = 0;\n\n            return next.call(this, pageid)\n                .catch(function(err) {                        \n                    //err.showDiff =should. true\n                    console.log('error', err);\n                    throw err;\n                })\n        } \n        else {\n            this.skip();\n        }\n    }",
            async: 0,
            sync: true,
            _timeout: 60000,
            _slow: 75,
            _enableTimeouts: true,
            timedOut: false,
            _trace: {},
            _retries: -1,
            _currentRetry: 0,
            pending: true,
            type: 'test',
            file:
                '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
            parent: {
                title: 'Firstrun Form',
                suites: [],
                tests: [
                    {
                        title:
                            'should either redirect to manager or show firstrun start page',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should either redirect to manager or show firstrun start page',
                        timedOut: false,
                        duration: 22,
                        state: 'passed',
                        speed: 'fast',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
                        isRoot: false,
                        uuid: 'f8c5ed13-dd2b-44d8-8fc1-fc430be35848',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should initialize instance',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should initialize instance',
                        timedOut: false,
                        duration: 1,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">this</span>.timeout(<span class="hljs-number">60000</span>);<br><span class="hljs-keyword">if</span> (shared.firstrun) {<br>    <span class="hljs-keyword">var</span> pageid = <span class="hljs-number">0</span>;<br>    <span class="hljs-keyword">return</span> next.call(<span class="hljs-keyword">this</span>, pageid)<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{                        <br>            <span class="hljs-comment">//err.showDiff =should. true</span><br>            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>            <span class="hljs-keyword">throw</span> err;<br>        })<br>} <br><span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        isRoot: false,
                        uuid: 'e909ded4-530a-4275-baa6-23fc6509e47e',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should initialize instance',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should initialize instance',
                        timedOut: false,
                        duration: 1,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">this</span>.timeout(<span class="hljs-number">60000</span>);<br><span class="hljs-keyword">if</span> (shared.firstrun) {<br>    <span class="hljs-keyword">var</span> pageid = <span class="hljs-number">0</span>;<br>    <span class="hljs-keyword">return</span> next.call(<span class="hljs-keyword">this</span>, pageid)<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{                        <br>            <span class="hljs-comment">//err.showDiff =should. true</span><br>            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>            <span class="hljs-keyword">throw</span> err;<br>        })<br>} <br><span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        isRoot: false,
                        uuid: 'e909ded4-530a-4275-baa6-23fc6509e47e',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [
                    {
                        title:
                            'should either redirect to manager or show firstrun start page',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Firstrun Form should either redirect to manager or show firstrun start page',
                        timedOut: false,
                        duration: 22,
                        state: 'passed',
                        speed: 'fast',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
                        isRoot: false,
                        uuid: 'f8c5ed13-dd2b-44d8-8fc1-fc430be35848',
                        parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                failures: [],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 2,
                totalPasses: 1,
                totalFailures: 0,
                totalPending: 1,
                totalSkipped: 0,
                hasPasses: true,
                hasFailures: false,
                hasPending: true,
                hasSkipped: false,
                duration: 23,
            },
            ctx: {
                _runnable: '[Circular ~.allPending.0]',
                test: '[Circular ~.allPending.0]',
            },
            _events: {},
            _eventsCount: 1,
            duration: 1,
        },
        {
            title: 'should show error message for invalid login',
            body: '',
            sync: true,
            _timeout: 2000,
            _slow: 75,
            _enableTimeouts: true,
            timedOut: false,
            _trace: {},
            _retries: -1,
            _currentRetry: 0,
            pending: true,
            type: 'test',
            file:
                '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
            parent: {
                title: 'Authentication Form',
                suites: [],
                tests: [
                    {
                        title: 'should contain auth state',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                        timedOut: false,
                        duration: 43,
                        state: 'passed',
                        speed: 'medium',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                        isRoot: false,
                        uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                    {
                        title: 'should redirect with token for valid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                        timedOut: false,
                        duration: 36,
                        state: 'failed',
                        pass: false,
                        fail: true,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        err: {
                            name: 'AssertionError',
                            message:
                                'expected redirect with 30{1-3} status code but got 200',
                            stack:
                                'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                        },
                        isRoot: false,
                        uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                    {
                        title: 'should show error message for invalid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code: '',
                        isRoot: false,
                        uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should show error message for invalid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code: '',
                        isRoot: false,
                        uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [
                    {
                        title: 'should contain auth state',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                        timedOut: false,
                        duration: 43,
                        state: 'passed',
                        speed: 'medium',
                        pass: true,
                        fail: false,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                        isRoot: false,
                        uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                ],
                failures: [
                    {
                        title: 'should redirect with token for valid login',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                        timedOut: false,
                        duration: 36,
                        state: 'failed',
                        pass: false,
                        fail: true,
                        pending: false,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                        err: {
                            name: 'AssertionError',
                            message:
                                'expected redirect with 30{1-3} status code but got 200',
                            stack:
                                'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                        },
                        isRoot: false,
                        uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                        parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        requests:
                            'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                        skipped: false,
                    },
                ],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 3,
                totalPasses: 1,
                totalFailures: 1,
                totalPending: 1,
                totalSkipped: 0,
                hasPasses: true,
                hasFailures: true,
                hasPending: true,
                hasSkipped: false,
                duration: 79,
            },
            ctx: {
                _runnable: {
                    title: 'should redirect with token for valid login',
                    body:
                        "function () {\n        // TODO: use timeout for request to catch it\n        //this.timeout(30000);\n        // TODO: how are request exceptions handled\n        \n        if (shared && shared.auth_state/* check test environment */) {\n            \n            return request(baseUrl)\n                .post('/rest/auth/authorize/')\n                .send('AUTH_STATE=' + shared.auth_state)\n                .send('j_username=admin')\n                .send('j_password=admin')\n                .redirects(0)\n                .then(function(response) {\n                    response.should.redirect;\n                })\n                .catch(function(err) {\n                    if (err.status === 303) {\n                        err.response.should.redirect;\n                        err.response.should.have.a.header('location', new RegExp('^' + redirectUrl))\n                        var url = redirectUrl + '#access_token='\n                        var loc = err.response.header['location']\n                        loc.should.startWith(url)\n\n                        shared.token = loc.substring(url.length, loc.indexOf('&'));\n                    }\n                    else {\n                        //err.showDiff =should. true\n                        console.log('error', err);\n                        throw err;\n                    }\n                })\n        } else {\n            this.skip();\n        }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: false,
                    type: 'test',
                    file:
                        '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                    parent: {
                        title: 'Authentication Form',
                        suites: [],
                        tests: [
                            {
                                title: 'should contain auth state',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                                timedOut: false,
                                duration: 43,
                                state: 'passed',
                                speed: 'medium',
                                pass: true,
                                fail: false,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                                isRoot: false,
                                uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                            {
                                title:
                                    'should redirect with token for valid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                                timedOut: false,
                                duration: 36,
                                state: 'failed',
                                pass: false,
                                fail: true,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                                err: {
                                    name: 'AssertionError',
                                    message:
                                        'expected redirect with 30{1-3} status code but got 200',
                                    stack:
                                        'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                                },
                                isRoot: false,
                                uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                            {
                                title:
                                    'should show error message for invalid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code: '',
                                isRoot: false,
                                uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title:
                                    'should show error message for invalid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code: '',
                                isRoot: false,
                                uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [
                            {
                                title: 'should contain auth state',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                                timedOut: false,
                                duration: 43,
                                state: 'passed',
                                speed: 'medium',
                                pass: true,
                                fail: false,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                                isRoot: false,
                                uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                        ],
                        failures: [
                            {
                                title:
                                    'should redirect with token for valid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                                timedOut: false,
                                duration: 36,
                                state: 'failed',
                                pass: false,
                                fail: true,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                                err: {
                                    name: 'AssertionError',
                                    message:
                                        'expected redirect with 30{1-3} status code but got 200',
                                    stack:
                                        'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                                },
                                isRoot: false,
                                uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                        ],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 3,
                        totalPasses: 1,
                        totalFailures: 1,
                        totalPending: 1,
                        totalSkipped: 0,
                        hasPasses: true,
                        hasFailures: true,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 79,
                    },
                    ctx: '[Circular ~.allPending.1.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    timer: {
                        0: null,
                        _called: false,
                        _idleTimeout: -1,
                        _idlePrev: null,
                        _idleNext: null,
                        _idleStart: 562,
                        _onTimeout: null,
                        _repeat: null,
                    },
                    duration: 36,
                    state: 'failed',
                    err: {
                        name: 'AssertionError',
                        message:
                            'expected redirect with 30{1-3} status code but got 200',
                        showDiff: false,
                        actual: {
                            req: {
                                method: 'post',
                                url:
                                    'http://localhost:7080/rest/auth/authorize/',
                                data:
                                    'AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&j_username=admin&j_password=admin',
                                headers: {
                                    'user-agent': 'node-superagent/2.3.0',
                                    'content-type':
                                        'application/x-www-form-urlencoded',
                                },
                            },
                            header: {
                                date: 'Mon, 14 Nov 2016 18:32:16 GMT',
                                'content-type': 'text/html',
                                connection: 'close',
                            },
                            status: 200,
                            text:
                                '<!DOCTPYE html>\r\n<head>\r\n\r\n    <meta charset="UTF-8" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n    <!--meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"-->\r\n\r\n    <title>XtraProxy Service Manager</title>\r\n\r\n    <link rel="stylesheet" href="../../../css/fontawesome/css/font-awesome.min.css">\r\n    <link rel="stylesheet" href="../../../css/dbootstrap/theme/dbootstrap/dbootstrap.css">\r\n    <link rel="stylesheet" href="../../../css/xsf/theme.css">\r\n\r\n</head>\r\n\r\n<body class="dbootstrap">\r\n\r\n    <div id="container">\r\n\r\n        <div id="header">\r\n\r\n            <ul id="menu-language" class="top-menu">\r\n            </ul>                \r\n\r\n\r\n            <div id="logo">\r\n                <img src="../../../img/xsf/logo-32.png" width="221" height="32" alt="XtraProxy" />            \r\n            </div>\r\n\r\n\r\n\r\n\r\n            <ul id="menu" class="menu">\r\n\r\n            </ul>\r\n\r\n\r\n        </div>\r\n\r\n        <div id="content" class="clearfix">\r\n\r\n            <div class="page-header">\r\n      <h1>Login</h1>\r\n    </div>\r\n    <p style="color:red; font-weight:bold;">Authentication error!</p>\r\n    <form class="form-horizontal" id="registerHere" method="post"\r\n      action="../authorize/">\r\n      <fieldset>\r\n        <div class="control-group">\r\n          <label class="control-label">Username:</label>\r\n          <div class="controls">\r\n            <input type="text" class="input-xlarge" id="username"\r\n              name="j_username" rel="popover"\r\n              data-content="Enter your identifier."\r\n              data-original-title="Identifier" autofocus="autofocus"/>\r\n          </div>\r\n        </div>\r\n\r\n        <div class="control-group">\r\n          <label class="control-label">Password:</label>\r\n          <div class="controls">\r\n            <input type="password" class="input-xlarge" id="password"\r\n              name="j_password" rel="popover"\r\n              data-content="What\'s your password?"\r\n              data-original-title="Password" />\r\n          </div>\r\n        </div>\r\n        <input type="hidden" name="AUTH_STATE" value="e9ff673e-a8ba-4a36-941e-0f2f79ef8067" />\r\n      </fieldset>\r\n\r\n      <div class="form-actions">\r\n        <button type="submit" class="btn btn-primary">Login</button>\r\n      </div>\r\n    </form>\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <div id="footer" class="clearfix">\r\n\r\n        <div id="footer-wrapper">\r\n\r\n            <div class="copyright">\r\n                &copy;&nbsp;2014-2015<a href="http://www.interactive-instruments.de/" title="interactive instruments GmbH">\r\n                    interactive instruments GmbH            </a>\r\n            </div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n</body>\r\n</html>\r\n',
                        },
                        stack:
                            'AssertionError: expected redirect with 30{1-3} status code but got 200\n    at testxp/auth/spec_auth.js:64:36\n    at mocha-chai.js:89:21',
                    },
                    requests:
                        'POST /rest/auth/authorize/ HTTP/1.1\r\nHost: localhost:7080\r\nAccept-Encoding: gzip, deflate\r\nUser-Agent: node-superagent/2.3.0\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 81\r\nConnection: close\r\n\r\nAUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&j_username=admin&j_password=admin\n\nHTTP/1.1 200\ndate: Mon, 14 Nov 2016 18:32:16 GMT\ncontent-type: text/html\nconnection: close\n\n<!DOCTPYE html>\r\n<head>\r\n\r\n    <meta charset="UTF-8" />\r\n    <meta http-equiv="X-UA-Compatible" cont',
                },
                test: {
                    title: 'should redirect with token for valid login',
                    body:
                        "function () {\n        // TODO: use timeout for request to catch it\n        //this.timeout(30000);\n        // TODO: how are request exceptions handled\n        \n        if (shared && shared.auth_state/* check test environment */) {\n            \n            return request(baseUrl)\n                .post('/rest/auth/authorize/')\n                .send('AUTH_STATE=' + shared.auth_state)\n                .send('j_username=admin')\n                .send('j_password=admin')\n                .redirects(0)\n                .then(function(response) {\n                    response.should.redirect;\n                })\n                .catch(function(err) {\n                    if (err.status === 303) {\n                        err.response.should.redirect;\n                        err.response.should.have.a.header('location', new RegExp('^' + redirectUrl))\n                        var url = redirectUrl + '#access_token='\n                        var loc = err.response.header['location']\n                        loc.should.startWith(url)\n\n                        shared.token = loc.substring(url.length, loc.indexOf('&'));\n                    }\n                    else {\n                        //err.showDiff =should. true\n                        console.log('error', err);\n                        throw err;\n                    }\n                })\n        } else {\n            this.skip();\n        }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: false,
                    type: 'test',
                    file:
                        '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                    parent: {
                        title: 'Authentication Form',
                        suites: [],
                        tests: [
                            {
                                title: 'should contain auth state',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                                timedOut: false,
                                duration: 43,
                                state: 'passed',
                                speed: 'medium',
                                pass: true,
                                fail: false,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                                isRoot: false,
                                uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                            {
                                title:
                                    'should redirect with token for valid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                                timedOut: false,
                                duration: 36,
                                state: 'failed',
                                pass: false,
                                fail: true,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                                err: {
                                    name: 'AssertionError',
                                    message:
                                        'expected redirect with 30{1-3} status code but got 200',
                                    stack:
                                        'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                                },
                                isRoot: false,
                                uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                            {
                                title:
                                    'should show error message for invalid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code: '',
                                isRoot: false,
                                uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title:
                                    'should show error message for invalid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should show error message for invalid login',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code: '',
                                isRoot: false,
                                uuid: 'a0fb9e0f-f963-4596-89d8-5cce13a0e485',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [
                            {
                                title: 'should contain auth state',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should contain auth state',
                                timedOut: false,
                                duration: 43,
                                state: 'passed',
                                speed: 'medium',
                                pass: true,
                                fail: false,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
                                isRoot: false,
                                uuid: '9646bb69-394d-4778-a837-a1eefbab67e3',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                        ],
                        failures: [
                            {
                                title:
                                    'should redirect with token for valid login',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 Authentication Form should redirect with token for valid login',
                                timedOut: false,
                                duration: 36,
                                state: 'failed',
                                pass: false,
                                fail: true,
                                pending: false,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
                                err: {
                                    name: 'AssertionError',
                                    message:
                                        'expected redirect with 30{1-3} status code but got 200',
                                    stack:
                                        'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
                                },
                                isRoot: false,
                                uuid: 'a9cf27c7-fe47-4e17-9d6d-1214403fc4ae',
                                parentUUID:
                                    'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
                                requests:
                                    'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
                                skipped: false,
                            },
                        ],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 3,
                        totalPasses: 1,
                        totalFailures: 1,
                        totalPending: 1,
                        totalSkipped: 0,
                        hasPasses: true,
                        hasFailures: true,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 79,
                    },
                    ctx: '[Circular ~.allPending.1.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    timer: {
                        0: null,
                        _called: false,
                        _idleTimeout: -1,
                        _idlePrev: null,
                        _idleNext: null,
                        _idleStart: 562,
                        _onTimeout: null,
                        _repeat: null,
                    },
                    duration: 36,
                    state: 'failed',
                    err: {
                        name: 'AssertionError',
                        message:
                            'expected redirect with 30{1-3} status code but got 200',
                        showDiff: false,
                        actual: {
                            req: {
                                method: 'post',
                                url:
                                    'http://localhost:7080/rest/auth/authorize/',
                                data:
                                    'AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&j_username=admin&j_password=admin',
                                headers: {
                                    'user-agent': 'node-superagent/2.3.0',
                                    'content-type':
                                        'application/x-www-form-urlencoded',
                                },
                            },
                            header: {
                                date: 'Mon, 14 Nov 2016 18:32:16 GMT',
                                'content-type': 'text/html',
                                connection: 'close',
                            },
                            status: 200,
                            text:
                                '<!DOCTPYE html>\r\n<head>\r\n\r\n    <meta charset="UTF-8" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n    <!--meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"-->\r\n\r\n    <title>XtraProxy Service Manager</title>\r\n\r\n    <link rel="stylesheet" href="../../../css/fontawesome/css/font-awesome.min.css">\r\n    <link rel="stylesheet" href="../../../css/dbootstrap/theme/dbootstrap/dbootstrap.css">\r\n    <link rel="stylesheet" href="../../../css/xsf/theme.css">\r\n\r\n</head>\r\n\r\n<body class="dbootstrap">\r\n\r\n    <div id="container">\r\n\r\n        <div id="header">\r\n\r\n            <ul id="menu-language" class="top-menu">\r\n            </ul>                \r\n\r\n\r\n            <div id="logo">\r\n                <img src="../../../img/xsf/logo-32.png" width="221" height="32" alt="XtraProxy" />            \r\n            </div>\r\n\r\n\r\n\r\n\r\n            <ul id="menu" class="menu">\r\n\r\n            </ul>\r\n\r\n\r\n        </div>\r\n\r\n        <div id="content" class="clearfix">\r\n\r\n            <div class="page-header">\r\n      <h1>Login</h1>\r\n    </div>\r\n    <p style="color:red; font-weight:bold;">Authentication error!</p>\r\n    <form class="form-horizontal" id="registerHere" method="post"\r\n      action="../authorize/">\r\n      <fieldset>\r\n        <div class="control-group">\r\n          <label class="control-label">Username:</label>\r\n          <div class="controls">\r\n            <input type="text" class="input-xlarge" id="username"\r\n              name="j_username" rel="popover"\r\n              data-content="Enter your identifier."\r\n              data-original-title="Identifier" autofocus="autofocus"/>\r\n          </div>\r\n        </div>\r\n\r\n        <div class="control-group">\r\n          <label class="control-label">Password:</label>\r\n          <div class="controls">\r\n            <input type="password" class="input-xlarge" id="password"\r\n              name="j_password" rel="popover"\r\n              data-content="What\'s your password?"\r\n              data-original-title="Password" />\r\n          </div>\r\n        </div>\r\n        <input type="hidden" name="AUTH_STATE" value="e9ff673e-a8ba-4a36-941e-0f2f79ef8067" />\r\n      </fieldset>\r\n\r\n      <div class="form-actions">\r\n        <button type="submit" class="btn btn-primary">Login</button>\r\n      </div>\r\n    </form>\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <div id="footer" class="clearfix">\r\n\r\n        <div id="footer-wrapper">\r\n\r\n            <div class="copyright">\r\n                &copy;&nbsp;2014-2015<a href="http://www.interactive-instruments.de/" title="interactive instruments GmbH">\r\n                    interactive instruments GmbH            </a>\r\n            </div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n</body>\r\n</html>\r\n',
                        },
                        stack:
                            'AssertionError: expected redirect with 30{1-3} status code but got 200\n    at testxp/auth/spec_auth.js:64:36\n    at mocha-chai.js:89:21',
                    },
                    requests:
                        'POST /rest/auth/authorize/ HTTP/1.1\r\nHost: localhost:7080\r\nAccept-Encoding: gzip, deflate\r\nUser-Agent: node-superagent/2.3.0\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 81\r\nConnection: close\r\n\r\nAUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&j_username=admin&j_password=admin\n\nHTTP/1.1 200\ndate: Mon, 14 Nov 2016 18:32:16 GMT\ncontent-type: text/html\nconnection: close\n\n<!DOCTPYE html>\r\n<head>\r\n\r\n    <meta charset="UTF-8" />\r\n    <meta http-equiv="X-UA-Compatible" cont',
                },
            },
        },
        {
            title: 'should have empty user list',
            body:
                "function () {\n        // TODO: use timeout for request to catch it\n        //this.timeout(30000);\n        console.log('THIS2',shallowStringify(this));\n        // TODO: how are request exceptions handled\n        return get('')\n            /*.query({\n                SERVICE: 'WFS',\n                REQUEST: 'GetCapabilities'\n            })*/\n            .set('Authorization', 'bearer ' + shared.token)\n            .then(function(response) {\n                console.log('THIS3',shallowStringify(this));\n                response.should.have.status2(200);\n                response.should.be.json;\n                response.should.have.property('body').that.is.an('array').with.length(0);\n\n                return response;\n            }.bind(this))\n            /*.catch(function(err) {\n                            //err.showDiff = true;\n                            console.log('error', err);\n                            throw err;\n                        })*/\n            //.then(done, done);\n    }",
            async: 0,
            sync: true,
            _timeout: 2000,
            _slow: 75,
            _enableTimeouts: true,
            timedOut: false,
            _trace: {},
            _retries: -1,
            _currentRetry: 0,
            pending: true,
            type: 'test',
            file:
                '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
            parent: {
                title: 'User Management',
                suites: [],
                tests: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [],
                failures: [],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 2,
                totalPasses: 0,
                totalFailures: 0,
                totalPending: 2,
                totalSkipped: 0,
                hasPasses: false,
                hasFailures: false,
                hasPending: true,
                hasSkipped: false,
                duration: 0,
            },
            ctx: {
                _runnable: {
                    title: '"before all" hook',
                    body:
                        "function () {\n      if (shared && shared.token/* check test environment */) {\n        // setup code\n        //console.log('TOKEN %s', shared.token)\n      } else {\n        this.skip();\n      }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: true,
                    type: 'hook',
                    parent: {
                        title: 'User Management',
                        suites: [],
                        tests: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [],
                        failures: [],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 2,
                        totalPasses: 0,
                        totalFailures: 0,
                        totalPending: 2,
                        totalSkipped: 0,
                        hasPasses: false,
                        hasFailures: false,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 0,
                    },
                    ctx: '[Circular ~.allPending.2.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    duration: 0,
                    _error: null,
                },
                test: {
                    title: '"before all" hook',
                    body:
                        "function () {\n      if (shared && shared.token/* check test environment */) {\n        // setup code\n        //console.log('TOKEN %s', shared.token)\n      } else {\n        this.skip();\n      }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: true,
                    type: 'hook',
                    parent: {
                        title: 'User Management',
                        suites: [],
                        tests: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [],
                        failures: [],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 2,
                        totalPasses: 0,
                        totalFailures: 0,
                        totalPending: 2,
                        totalSkipped: 0,
                        hasPasses: false,
                        hasFailures: false,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 0,
                    },
                    ctx: '[Circular ~.allPending.2.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    duration: 0,
                    _error: null,
                },
            },
        },
        {
            title: 'should have empty group list',
            body:
                "function () {\n        return request(e2e_mocha.parameters.url)\n            .get('/rest/admin/groups/')\n            .buffer()\n            .then(function(response) {\n                response.should.have.status2(500);\n                response.should.have.mime('application/json');\n            })\n    }",
            async: 0,
            sync: true,
            _timeout: 2000,
            _slow: 75,
            _enableTimeouts: true,
            timedOut: false,
            _trace: {},
            _retries: -1,
            _currentRetry: 0,
            pending: true,
            type: 'test',
            file:
                '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
            parent: {
                title: 'User Management',
                suites: [],
                tests: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                pending: [
                    {
                        title: 'should have empty user list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                        isRoot: false,
                        uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                    {
                        title: 'should have empty group list',
                        fullTitle:
                            'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                        timedOut: false,
                        duration: 0,
                        pass: false,
                        fail: false,
                        pending: true,
                        code:
                            '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                        isRoot: false,
                        uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                        parentUUID: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        requests: 'none',
                        skipped: false,
                    },
                ],
                root: false,
                _timeout: 2000,
                file: '/testxp/admin/spec_users.js',
                uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                fullFile:
                    '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                passes: [],
                failures: [],
                skipped: [],
                hasTests: true,
                hasSuites: false,
                totalTests: 2,
                totalPasses: 0,
                totalFailures: 0,
                totalPending: 2,
                totalSkipped: 0,
                hasPasses: false,
                hasFailures: false,
                hasPending: true,
                hasSkipped: false,
                duration: 0,
            },
            ctx: {
                _runnable: {
                    title: '"before all" hook',
                    body:
                        "function () {\n      if (shared && shared.token/* check test environment */) {\n        // setup code\n        //console.log('TOKEN %s', shared.token)\n      } else {\n        this.skip();\n      }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: true,
                    type: 'hook',
                    parent: {
                        title: 'User Management',
                        suites: [],
                        tests: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [],
                        failures: [],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 2,
                        totalPasses: 0,
                        totalFailures: 0,
                        totalPending: 2,
                        totalSkipped: 0,
                        hasPasses: false,
                        hasFailures: false,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 0,
                    },
                    ctx: '[Circular ~.allPending.3.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    duration: 0,
                    _error: null,
                },
                test: {
                    title: '"before all" hook',
                    body:
                        "function () {\n      if (shared && shared.token/* check test environment */) {\n        // setup code\n        //console.log('TOKEN %s', shared.token)\n      } else {\n        this.skip();\n      }\n    }",
                    async: 0,
                    sync: true,
                    _timeout: 2000,
                    _slow: 75,
                    _enableTimeouts: true,
                    timedOut: false,
                    _trace: {},
                    _retries: -1,
                    _currentRetry: 0,
                    pending: true,
                    type: 'hook',
                    parent: {
                        title: 'User Management',
                        suites: [],
                        tests: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        pending: [
                            {
                                title: 'should have empty user list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty user list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS2\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><span class="hljs-keyword">return</span> get(<span class="hljs-string">\'\'</span>)<br>    <span class="hljs-comment">/*.query({<br>        SERVICE: \'WFS\',<br>        REQUEST: \'GetCapabilities\'<br>    })*/</span><br>    .set(<span class="hljs-string">\'Authorization\'</span>, <span class="hljs-string">\'bearer \'</span> + shared.token)<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'THIS3\'</span>,shallowStringify(<span class="hljs-keyword">this</span>));<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.json;<br>        response.should.have.property(<span class="hljs-string">\'body\'</span>).that.is.an(<span class="hljs-string">\'array\'</span>).with.length(<span class="hljs-number">0</span>);<br>        <span class="hljs-keyword">return</span> response;<br>    }.bind(<span class="hljs-keyword">this</span>))<br>    <span class="hljs-comment">/*.catch(function(err) {<br>                    //err.showDiff = true;<br>                    console.log(\'error\', err);<br>                    throw err;<br>                })*/</span><br>    <span class="hljs-comment">//.then(done, done);</span>',
                                isRoot: false,
                                uuid: 'dd5b44dd-fdf3-4a97-896e-a8a7797078b7',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                            {
                                title: 'should have empty group list',
                                fullTitle:
                                    'XtraProxy E2E Tests v0.1.0 User Management should have empty group list',
                                timedOut: false,
                                duration: 0,
                                pass: false,
                                fail: false,
                                pending: true,
                                code:
                                    '<span class="hljs-keyword">return</span> request(e2e_mocha.parameters.url)<br>    .get(<span class="hljs-string">\'/rest/admin/groups/\'</span>)<br>    .buffer()<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">500</span>);<br>        response.should.have.mime(<span class="hljs-string">\'application/json\'</span>);<br>    })',
                                isRoot: false,
                                uuid: 'e7629d3b-f13c-46a3-9abe-f117609050ba',
                                parentUUID:
                                    'a444bfe2-6de8-420b-803d-4da7df891d63',
                                requests: 'none',
                                skipped: false,
                            },
                        ],
                        root: false,
                        _timeout: 2000,
                        file: '/testxp/admin/spec_users.js',
                        uuid: 'a444bfe2-6de8-420b-803d-4da7df891d63',
                        fullFile:
                            '/home/zahnen/development/mocha4web/testxp/admin/spec_users.js',
                        passes: [],
                        failures: [],
                        skipped: [],
                        hasTests: true,
                        hasSuites: false,
                        totalTests: 2,
                        totalPasses: 0,
                        totalFailures: 0,
                        totalPending: 2,
                        totalSkipped: 0,
                        hasPasses: false,
                        hasFailures: false,
                        hasPending: true,
                        hasSkipped: false,
                        duration: 0,
                    },
                    ctx: '[Circular ~.allPending.3.ctx]',
                    _events: {},
                    _eventsCount: 1,
                    duration: 0,
                    _error: null,
                },
            },
        },
    ],
    allPasses: [
        {
            title:
                'should either redirect to manager or show firstrun start page',
            fullTitle:
                'Firstrun Form should either redirect to manager or show firstrun start page',
            timedOut: false,
            duration: 22,
            state: 'passed',
            speed: 'fast',
            pass: true,
            fail: false,
            pending: false,
            code:
                '<span class="hljs-keyword">return</span> request(baseUrl)<br>.get(<span class="hljs-string">\'/\'</span>)<br>.redirects(<span class="hljs-number">0</span>)<br>.then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>    response.should.have.status2(<span class="hljs-number">200</span>);<br>    response.should.be.html;<br>    response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>    $ = cheerio.load(response.text);<br>    $(<span class="hljs-string">\'input[name=PAGEID]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>, <span class="hljs-string">\'0\'</span>)<br>    shared.firstrun = <span class="hljs-literal">true</span>;<br>})<br>.catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>    <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">302</span>) {<br>        err.response.should.redirect;<br>        err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>        shared.user = user;<br>    }<br>    <span class="hljs-keyword">else</span> {<br>        <span class="hljs-comment">//err.showDiff =should. true</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    }<br>})',
            isRoot: false,
            uuid: '54923619-aef5-49b0-b122-2212dfa57441',
            parentUUID: '5d19224a-e422-44e5-a853-fd1a0b7b6670',
            requests: 'none',
            skipped: false,
        },
        {
            title: 'should contain auth state',
            fullTitle: 'Authentication Form should contain auth state',
            timedOut: false,
            duration: 43,
            state: 'passed',
            speed: 'medium',
            pass: true,
            fail: false,
            pending: false,
            code:
                '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">return</span> request(baseUrl)<br>    .get(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>    .query({<br>        response_type: <span class="hljs-string">\'token\'</span>,<br>        client_id: <span class="hljs-string">\'manager\'</span>,<br>        redirect_uri: redirectUrl<br>    })<br>    .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>        response.should.have.status2(<span class="hljs-number">200</span>);<br>        response.should.be.html;<br>        response.should.have.property(<span class="hljs-string">\'text\'</span>).that.is.a(<span class="hljs-string">\'string\'</span>).that.is.not.empty;<br>        $ = cheerio.load(response.text);<br>        $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).should.exist.and.have.attr(<span class="hljs-string">\'value\'</span>)<br>        shared.auth_state = $(<span class="hljs-string">\'input[name=AUTH_STATE]\'</span>).attr(<span class="hljs-string">\'value\'</span>)<br>    })<br>    .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>        <span class="hljs-comment">//err.showDiff = true;</span><br>        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>        <span class="hljs-keyword">throw</span> err;<br>    })',
            isRoot: false,
            uuid: 'b4017264-a305-479e-ad09-729fdbbd371f',
            parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
            requests:
                'GET /rest/auth/authorize/?response_type=token&amp;client_id=manager&amp;redirect_uri=http%3A%2F%2Flocalhost%3A7080%2Fmanager%2F HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Connection: close<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
            skipped: false,
        },
    ],
    allFailures: [
        {
            title: 'should redirect with token for valid login',
            fullTitle:
                'Authentication Form should redirect with token for valid login',
            timedOut: false,
            duration: 36,
            state: 'failed',
            pass: false,
            fail: true,
            pending: false,
            code:
                '<span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> use timeout for request to catch it</span><br><span class="hljs-comment">//this.timeout(30000);</span><br><span class="hljs-comment">// <span class="hljs-doctag">TODO:</span> how are request exceptions handled</span><br><br><span class="hljs-keyword">if</span> (shared &amp;&amp; shared.auth_state<span class="hljs-comment">/* check test environment */</span>) {<br>    <br>    <span class="hljs-keyword">return</span> request(baseUrl)<br>        .post(<span class="hljs-string">\'/rest/auth/authorize/\'</span>)<br>        .send(<span class="hljs-string">\'AUTH_STATE=\'</span> + shared.auth_state)<br>        .send(<span class="hljs-string">\'j_username=admin\'</span>)<br>        .send(<span class="hljs-string">\'j_password=admin\'</span>)<br>        .redirects(<span class="hljs-number">0</span>)<br>        .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{<br>            response.should.redirect;<br>        })<br>        .catch(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">err</span>) </span>{<br>            <span class="hljs-keyword">if</span> (err.status === <span class="hljs-number">303</span>) {<br>                err.response.should.redirect;<br>                err.response.should.have.a.header(<span class="hljs-string">\'location\'</span>, <span class="hljs-keyword">new</span> <span class="hljs-built_in">RegExp</span>(<span class="hljs-string">\'^\'</span> + redirectUrl))<br>                <span class="hljs-keyword">var</span> url = redirectUrl + <span class="hljs-string">\'#access_token=\'</span><br>                <span class="hljs-keyword">var</span> loc = err.response.header[<span class="hljs-string">\'location\'</span>]<br>                loc.should.startWith(url)<br>                shared.token = loc.substring(url.length, loc.indexOf(<span class="hljs-string">\'&amp;\'</span>));<br>            }<br>            <span class="hljs-keyword">else</span> {<br>                <span class="hljs-comment">//err.showDiff =should. true</span><br>                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'error\'</span>, err);<br>                <span class="hljs-keyword">throw</span> err;<br>            }<br>        })<br>} <span class="hljs-keyword">else</span> {<br>    <span class="hljs-keyword">this</span>.skip();<br>}',
            err: {
                name: 'AssertionError',
                message:
                    'expected redirect with 30{1-3} status code but got 200',
                stack:
                    'AssertionError: expected redirect <span class="hljs-keyword">with</span> <span class="hljs-number">30</span>{<span class="hljs-number">1</span>-<span class="hljs-number">3</span>} status code but got <span class="hljs-number">200</span><br>    at testxp/auth/spec_auth.js:<span class="hljs-number">64</span>:<span class="hljs-number">36</span><br>    at mocha-chai.js:<span class="hljs-number">89</span>:<span class="hljs-number">21</span>',
            },
            isRoot: false,
            uuid: '79abcedd-aeb2-4bbe-84bd-d5f5a86e7fd1',
            parentUUID: 'ac98de6f-d881-42de-96d5-c72c8da5b6ee',
            requests:
                'POST /rest/auth/authorize/ HTTP/1.1<br>Host: localhost:7080<br>Accept-Encoding: gzip, deflate<br>User-Agent: node-superagent/2.3.0<br>Content-Type: application/x-www-form-urlencoded<br>Content-Length: 81<br>Connection: close<br>AUTH_STATE=e9ff673e-a8ba-4a36-941e-0f2f79ef8067&amp;j_username=admin&amp;j_password=admin<br>HTTP/1.1 200<br>date: Mon, 14 Nov 2016 18:32:16 GMT<br>content-type: text/html<br>connection: close<br><span class="hljs-tag">&lt;<span class="hljs-title">!DOCTPYE</span> <span class="hljs-attribute">html</span>&gt;</span><br><span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">charset</span>=<span class="hljs-value">"UTF-8"</span> /&gt;</span><br>    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">http-equiv</span>=<span class="hljs-value">"X-UA-Compatible"</span> <span class="hljs-attribute">cont</span></span>',
            skipped: false,
        },
    ],
    copyrightYear: 2016,
};
