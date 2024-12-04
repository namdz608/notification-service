"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeAuthEmailMessage = consumeAuthEmailMessage;
exports.consumeOrderEmailMessages = consumeOrderEmailMessages;
const config_1 = require("@notifications/config");
const jobber_shared_1 = require("@namdz608/jobber-shared");
const connection_1 = require("./connection");
const mail_transport_1 = require("./mail.transport");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
//hàm consumeAuthEmailMessage() này được sử dụng để lắng nghe các tin nhắn từ một hàng đợi xác thực email và xử lý chúng và trả về một Promise<void>, có nghĩa là nó thực hiện công việc bất đồng bộ và không trả về giá trị.
function consumeAuthEmailMessage(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, connection_1.createConnection)());
            }
            const exchangeName = 'jobber-email-notification'; //Exchange chịu trách nhiệm nhận và phân phối tin nhắn đến các queue.
            const routingKey = 'auth-email'; //Khóa định tuyến (routing key) cho việc chỉ định các tin nhắn sẽ được gửi đến queue nào. Trong trường hợp này, khóa định tuyến là auth-email.
            const queueName = 'auth-email-queue'; //Tên của queue nơi các tin nhắn liên quan đến xác thực email sẽ được lưu trữ.
            yield channel.assertExchange(exchangeName, 'direct'); //Đảm bảo rằng một exchange với tên jobber tồn tại và sử dụng loại 'direct'. Với kiểu này, các tin nhắn sẽ được gửi đến các hàng đợi dựa trên routing key.
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false }); //Đảm bảo rằng hàng đợi auth-email-queue tồn tại. Tùy chọn { durable: true } đảm bảo hàng đợi sẽ vẫn tồn tại sau khi RabbitMQ restart. autoDelete: false có nghĩa là queue này sẽ không tự động xóa khi không có consumer kết nối.
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey); //Liên kết hàng đợi jobberQueue với exchange jobber thông qua routing key là auth-email
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://images4.alphacoders.com/132/thumb-1920-1329876.png',
                    username,
                    verifyLink,
                    resetLink
                };
                yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                channel.ack(msg);
            }));
        }
        catch (e) {
            log.log('error', 'Notification EmailConsumer Error consumeAuthEmailMessage() method', e);
        }
    });
}
function consumeOrderEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, connection_1.createConnection)());
            }
            const exchangeName = 'jobber-order-notification';
            const routingKey = 'order-email';
            const queueName = 'order-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const { receiverEmail, username, template, sender, offerLink, amount, buyerUsername, sellerUsername, title, description, deliveryDays, orderId, orderDue, requirements, orderUrl, originalDate, newDate, reason, subject, header, type, message, serviceFee, total } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
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
                };
                console.log('template', template);
                if (template === 'orderPlaced') {
                    yield (0, mail_transport_1.sendEmail)('orderPlaced', receiverEmail, locals);
                    yield (0, mail_transport_1.sendEmail)('orderReciept', receiverEmail, locals);
                }
                else {
                    yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                }
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
        }
    });
}
//# sourceMappingURL=email.consumer.js.map