'use strict'

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost"); //[amqp://guest:password@localhost]
        if (!connection) throw new Error("connection not established");
        const channel = await connection.createChannel();

        return { channel, connection }
    } catch (e) {
        console.error("Error connection to RabbitMQ", e)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        //publish message to a queue
        const queue = "test-queue";
        const message = "Hello, trung dep trai";
        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(message));

        //close connection
        await connection.close()

    } catch (e) {
        console.error("Error connection to RabbitMQ", e)
    }
}


module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}

