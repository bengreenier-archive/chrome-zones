(function () {
    function chromeZones(chromeImpl, zoneImpl) {
        function patchMethods(obj, patchName) {
            patchName = patchName || "";
            for (var prop in obj) {
                if (typeof(obj[prop]) === "function") {
                    obj[prop] = patchFunction(obj, prop, patchName);
                } else if (typeof(obj[prop]) === "object") {
                    obj[prop] = patchMethods(obj[prop], patchName  + "." + prop);
                }
            }
            return obj;
        }

        function patchFunction(obj, fnProp, patchName) {
            var originalFn = obj[fnProp];
            var debugPathName = "_zones." + patchName + "." + fnProp;

            var newFn = function () {
                var args = arguments;
                
                // patch the final arg (callback arg)
                if (typeof(args[args.length - 1]) === "function") {
                    args[args.length - 1] = zoneImpl.current.wrap(args[args.length - 1], debugPathName);
                }

                // call the original with patched args
                return originalFn.apply(this, args);
            };

            // patch the function name if it has one
            if (typeof(originalFn.name) !== "undefined") {
                newFn.name = originalFn.name;
            }

            return newFn;
        }

        // patch the chromeImpl objects methods (use "chrome" as the root debug patch name)
        patchMethods(chromeImpl, "chrome");
    }

    // support module loaders, fallback to browser (using window)
    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = chromeZones;
        }
        exports.chromeZones = chromeZones;
    } 
    else {
        chromeZones(window.chrome, window.Zone);
    }
})();