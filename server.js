'use strict';

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer startes ${queueName}`)
// }).catch(err => {
//     console.error(`message error:`, err)
// })

consumerToQueueNormal().then(() => {
    console.log(`Message consumer started`)
}).catch(err => {
    console.error(`message error:`, err)
})

consumerToQueueFail().then(() => {
    console.log(`Message consumer fail started`)
}).catch(err => {
    console.error(`message error:`, err)
})


