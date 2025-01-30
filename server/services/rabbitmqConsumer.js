const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://guest:guest@127.0.0.1";

async function consumeQueue(queueName, callback) {
    let connection, channel;
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        console.log(`Waiting for messages in queue '${queueName}'...`);
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                console.log(`Message received from queue '${queueName}':`, content);
                callback(content);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("RabbitMQ Consumer Error:", error);
    }
}

module.exports = { consumeQueue };
