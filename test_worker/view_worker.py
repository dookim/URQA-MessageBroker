
# -*- coding: utf-8 -*-

import sys
import pika
import json

import subprocess
import datetime

from urqa.models import Appruncount
from django.http import HttpResponse

from urqa.models import Projects
from urqa.models import Session
'''
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist


from urqa.models import Sessionevent
from urqa.models import Projects
from urqa.models import Errors
from urqa.models import Instances
from urqa.models import Eventpaths
from urqa.models import Tags

from urqa.models import Sofiles
from urqa.models import Appstatistics
from urqa.models import Osstatistics
from urqa.models import Devicestatistics
from urqa.models import Countrystatistics
from urqa.models import Activitystatistics
from urqa.models import Proguardmap

from utility import naive2aware
from utility import getUTCDatetime
from utility import getUTCawaredate
from utility import RANK
from config import get_config
'''


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

    firstData = json.loads(body,encoding='utf-8')
   
    # 데이터 형식
    #var data = { 'tag':'connect', 'data': req.body }; 
    
    tag = firstData['tag']
    body = firstData['data']

    if tag == 'connect':
        jsonData = json.loads(body,encoding='utf-8')
        #print jsonData

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

