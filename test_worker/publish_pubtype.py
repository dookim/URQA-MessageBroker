import sys
import pika


credentials = pika.PlainCredentials('guest', 'guest')
parameters  = pika.ConnectionParameters(host='14.63.164.245',
                                        port=5672,
                                        credentials=credentials)

connection  = pika.BlockingConnection(parameters)
channel     = connection.channel()


channel.exchange_declare(exchange='ur-exchange',type='fanout')

message = 'info: Hello World!'

channel.basic_publish(exchange='ur-exchange',
                      routing_key='',
                      body=message)

print " [x] Sent %r" % (message,)
connection.close()


