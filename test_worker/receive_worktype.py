import sys
import pika
import json


credentials = pika.PlainCredentials('urqa', 'urqa')
parameters  = pika.ConnectionParameters(host='14.63.164.245', 
                                        port=5672, 
                                        credentials=credentials)

connection  = pika.BlockingConnection(parameters)
channel     = connection.channel()

channel.queue_declare(queue='urqa-queue', durable=True)
channel.queue_bind(exchange ='urqa-exchange', queue = 'urqa-queue')


#channel.queue_declare(queue='if-push-queue',durable= True,auto_delete=False)
#channel.basic_publish(exchange = 'if-push-exchange')
print " [*] Waiting for messages. To exit press CTRL+C"


def callback(ch, method, properties, body):
    print " [x] Received %r\n\n" % (body,)


if __name__ == '__main__':
    try:
        channel.basic_consume(callback, queue='urqa-queue', no_ack=True)
        channel.start_consuming()
    except (KeyboardInterrupt):#, SystemExit):
        print " [*]Program Exit....\n"
        
    channel.stop_consuming()
    connection.close()
    sys.exit(1)

