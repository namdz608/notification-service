"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
// Viết 1 class Config với các dữ liệu là các biến trong file .env
class Config {
    //Chức năng chính của constructor: Gán giá trị ban đầu cho các thuộc tính của đối tượng.Thiết lập các tham số mặc định
    //Kiểm tra hoặc xác thực dữ liệu đầu vào.
    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map