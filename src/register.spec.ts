import * as mocha from 'mocha'
import { expect } from 'chai'
import { } from 'chai-http'
import * as superagent from 'superagent'
import * as client from 'socket.io-client'


import { server } from './server'

describe('register.js tests', () => {
    before(() => {
        server.listen(8000)
    })
    describe('connection', function () {
        it('is able to connect under 3s', function (done) {
            this.timeout(3000);
            var socket = client(`http://localhost:8000`)
            socket.on('connect', () => {
                socket.close()
                done()
            })
        })
    })
    describe('subscribe', function () {
        it('is able to subscribe and ack back query', function (done) {
            const socket = client(`http://localhost:8000`)
            const collection = `users`
            var query = {
                age: {
                    $gte: 25
                }
            }
            socket.on('connect', () => {
                socket.emit('subscribe', {
                    collection: collection,
                    query: query
                }, (ackData) => {
                    expect(ackData).not.to.be.null
                    expect(ackData.collection).to.eql(collection)
                    expect(ackData.query).to.eql(query)
                    done()
                })
            })
        })
    })
    after(() => {
        server.close()
    })
})