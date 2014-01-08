import sys
import pika
import json

credentials = pika.PlainCredentials('guest', 'guest')
parameters  = pika.ConnectionParameters(host='14.63.164.245', 
                                        port=5672, 
                                        credentials=credentials)

connection  = pika.BlockingConnection(parameters)
channel     = connection.channel()

channel.queue_declare(queue='ur-queue', durable=True)

message = 'urqa-test message!!!'
channel.basic_publish(exchange='',
                      routing_key='ur-queue',
                      body = message)

'''
channel.exchange_declare(exchange='urqa-exchange',
                         type='topic',
                         durable=True)

channel.basic_publish(exchange='',
                      routing_key='task_queue',
                      body=message,
                      properties=pika.BasicProperties( delivery_mode = 2, # make message persistent ))

'''

print " [x] Sender %r" % (message,)
connection.close()



