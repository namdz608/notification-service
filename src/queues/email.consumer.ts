import { Channel, ConsumeMessage } from 'amqplib';
import { config } from "@notifications/config";
import { Logger } from "winston";
import { winstonLogger, IEmailLocals } from "@namdz608/jobber-shared";
import { createConnection } from './connection';
import { sendEmail } from './mail.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug')

//hàm consumeAuthEmailMessage() này được sử dụng để lắng nghe các tin nhắn từ một hàng đợi xác thực email và xử lý chúng và trả về một Promise<void>, có nghĩa là nó thực hiện công việc bất đồng bộ và không trả về giá trị.
export async function consumeAuthEmailMessage(channel: Channel): Promise<void> {
    try {
        if (!channel) {
            channel = await createConnection() as Channel
        }
        const exchangeName: string = 'jobber-email-notification'//Exchange chịu trách nhiệm nhận và phân phối tin nhắn đến các queue.
        const routingKey: string = 'auth-email'//Khóa định tuyến (routing key) cho việc chỉ định các tin nhắn sẽ được gửi đến queue nào. Trong trường hợp này, khóa định tuyến là auth-email.
        const queueName: string = 'auth-email-queue'//Tên của queue nơi các tin nhắn liên quan đến xác thực email sẽ được lưu trữ.
        await channel.assertExchange(exchangeName, 'direct')//Đảm bảo rằng một exchange với tên jobber tồn tại và sử dụng loại 'direct'. Với kiểu này, các tin nhắn sẽ được gửi đến các hàng đợi dựa trên routing key.
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });//Đảm bảo rằng hàng đợi auth-email-queue tồn tại. Tùy chọn { durable: true } đảm bảo hàng đợi sẽ vẫn tồn tại sau khi RabbitMQ restart. autoDelete: false có nghĩa là queue này sẽ không tự động xóa khi không có consumer kết nối.
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);//Liên kết hàng đợi jobberQueue với exchange jobber thông qua routing key là auth-email

        channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString())
            const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://images4.alphacoders.com/132/thumb-1920-1329876.png',
                username,
                verifyLink,
                resetLink
            }
            await sendEmail(template, receiverEmail, locals)
            channel.ack(msg!)
        });
    } catch (e) {
        log.log('error', 'Notification EmailConsumer Error consumeAuthEmailMessage() method', e)
    }
}

export async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }
        const exchangeName = 'jobber-order-notification';
        const routingKey = 'order-email';
        const queueName = 'order-email-queue';
        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
            const { receiverEmail,
                username,
                template,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total } = JSON.parse(msg!.content.toString());

            const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
            }
            console.log('template',template)
            if (template === 'orderPlaced'){
                await sendEmail('orderPlaced',receiverEmail,locals)
                await sendEmail('orderReciept',receiverEmail,locals)
            }
            else {
                await sendEmail(template,receiverEmail,locals)
            }
            channel.ack(msg!);
        });
    } catch (error) {
        log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
    }
}