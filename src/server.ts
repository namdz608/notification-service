import { IEmailMessageDetails, winstonLogger } from "@namdz608/jobber-shared";
import 'express-async-errors'
import { Logger } from "winston";
import http from 'http'
import { config } from "@notifications/config"; //goi den bien ELASTIC_SEARCH_URL trong file config.ts ( cau hinh path trong tsconfig)
import { Application } from "express"
import { healthRoute } from "./routes";
import { checkConnection } from "./elasticsearch";
import { createConnection } from "./queues/connection";
import { Channel } from 'amqplib';
import { consumeAuthEmailMessage, consumeOrderEmailMessages } from './queues/email.consumer'

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug')

export function start(app: Application) {
    startServer(app)
    // goi den route http://localhost:4001/notification-health
    app.use('', healthRoute())
    startQueues()
    startElasticsearch()
}

async function startQueues(): Promise<void> {
    const emailChannel: Channel = await createConnection() as Channel; //Đây là đối tượng Channel trong RabbitMQ. Channel là một kết nối logic với RabbitMQ, được sử dụng để gửi và nhận tin nhắn.
    // Thông qua channel, bạn có thể thực hiện các thao tác như gửi tin nhắn (publish), tạo exchange, queue, hoặc nhận tin nhắn.
    const verificationLink= `${config.CLIENT_URL}/confirm_email?v_token=riven123`
    const messageDetail: IEmailMessageDetails = {
        receiverEmail : `${config.SENDER_EMAIL}`,
        verifyLink: verificationLink,
        template: 'verifyEmail'
    }
    await consumeAuthEmailMessage(emailChannel);
    await emailChannel.assertExchange('jobber-email-notification', 'direct')
    const message = JSON.stringify(messageDetail) //Dữ liệu tin nhắn (message) cần gửi. Tin nhắn này sẽ được gửi đến các queue đã liên kết với Exchange thông qua routing key.
    emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message))

    await consumeOrderEmailMessages(emailChannel)
    await emailChannel.assertExchange('jobber-order-notification', 'direct')
    const message1 = JSON.stringify({ name: 'jobber', service: 'order service' })
    emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1))
//Câu lệnh emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1)) sẽ gửi tin nhắn message1 tới Exchange jobber-order-notification với routing key order-email.
}

function startElasticsearch(): void {
    checkConnection()
}

async function startServer(app: Application): Promise<void> {
    try {
        const httpServer: http.Server = new http.Server(app)
        // log xem app đang chạy trên pid nào (lệnh top hoặc htop)
        log.info(`worker with process id of ${process.pid} on notification server`)
        httpServer.listen(SERVER_PORT, () => {
            log.info(`notification server is start tin on port ${SERVER_PORT}`)
        })
    } catch (e) {
        log.log('error', 'Notification start server ', e)
    }
}

