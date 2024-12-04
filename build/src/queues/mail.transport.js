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
exports.sendEmail = sendEmail;
const config_1 = require("@notifications/config");
const jobber_shared_1 = require("@namdz608/jobber-shared");
const helper_1 = require("@notifications/helper");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
function sendEmail(template, receiverEmail, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.emailTemplate)(template, receiverEmail, locals);
            log.info('Email sent successfully');
        }
        catch (e) {
            log.log('error', 'Notification Mail senEmail method Error', e);
        }
    });
}
//# sourceMappingURL=mail.transport.js.map