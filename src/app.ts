// theo cấu hình trong file package.json thì chạy npm run dev sẽ vào file này đầu tiên

import { config } from "@notifications/config";
import { Logger } from "winston";
import { winstonLogger } from "@namdz608/jobber-shared";
import express, { Express } from 'express'
import { start } from '@notifications/server'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug') // khai báo hàm winstonLogger() từ thư
// viện @namdz608/jobber-shared tự build

function initialize(): void {
    const app: Express = express();
    // chạy hàm start trong file server.ts
    start(app)
    log.info('Notification Server')
}

initialize()