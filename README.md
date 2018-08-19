# capnp-stream

[![npm version](https://badge.fury.io/js/capnp-stream.svg)](http://badge.fury.io/js/capnp-stream)
[![CircleCI](https://circleci.com/gh/lmammino/capnp-stream.svg?style=shield)](https://circleci.com/gh/lmammino/capnp-stream)
[![codecov.io](https://codecov.io/gh/lmammino/capnp-stream/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/capnp-stream)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A Node.js A readable and writebale stream for [Cap’n Proto](https://capnproto.org/).


## Install

With NPM:

```bash
npm install --save capnp-stream
```

**Note**: capnp binaries need to be available in your system. Check out the official
[Cap’n Proto install guide](https://capnproto.org/install.html) for OS-specific instructions.


## Usage

`capnp-stream` allows to consume Cap’n Proto files as a readable stream, that emits
objects.


### Example usages:

Parse a Cap’n Proto encoded file

```javascript
const { createReadStream } = require('fs')
const { join } = require('path')
const capnp = require('capnp')
const { ParseStream } = require('capnp-stream')

// import capnp schema
const schema = capnp.import(join(__dirname, 'person.capnp'))

// initialize stream for a given schema
const capnpStream = new ParseStream(schema.Person)

// print as a JSON every object in the stream
capnpStream.on('data', (d) => {
  console.log(JSON.stringify(d, null, 2))
})

// pipe the data file to the capnp-stream instance
createReadStream('someCapnpDataFile')
  .pipe(capnpStream)
```

Encode a incoming objects stream to a Cap’n Proto file:

```javascript
const { createWriteStream } = require('fs')
const { join } = require('path')
const capnp = require('capnp')
const { SerializeStream } = require('capnp-stream')

// import capnp schema
const schema = capnp.import(join(__dirname, 'person.capnp'))

// initialize stream for a given schema
const capnpStream = new SerializeStream(schema.Person)

someObjectsStream // a stream that emits JavaScript objects that conform the capnp Schema
  .pipe(capnpStream) // encodes the javascript objects to a capnp stream
  .pipe(createWriteStream(join(__dirname, 'somefile.dat'))) // save the encoded capnp data to a file
```


## `skip` and `emitEvery` options (sharding)

Sometimes you don't want to consume (emit) all the objects in the capnp stream. For instance, this is common when you are processing the stream in parallel multiple times with multiple processes and you want to easily implement a sharding mechanism.

In these situations you can take advantage of the `skip` and `emitEvery` options that you can pass at construction time:

```javascript
const capnp = require('capnp')
const { SerializeStream } = require('capnp-stream')

// import capnp schema
const schema = capnp.import(join(__dirname, 'person.capnp'))

// initialize stream for a given schema
const capnpStream = new SerializeStream(schema.Person, {
  skip: process.env.SKIP,
  emitEvery: process.env.EMIT_EVERY
})
```

In this example, we pass through these options from environment variables. If you set your environment variables to be `SKIP=5` and `EMIT_EVERY=2` you will get the following objects emitted (0 based count):

  - person #5
  - person #7
  - person #9
  - person #11
  - ...


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/capnp-stream/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
