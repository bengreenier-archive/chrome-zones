// first, here's a normal sample zones usage
//
// // we fork the current zone
// Zone.current.fork({
//     // with a given name
//     name: "idgaf",
//     // and a handler for when the tasks it has changes
//     onHasTask: function(parent, current, target, has) {
//         // and if the task has work
//         if (has[has.change]) {
//             // we log this
//             console.log("zone work queued");
//         } else {
//             // otherwise no work, and we log this
//             console.log("zone work done");
//         }
//     }
// // then we immediately cue some work
// }).run(function () {
//     // that creates an async operation
//     setTimeout(function () { console.log("it"); }, 5000);
// });
//
// when that code runs, we expect to see the following output
// "zone work queued", "it", "zone work done"
// for more info see https://github.com/angular/zone.js/blob/master/dist/zone.js.d.ts


// here's our sample implementation using the chrome storage api
// note that creating the zone is done for you in angular2
// so if you're using these chrome apis with angular2
// you can just write the api call, and angular2
// will provide the zone for us to sync up with
Zone.current.fork({
    // with a given name
    name: "chrome-zone-example",
    // and a handler for when the tasks it has changes
    onHasTask: function(parent, current, target, has) {
        if (!(has["microTask"] || has["macroTask"] || has["eventTask"])) {
            console.log("done with storage");
        }
    }
// then we immediately cue some work
}).run(function () {
    chrome.storage.local.set({"key": "value"}, function () {
        console.log("storage completed");
        setTimeout(function () {
            console.log("async operation");
        }, 15 * 1000);
    });
});