const { createReadStream } = require('fs')
const { join } = require('path')
const pumpify = require('pumpify')
const capnp = require('capnp')
const CapnpStream = require('../')
const expected = require('./serialized.json')

test('It should decode a capnp file', (endTest) => {
  const schema = capnp.import(join(__dirname, 'person.capnp'))

  const input = createReadStream(join(__dirname, 'serialized.dat'))
  const capnpStream = new CapnpStream(schema.Person)

  const stream = pumpify.obj(
    input,
    capnpStream
  )

  const data = []

  stream
    .on('data', (d) => {
      data.push(d)
    })
    .on('finish', () => {
      expect(data).toEqual(expected)
      endTest()
    })
})
