import * as express from 'express'
import { createServer } from 'http'
import * as io from 'socket.io'

var app = express()
var server = createServer(app)

var port: number = process.env.PORT || 6000;
server.listen(port, () => {
    console.log('The app is now listing on port: ', port);
})
