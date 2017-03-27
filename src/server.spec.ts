import * as mocha from 'mocha'
import { expect } from 'chai'
import { } from 'chai-http'
import * as superagent from 'superagent'

import { server } from './server'

describe('server.js tests', () => {
    before(() => {
        server.listen(8000)
    })
    describe('/', function () {
        it('responds with basic root response', async function(){
            var err: Error = null
            try {
                var result = await superagent.get(`http://localhost:${8000}`)
                expect(result.body).to.have.key('hey')
            }catch(err){
                err = err
            }
            expect(err).to.be.null
        })
    })
    after(() => {
        server.close()
    })
})