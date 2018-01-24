const { Transform } = require('readable-stream')
const capnp = require('capnp')

class ParseStream extends Transform {
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

    return callback()
  }
}

class SerializeStream extends Transform {
  constructor (schema, options = {}) {
    options.objectMode = true
    super(options)
    this.options = options
    this.schema = schema
  }

  _transform (chunk, encoding, callback) {
    if (typeof chunk !== 'object') {
      return callback(new Error(`Expected chunk must have been object, but received "${typeof chunk}"`))
    }

    this.push(capnp.serialize(this.schema, chunk))

    return callback()
  }
}

module.exports = {
  ParseStream,
  SerializeStream
}
