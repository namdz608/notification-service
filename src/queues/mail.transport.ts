import { config } from "@notifications/config";
import { Logger } from "winston";
import { winstonLogger, IEmailLocals } from "@namdz608/jobber-shared";
import { emailTemplate } from "@notifications/helper";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug')

export async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
    try{
        emailTemplate(template,receiverEmail,locals)
        log.info('Email sent successfully')
    }catch(e){
        log.log('error','Notification Mail senEmail method Error', e)
    }
}