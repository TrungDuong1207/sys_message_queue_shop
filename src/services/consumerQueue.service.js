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
            //1. TTL vd lỗi vượt thời gian sống
            // const timeExpired = 5000;
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log(`send notification successfully processes:`, msg.content.toString());
            //         channel.ack(msg)
            //     })
            // }, timeExpired)

            //2. lỗi logic
            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random();
                    console.log({ numberTest });
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failes: HOT FIX')
                    }
                    console.log(`send notification successfully processes:`, msg.content.toString());
                    channel.ack(msg)
                } catch (e) {
                    // console.error(`Ssend notification error`, e);
                    channel.nack(msg, false, false);
                    /*
                        nack: nagative acknowledgement
                        tham số thứ 2: true là sẽ đẩy lại hàng đợi normal, còn false là đẩy xuống hàng đợi lỗi
                        tham số thứ 3: có từ chối nhiều message hay không(false nghĩa là chỉ tin nhắn hiện tại sẽ bị từ chối mà thôi)
                    */
                }

            })

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

