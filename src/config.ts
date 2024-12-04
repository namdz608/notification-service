import dotenv from 'dotenv'

dotenv.config({})

// Viết 1 class Config với các dữ liệu là các biến trong file .env
class Config {
    public NODE_ENV: string | undefined;
    public CLIENT_URL: string | undefined;
    public SENDER_EMAIL: string | undefined;
    public SENDER_EMAIL_PASSWORD: string | undefined;
    public RABBITMQ_ENDPOINT: string | undefined;
    public ELASTIC_SEARCH_URL: string | undefined;
  
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
  
  export const config: Config = new Config();