import * as SocketIO from 'socket.io'
import * as sift from 'sift'

var subscriptions: { [subscriptionId: string] : { sockets: Set<SocketIO.Socket>, query: any, collection: string } } =  {}

function generateSubscriptionId(collection: string, query: any): string{
    var queryId = JSON.stringify(query || {});
    return `${collection}:${queryId}`
}

function subscribe(data: any, ack: Function) {
    const socket: SocketIO.Socket = this
    const collection: string = data.collection
    const query: any = data.query || {}
    
    const subId = generateSubscriptionId(collection, query)
    var subscription = subscriptions[subId]
    if(subscription == null){
        var sockets = new Set<SocketIO.Socket>()
        sockets.add(socket)
        subscription = {
            sockets: sockets,
            query: query,
            collection: collection
        }
    }else{
        subscription.sockets.add(socket)
    }
    // now we should try to return the current data.
    if(ack == null){
        return
    }
    ack({
        collection: collection,
        query: query
    })
}

function unsubscribe(data: any, ack: Function) {
    const socket: SocketIO.Socket = this
    const collection: string = data.collection
    const query: string = data.query

    const subId = generateSubscriptionId(collection, query)
    var sub = subscriptions[subId]
    if(sub){
        sub.sockets.delete(socket)
    }
    if(Array.from(sub.sockets).length == 0){
        subscriptions[subId] = null
    }
    if(ack == null){
        return
    }
    ack({
        collection: collection,
        query: query
    })
}

function publishModelChange(collection: string, isRemove: boolean = false, ...models: any[]){
    for(var key in subscriptions){
        var sub = subscriptions[key]
        if(collection !== sub.collection){
            continue
        }
        if(sift(sub.query, models).length == 0){
            continue
        }
        for(var socket of sub.sockets){
            if(isRemove){
                socket.emit('modelsDidRemove', {
                    collection: collection,
                    models: models
                })
            }else{
                socket.emit('modelsDidUpdate', {
                    collection: collection,
                    models: models
                })
            }
        }
    }
}

export function registerSocket(socket: SocketIO.Socket) {
    socket.on('subscribe', subscribe)
    socket.on('observe', subscribe)
    socket.on('unsubscribe', unsubscribe)
    socket.on('dispose', unsubscribe)
}