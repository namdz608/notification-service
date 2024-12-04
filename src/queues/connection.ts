import client, { Channel, Connection } from 'amqplib';
import { config } from "@notifications/config";
import { Logger } from "winston";
import { winstonLogger } from "@namdz608/jobber-shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug')

export async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`)
        const channel: Channel = await connection.createChannel()
        log.info('Notification server connect to queue successfully')
        closeConnection(channel,connection)
        return channel
    } catch (e) {
        log.log('error', 'Notification createConnection() method')
        return undefined
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT',async ()=>{
        await channel.close()
        await connection.close()
    })
}

