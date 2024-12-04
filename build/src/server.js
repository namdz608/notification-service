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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const jobber_shared_1 = require("@namdz608/jobber-shared");
require("express-async-errors");
const http_1 = __importDefault(require("http"));
const config_1 = require("@notifications/config"); //goi den bien ELASTIC_SEARCH_URL trong file config.ts ( cau hinh path trong tsconfig)
const routes_1 = require("./routes");
const elasticsearch_1 = require("./elasticsearch");
const connection_1 = require("./queues/connection");
const email_consumer_1 = require("./queues/email.consumer");
const SERVER_PORT = 4001;
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
function start(app) {
    startServer(app);
    // goi den route http://localhost:4001/notification-health
    app.use('', (0, routes_1.healthRoute)());
    startQueues();
    startElasticsearch();
}
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const emailChannel = yield (0, connection_1.createConnection)(); //Đây là đối tượng Channel trong RabbitMQ. Channel là một kết nối logic với RabbitMQ, được sử dụng để gửi và nhận tin nhắn.
        // Thông qua channel, bạn có thể thực hiện các thao tác như gửi tin nhắn (publish), tạo exchange, queue, hoặc nhận tin nhắn.
        const verificationLink = `${config_1.config.CLIENT_URL}/confirm_email?v_token=riven123`;
        const messageDetail = {
            receiverEmail: `${config_1.config.SENDER_EMAIL}`,
            verifyLink: verificationLink,
            template: 'verifyEmail'
        };
        yield (0, email_consumer_1.consumeAuthEmailMessage)(emailChannel);
        yield emailChannel.assertExchange('jobber-email-notification', 'direct');
        const message = JSON.stringify(messageDetail); //Dữ liệu tin nhắn (message) cần gửi. Tin nhắn này sẽ được gửi đến các queue đã liên kết với Exchange thông qua routing key.
        emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));
        yield (0, email_consumer_1.consumeOrderEmailMessages)(emailChannel);
        yield emailChannel.assertExchange('jobber-order-notification', 'direct');
        const message1 = JSON.stringify({ name: 'jobber', service: 'order service' });
        emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1));
        //Câu lệnh emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1)) sẽ gửi tin nhắn message1 tới Exchange jobber-order-notification với routing key order-email.
    });
}
function startElasticsearch() {
    (0, elasticsearch_1.checkConnection)();
}
function startServer(app) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const httpServer = new http_1.default.Server(app);
            // log xem app đang chạy trên pid nào (lệnh top hoặc htop)
            log.info(`worker with process id of ${process.pid} on notification server`);
            httpServer.listen(SERVER_PORT, () => {
                log.info(`notification server is start tin on port ${SERVER_PORT}`);
            });
        }
        catch (e) {
            log.log('error', 'Notification start server ', e);
        }
    });
}
//# sourceMappingURL=server.js.map