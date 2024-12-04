import { Client } from "@elastic/elasticsearch";
import { config } from "@notifications/config";
import { Logger } from "winston";
import { winstonLogger } from "@namdz608/jobber-shared";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug')
const elasticsearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
})

//Hàm kiểm tra connect của app đến elasticsearch
export async function checkConnection() {
    let isConnect = false;
    while(!isConnect){
            try{
                const health: ClusterHealthResponse= await elasticsearchClient.cluster.health({})
                log.info(`Notification Elasticsearch health ${health.status}`)
                isConnect=true
            }catch(e){
                log.error('Connection elasticsearch failed')
                log.log('error', 'Notification start server ', e)
            }
    }
}