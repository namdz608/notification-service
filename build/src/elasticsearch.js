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
exports.checkConnection = checkConnection;
const elasticsearch_1 = require("@elastic/elasticsearch");
const config_1 = require("@notifications/config");
const jobber_shared_1 = require("@namdz608/jobber-shared");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
const elasticsearchClient = new elasticsearch_1.Client({
    node: `${config_1.config.ELASTIC_SEARCH_URL}`
});
//Hàm kiểm tra connect của app đến elasticsearch
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let isConnect = false;
        while (!isConnect) {
            try {
                const health = yield elasticsearchClient.cluster.health({});
                log.info(`Notification Elasticsearch health ${health.status}`);
                isConnect = true;
            }
            catch (e) {
                log.error('Connection elasticsearch failed');
                log.log('error', 'Notification start server ', e);
            }
        }
    });
}
//# sourceMappingURL=elasticsearch.js.map