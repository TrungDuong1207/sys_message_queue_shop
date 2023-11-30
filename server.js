'use strict';

const { consumerToQueue } = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';

consumerToQueue(queueName).then(() => {
    console.log(`Message consumer startes ${queueName}`)
}).catch(err => {
    console.error(`message error:`, err)
})


