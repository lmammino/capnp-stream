const { Transform } = require('readable-stream')
const capnp = require('capnp')

class ParseStream extends Transform {
  constructor (schema, options = { emitEvery: 1, skip: 0 }) {
    options.objectMode = true
    super(options)
    this.schema = schema
    this.buffer = null
    this.emitEvery = options.emitEvery
    this.skip = options.skip
    this.msgCounter = 0
  }

  _transform (chunk, encoding, callback) {
    if (!this.buffer) {
      this.buffer = chunk
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk])
    }

    try {
      let expectedSize = capnp.expectedSizeFromPrefix(this.buffer)
      let data = null

      while (this.buffer.length >= expectedSize) {
        if (this.skip === (this.msgCounter % this.emitEvery)) {
          data = capnp.parse(this.schema, this.buffer)
          this.push(data)
        }
        this.buffer = this.buffer.slice(expectedSize)
        expectedSize = capnp.expectedSizeFromPrefix(this.buffer)
        this.msgCounter += 1
      }
    } catch (err) {
      callback(err)
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
