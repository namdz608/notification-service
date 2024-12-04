import * as connection from '@notifications/queues/connection'
import amqp from 'amqplib'
import { consumeAuthEmailMessage, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection')
jest.mock('amqblib')
jest.mock('@uzochukwueddie/jobber-shared');

describe('Email Consumer', () => {
    beforeEach(()=>{
        jest.resetAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks();
      });

    describe('consumeAuthEMailMessage method',()=>{
        it('should be called', async ()=>{
            const channel = {
                assertExchange: jest.fn(),
                public: jest.fn(),
                assertQueue: jest.fn(),
                consume: jest.fn(),
            }
            jest.spyOn(channel, 'assertExchange');
            jest.spyOn(channel, 'assertQueue').mockReturnValue({queue: 'jobber-email'});
            jest.spyOn(connection,'createConnection').mockReturnValue(channel as never)
            const connectionChannel: amqp.Channel | undefined = await connection.createConnection(); 
            await consumeAuthEmailMessage(connectionChannel!);

            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
        })

    })

    describe('consumeOrderEmailMessages method', () => {
        it('should be called', async () => {
          const channel = {
            assertExchange: jest.fn(),
            publish: jest.fn(),
            assertQueue: jest.fn(),
            bindQueue: jest.fn(),
            consume: jest.fn(),
          };
          jest.spyOn(channel, 'assertExchange');
          jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0});
          jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
          const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
          await consumeOrderEmailMessages(connectionChannel!);
          expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
          expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
          expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
          expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
        });
      });
})