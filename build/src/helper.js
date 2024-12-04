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
exports.emailTemplate = emailTemplate;
const config_1 = require("@notifications/config");
const jobber_shared_1 = require("@namdz608/jobber-shared");
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
function emailTemplate(template, receiver, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const smtpTransporter = nodemailer_1.default.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: config_1.config.SENDER_EMAIL,
                    pass: config_1.config.SENDER_EMAIL_PASSWORD
                }
            });
            const email = new email_templates_1.default({
                message: {
                    from: `Jobber App <${config_1.config.SENDER_EMAIL}`
                },
                send: true,
                preview: false,
                transport: smtpTransporter,
                views: {
                    options: {
                        extension: 'ejs'
                    }
                },
                juice: true,
                juiceResources: {
                    preserveImportant: true,
                    webResources: {
                        relativeTo: path_1.default.join(__dirname, '../build')
                    }
                }
            });
            yield email.send({
                template: path_1.default.join(__dirname, '..', 'src/emails', template),
                message: { to: receiver },
                locals
            });
        }
        catch (e) {
            log.log('error', 'Notification Mail emailTemplate() method Error', e);
        }
    });
}
//# sourceMappingURL=helper.js.map