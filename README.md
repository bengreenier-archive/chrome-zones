# chrome-zones

[![Build Status](https://travis-ci.org/bengreenier/chrome-zones.svg?branch=master)](https://travis-ci.org/bengreenier/chrome-zones)

wraps chrome extension apis so that if they are executing in a zone, their callbacks do too

# Why?

If, for instance, you wish to use angular2 in a chrome extension, and want to change
renderable/injectable/etc values from within a chrome extension api callback.

# How?

## Do i use it?

> `npm install chrome-zones` is the easiest.

If npm is too heavy for you, grab a built version [from this repo](./dist). Note
that you'll also need [angular/zone.js](https://github.com/angular/zone.js) included
in your page.

### Example

See [example](./example) for a complete working example.

## Does it work?

Using monkeypatching and `zone.wrap`. Basically when the script loads
it patches the entire `chrome.<whatever>` api space such that all
functions that are called have their last argument (if it is a function)
patched with `zone.wrap`.

# License

MIT