import * as express from 'express'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as sift from 'sift'

const app = express()
export var server = http.createServer(app)
export var io = SocketIO(server);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.get('/', (req, res) => {
    res.json({ hey: "imWorking!" })
})

import { registerSocket } from './register'

io.on('connection', registerSocket)

if(!module.parent){
    const port: number = process.env.PORT || 7000
    server.listen(port, (err) => {
        console.log('The app is now listing on port:', port)
    })
}


