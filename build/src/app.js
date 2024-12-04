"use strict";
// theo cấu hình trong file package.json thì chạy npm run dev sẽ vào file này đầu tiên
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@notifications/config");
const jobber_shared_1 = require("@namdz608/jobber-shared");
const express_1 = __importDefault(require("express"));
const server_1 = require("@notifications/server");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug'); // khai báo hàm winstonLogger() từ thư
// viện @namdz608/jobber-shared tự build
function initialize() {
    const app = (0, express_1.default)();
    // chạy hàm start trong file server.ts
    (0, server_1.start)(app);
    log.info('Notification Server');
}
initialize();
//# sourceMappingURL=app.js.map