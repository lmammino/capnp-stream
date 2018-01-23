const { Transform } = require('readable-stream')
const capnp = require('capnp')

class CapnpStream extends Transform {
  constructor (schema, options = {}) {
    options.objectMode = true
    super(options)
    this.schema = schema
    this.buffer = null
  }

  _transform (chunk, encoding, callback) {
    if (!this.buffer) {
      this.buffer = chunk
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk])
    }

    let expectedSize = capnp.expectedSizeFromPrefix(this.buffer)
    let data = null
    while (this.buffer.length >= expectedSize) {
      data = capnp.parse(this.schema, this.buffer)
      this.buffer = this.buffer.slice(expectedSize)
      expectedSize = capnp.expectedSizeFromPrefix(this.buffer)
      this.push(data)
    }

    callback()
  }
}

module.exports = CapnpStream
