# capnp-stream

[![npm version](https://badge.fury.io/js/capnp-stream.svg)](http://badge.fury.io/js/capnp-stream)
[![CircleCI](https://circleci.com/gh/lmammino/capnp-stream.svg?style=shield)](https://circleci.com/gh/lmammino/capnp-stream)
[![codecov.io](https://codecov.io/gh/lmammino/capnp-stream/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/capnp-stream)

A Node.js readable stream for [Cap’n Proto](https://capnproto.org/) encoded binary input.


## Install

With NPM:

```bash
npm install --save capnp-stream
```


## Usage

`capnp-stream` allows to consume Cap’n Proto files as a readable stream, that emits
objects.


### Example usage:

```javascript
const capnp = require('capnp')
const CapnpStream = require('capnp-stream')

// import capnp schema
const schema = capnp.import(join(__dirname, 'person.capnp'))
// initialize stream
const capnpStream = new CapnpStream(schema.Person)

// print as a JSON every object in the stream
capnpStream.on('data', (d) => {
  console.log(JSON.stringify(d, null, 2))
})
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/capnp-stream/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
