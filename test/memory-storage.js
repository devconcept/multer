/* eslint-env mocha */

var assert = require('assert')

var util = require('./_util')
var multer = require('../')
var FormData = require('form-data')

describe('Memory Storage', function () {
  var parser

  before(function (done) {
    parser = multer({ storage: multer.memoryStorage() })
    done()
  })

  it('should process multipart/form-data POST request', function (done) {
    var form = new FormData()

    form.append('name', 'Multer')
    form.append('small0', util.file('small0.dat'))

    util.submitForm(parser, form, function (err, req) {
      assert.ifError(err)

      assert.equal(req.body.name, 'Multer')

      assert.equal(req.files.length, 1)
      assert.equal(req.files[0].fieldname, 'small0')
      assert.equal(req.files[0].originalname, 'small0.dat')
      assert.equal(req.files[0].size, 1778)
      assert.equal(req.files[0].buffer.length, 1778)

      done()
    })

  })

  it('should process empty fields and an empty file', function (done) {
    var form = new FormData()

    form.append('empty', util.file('empty.dat'))
    form.append('name', 'Multer')
    form.append('version', '')
    form.append('year', '')
    form.append('checkboxfull', 'cb1')
    form.append('checkboxfull', 'cb2')
    form.append('checkboxhalfempty', 'cb1')
    form.append('checkboxhalfempty', '')
    form.append('checkboxempty', '')
    form.append('checkboxempty', '')

    util.submitForm(parser, form, function (err, req) {
      assert.ifError(err)

      assert.equal(req.body.name, 'Multer')
      assert.equal(req.body.version, '')
      assert.equal(req.body.year, '')

      assert.deepEqual(req.body.checkboxfull, [ 'cb1', 'cb2' ])
      assert.deepEqual(req.body.checkboxhalfempty, [ 'cb1', '' ])
      assert.deepEqual(req.body.checkboxempty, [ '', '' ])

      assert.equal(req.files.length, 1)
      assert.equal(req.files[0].fieldname, 'empty')
      assert.equal(req.files[0].originalname, 'empty.dat')
      assert.equal(req.files[0].size, 0)
      assert.equal(req.files[0].buffer.length, 0)

      done()
    })

  })

  it('should process multiple files', function (done) {
    var form = new FormData()

    form.append('empty', util.file('empty.dat'))
    form.append('tiny0', util.file('tiny0.dat'))
    form.append('tiny1', util.file('tiny1.dat'))
    form.append('small0', util.file('small0.dat'))
    form.append('small1', util.file('small1.dat'))
    form.append('medium', util.file('medium.dat'))
    form.append('large', util.file('large.jpg'))

    util.submitForm(parser, form, function (err, req) {
      assert.ifError(err)

      assert.deepEqual(req.body, {})

      assert.equal(req.files.length, 7)

      assert.equal(req.files[0].fieldname, 'empty')
      assert.equal(req.files[0].originalname, 'empty.dat')
      assert.equal(req.files[0].size, 0)
      assert.equal(req.files[0].buffer.length, 0)

      assert.equal(req.files[1].fieldname, 'tiny0')
      assert.equal(req.files[1].originalname, 'tiny0.dat')
      assert.equal(req.files[1].size, 122)
      assert.equal(req.files[1].buffer.length, 122)

      assert.equal(req.files[2].fieldname, 'tiny1')
      assert.equal(req.files[2].originalname, 'tiny1.dat')
      assert.equal(req.files[2].size, 7)
      assert.equal(req.files[2].buffer.length, 7)

      assert.equal(req.files[3].fieldname, 'small0')
      assert.equal(req.files[3].originalname, 'small0.dat')
      assert.equal(req.files[3].size, 1778)
      assert.equal(req.files[3].buffer.length, 1778)

      assert.equal(req.files[4].fieldname, 'small1')
      assert.equal(req.files[4].originalname, 'small1.dat')
      assert.equal(req.files[4].size, 315)
      assert.equal(req.files[4].buffer.length, 315)

      assert.equal(req.files[5].fieldname, 'medium')
      assert.equal(req.files[5].originalname, 'medium.dat')
      assert.equal(req.files[5].size, 13196)
      assert.equal(req.files[5].buffer.length, 13196)

      assert.equal(req.files[6].fieldname, 'large')
      assert.equal(req.files[6].originalname, 'large.jpg')
      assert.equal(req.files[6].size, 2413677)
      assert.equal(req.files[6].buffer.length, 2413677)

      done()
    })

  })

})
