var assert = require('assert');
var fs = require('fs');

var chromeZones = require('../lib/index');
var window = {
    chrome: require('./helpers/fake-chrome'),
    Zone: require('zone.js/dist/zone-node')
};

// we test zones behavior too briefly to ensure
// we're using it properly
// TODO: these can be removed once we're confident in our implementation
describe("Zone", function () {
    
    // allow zone tests 10s to run
    this.timeout(10 * 1000);

    it("should be forkable", function (done) {
        var started = false, stopped = false;
        Zone.current.fork({
            // with a given name
            name: "idgaf",
            // and a handler for when the tasks it has changes
            onHasTask: function(parent, current, target, has) {
                // and if the task has work
                if (has[has.change]) {
                    started = true;
                } else {
                    stopped = true;
                }

                if (started && stopped) {
                    done();
                }
            }
        // then we immediately cue some work
        }).run(function () {
            // that creates an async operation
            setTimeout(function () {
                var a = 1 + 1;
            }, 1000);
        });
    });

    it("should wrap callbacks", function (done) {
        var started = false, stopped = false, invoked = false, src = "_test_src", cbFn = function cbFn() {
            setTimeout(function () {
                var a = 2 + 3;
            }, 1000);
        };

        Zone.current.fork({
            // with a given name
            name: "idgaf",
            // and a handler for when the tasks it has changes
            onHasTask: function(parent, current, target, has) {
                // and if the task has work
                
                if (has["microTask"] || has["macroTask"] || has["eventTask"]) {
                    started = true;
                } else {
                    stopped = true;
                }

                // completion case
                if (started && stopped && invoked) {
                    done();
                }
            },
            onInvoke: function (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
                if (source == src) {
                    assert.equal(delegate, cbFn);
                    invoked = true;
                }
                return delegate.apply(applyThis, applyArgs);
            }
        // then we immediately cue some work
        }).run(function () {
            var wrapped = Zone.current.wrap(cbFn, src);
            
            // use fs to do async work and provide wrapped as the cb
            fs.readdir(".", wrapped);
        });
    });
})

describe("chrome-zones", function () {
    it("should patch chrome", function () {
        var started = false, stopped = false, invoked = false, src = "_zones.chrome.testApi.testCall";

        // patch em
        chromeZones(window.chrome, window.Zone);

        Zone.current.fork({
            // with a given name
            name: "chrome-zone-test",
            // and a handler for when the tasks it has changes
            onHasTask: function(parent, current, target, has) {
                if (has["microTask"] || has["macroTask"] || has["eventTask"]) {
                    started = true;
                } else {
                    stopped = true;
                }

                // completion case
                if (started && stopped && invoked) {
                    done();
                }
            },
            onInvoke: function (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
                if (source == src) {
                    assert.equal(delegate, window.chrome.testApi.testCall);
                    invoked = true;
                }
                return delegate.apply(applyThis, applyArgs);
            }
        // then we immediately cue some work
        }).run(function () {
            var wrapped = Zone.current.wrap(window.chrome.testApi.testCall, src);
            
            // use fs to do async work and provide wrapped as the cb
            fs.readdir(".", wrapped);
        });
    });
});