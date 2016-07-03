module.exports = {
    testApi: {
        testCall: function (obj, cb) {
            setTimeout(function () {
                console.log(obj);
                cb();
            }, 5000);
        }
    }
}