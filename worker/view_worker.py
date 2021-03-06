
# -*- coding: utf-8 -*-

import sys
import pika
import json
import MySQLdb as db

import subprocess
import datetime
import datetime
import logging

#logging.getLogger('pika').setLevel(logging.DEBUG)
logger = logging.getLogger('logger')
handler = logging.FileHandler('/home/gumidev/workspace/gna/log/gna.log')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


'''
from django.http import HttpResponse
from model import Project
from model import Appruncount
from model import Session
'''
'''
db address : ur-qa.com  14.63.164.245
db port : 3306
db id : root
db pw : stanly
'''
credentials = pika.PlainCredentials('urqa', 'urqa')
parameters  = pika.ConnectionParameters(host='14.63.164.245', 
                                        port=5672, 
                                        credentials=credentials)


connection  = pika.BlockingConnection(parameters)
channel     = connection.channel()

channel.queue_declare(queue='urqa-queue', durable=True)
channel.queue_bind(exchange ='urqa-exchange', queue = 'urqa-queue')

try:
    con = db.connect(host='14.63.164.245',port=3306, user = 'root',passwd='stanly',db='gna');
    con.autocommit(True)  

    cur = con.cursor()
    cur.execute("SELECT VERSION()")
    ver = cur.fetchone()
    print " [*] Database version : %s " % ver
    cur.close()
except db.Error, e:
        print "Error %d: %s" % (e.args[0],e.args[1])
        logger.error('database connect')
        sys.exit(1)
finally:    
    pass
        #if con:
            #con.close()


'''

    if infoType == 'access':  # or infoType == 'dailyaccesslog':
        time = datetime.datetime.fromtimestamp(int(logData['timestamp'])).strftime('%Y-%m-%d %H:%M:%S')
        print(time)
        cur  = con.cursor()
        query = "INSERT INTO gamelog_dailyaccesslog(`osuser_id`,`accessed_at`,`is_smartphone`,`device`) VALUES ('{}','{}',{}, {});".format(logData['aid'], time, logData['is_smartphone'], logData['device']);
        print "access query-> %r\n" % query
        try:
            cur.execute(query)
            cur.close()
            print "access data insert ok!!\n\n"
        except:
            logger.error('Access data insert Error\n')
            logger.error(query)
'''



#channel.queue_declare(queue='if-push-queue',durable= True,auto_delete=False)
#channel.basic_publish(exchange = 'if-push-exchange')
print " [*] Waiting for messages. To exit press CTRL+C"

def callback(ch, method, properties, body):

    print " [x] Received %r\n\n" % (body,)

    firstData = json.loads(body,encoding='utf-8')
   
    # 데이터 형식
    #var data = { 'tag':'connect', 'data': req.body }; 
    
    tag = firstData['tag']
    body = firstData['data']

    if tag == 'connect':
        jsonData = json.loads(body,encoding='utf-8')

        #step1: apikey를 이용하여 project찾기
        try:
            apikey = jsonData['apikey']
            projectElement = Projects.objects.get(apikey=apikey)
        except ObjectDoesNotExist:
            print 'Invalid from client(connect)'
            return HttpResponse(json.dumps({'idsession':'0'}), 'application/json');

        #step2: idsession 발급하기
        appversion = jsonData['appversion']
        idsession = long(time.time() * 1000)
        #Session.objects.create(idsession=idsession,pid=projectElement,appversion=appversion)
        #print 'Project: %s, Ver: %s, new idsession: %d' % (projectElement.name,appversion,idsession)

        #step3: app version별 누적카운트 증가하기
        appruncountElement, created = Appruncount.objects.get_or_create(pid=projectElement,appversion=appversion,defaults={'runcount':1},date=getUTCawaredate())
        if created == False:
            appruncountElement.runcount += 1
            appruncountElement.save()
        else:
            print 'project: %s, new version: %s' % (projectElement.name,appruncountElement.appversion)
        return HttpResponse(json.dumps({'idsession':idsession}), 'application/json');

    #if tag == 'receive_exception'
    #if tag == 'receive_native'
    #if tag == 'receive_eventpath'
    #if tag == 'receive_native_dump'
    #if tag == 'receive_exception_log'


if __name__ == '__main__':
    try:
        channel.basic_consume(callback, queue='urqa-queue', no_ack=True)
        channel.start_consuming()
    except (KeyboardInterrupt):#, SystemExit):
        print " [*]Program Exit....\n"
        
    channel.stop_consuming()
    connection.close()
    sys.exit(1)

