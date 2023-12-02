'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbit');

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName);
        } catch (e) {
            console.error(`Error consumerToQueue`, e);
        }
    },
    //case processing
    consumerToQueueNormal: async () => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess';

            const timeExpired = 5000;
            setTimeout(() => {
                channel.consume(notiQueue, msg => {
                    console.log(`send notification successfully processes:`, msg.content.toString());
                    channel.ack(msg)
                })
            }, timeExpired)

        } catch (e) {
            console.error(e)
        }
    },
    //case fail
    consumerToQueueFail: async () => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notificationExchangeDLX = 'notificationExDLX';
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';
            const notiQueueHandler = 'notificationQueueHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            });

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            });
            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);

            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`this notification error, pls hot fix`, msgFailed.content.toString())
            }, {
                noAck: true
            })
        } catch (e) {
            console.error(e);
            throw e
        }
    },

}

module.exports = messageService;

