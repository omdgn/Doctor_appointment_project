const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://guest:guest@127.0.0.1";

async function publishToQueue(queueName, message) {
    let connection, channel;
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message sent to queue '${queueName}':`, message);
    } catch (error) {
        console.error("RabbitMQ Publisher Error:", error);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}

module.exports = { publishToQueue };
