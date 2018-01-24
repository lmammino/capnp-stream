const { createReadStream, readFileSync } = require('fs')
const { Readable, Writable } = require('readable-stream')
const { join } = require('path')
const pumpify = require('pumpify')
const capnp = require('capnp')
const { ParseStream, SerializeStream } = require('../')
const data = require('./data.json')
const schema = capnp.import(join(__dirname, 'person.capnp'))

class ReadableArray extends Readable {
  constructor (data, options = {}) {
    options.objectMode = true
    super(options)
    this.data = data
    this.index = 0
  }

  _read () {
    if (this.index === this.data.length) {
      return this.push(null)
    }
    this.push(this.data[this.index])
    this.index++
  }
}

class WritableArray extends Writable {
  constructor (accumulator, options = {}) {
    options.objectMode = true
    super(options)
    this.accumulator = accumulator
  }

  _write (chunk, encoding, callback) {
    this.accumulator.push(chunk)

    return callback()
  }
}

test('It should parse a capnp file', (endTest) => {
  const input = createReadStream(join(__dirname, 'serialized.dat'))
  const capnpStream = new ParseStream(schema.Person)

  const stream = pumpify.obj(
    input,
    capnpStream
  )

  const parsedData = []

  stream
    .on('data', (d) => {
      parsedData.push(d)
    })
    .on('finish', () => {
      expect(parsedData).toEqual(data)
      endTest()
    })
})

test('It should serialize an object stream to a capnp', (endTest) => {
  const input = new ReadableArray(data)
  const accumulator = []
  const output = new WritableArray(accumulator)
  const expectedResult = readFileSync(join(__dirname, 'serialized.dat'))

  input
    .pipe(new SerializeStream(schema.Person))
    .pipe(output)
    .on('finish', () => {
      const result = Buffer.concat(accumulator)
      expect(result).toEqual(expectedResult)
      return endTest()
    })
})

test('It should fail to serialize a non object chunk', (endTest) => {
  const input = new ReadableArray(['this is a string, not an object'])

  input
    .pipe(new SerializeStream(schema.Person))
    .on('error', (err) => {
      expect(err.message).toEqual('Expected chunk must have been object, but received "string"')
      return endTest()
    })
})
