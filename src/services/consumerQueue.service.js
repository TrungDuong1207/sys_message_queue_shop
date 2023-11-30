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
    }

}

module.exports = messageService;

