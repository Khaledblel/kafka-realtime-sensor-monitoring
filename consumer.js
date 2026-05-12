const { Kafka } = require('kafkajs');
const pool = require('./db'); 

const kafka = new Kafka({
 clientId: 'tp6-consumer',
 brokers:[process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });
const topic = process.env.KAFKA_TOPIC || 'test-topic';

const run = async () => {
 await consumer.connect();
 await consumer.subscribe({ topic, fromBeginning: true });
 
 await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
   const valueStr = message.value?.toString();
   const keyStr = message.key?.toString();
   const offset = message.offset;
   
   let payload = {};
   try {
       payload = JSON.parse(valueStr);
   } catch(e) {
       console.log("Erreur de parsing", e);
   }

   const query = `
       INSERT INTO kafka_messages (topic, partition, message_offset, message_key, payload)
       VALUES ($1, $2, $3, $4, $5)
   `;
   const values = [topic, partition, offset, keyStr, payload];
   
   try {
       await pool.query(query, values);
       console.log(`Message sauvegardé en BDD ! (Offset: ${offset})`);
   } catch (err) {
       console.error("Erreur d'insertion en BDD", err);
   }
  },
 });
}; 

run().catch(console.error);