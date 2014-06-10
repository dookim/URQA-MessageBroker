import os
import time
from URQAProcess import URQAProcess
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.multipart import MIMEBase
from email.mime.text import MIMEText
from email import Encoders
from email import Utils
from email.header import Header

# pegasus command 
# apache2 pid file path "/var/run/apache2.pid" or command: "service apache2 status"

# PIDS_DIR_PATH change
# PIDS_DIR_PATH = os.path.abspath(os.path.dirname(__file__)) + '/pid'
PIDS_DIR_PATH = '/var/run/urqa-workers/'
print PIDS_DIR_PATH
NOTIFY_RETRY_COUNT = 10
WAIT_TIME = 10

# process state
activate = True
# retry count
retry = 0

def read_file(file_name):

    path_and_name = PIDS_DIR_PATH + file_name

    with open(path_and_name) as pid_file:
        pid = pid_file.readline()
        pid = pid.rstrip()
        data = {'fullpath': path_and_name, 'pid': pid, 'script_name': file_name}
        return data

def read_pids():

    global ps_data
    print PIDS_DIR_PATH
    pid_files = os.listdir(PIDS_DIR_PATH)
    ps_data = map(read_file, pid_files)
    print ps_data

def prepare():
    global processes
    processes = []

    for data in ps_data:
        process = URQAProcess(data)
        processes.append(process)

def send_mail(from_user, pwd, to_user, cc_users, subject, text, attach):
        COMMASPACE = ", "
        msg = MIMEMultipart("alternative")
        #msg =  MIMEMultipart()
        msg["From"] = from_user
        msg["To"]   = to_user
        msg["Cc"] = COMMASPACE.join(cc_users)
        msg["Subject"] = Header(s=subject, charset="utf-8")
        msg["Date"] = Utils.formatdate(localtime = 1)
        msg.attach(MIMEText(text, "html", _charset="utf-8"))

        if (attach != None):
                part = MIMEBase("application", "octet-stream")
                part.set_payload(open(attach, "rb").read())
                Encoders.encode_base64(part)
                part.add_header("Content-Disposition", "attachment; filename=\"%s\"" % os.path.basename(attach))
                msg.attach(part)

        smtp_server  = "smtp.gmail.com"
        port         = 587

        smtp = smtplib.SMTP(smtp_server, port)
        smtp.starttls()
        smtp.login(from_user, pwd)
        print "gmail login OK!"
        smtp.sendmail(from_user, cc_users, msg.as_string())
        print "mail Send OK!"
        smtp.close()

read_pids()
prepare()

while True:
    for process in processes:
        print process
        if process.is_alive():
            print "alive"
        else:
            process.retry()
            send_mail("urqanoti@gmail.com","@urqa@stanly","doo871128@gmail.com",["doo871128@gmail.com","wolfses@hotmail.com","indigoguru@gmail.com","pegasuskim@gmail.com"],"[ERROR Report] GNA Worker dead!!","GNA Worker dead!!",None)
    time.sleep(WAIT_TIME)

'''
def notify_if_needed(retry):
    if retry > NOTIFY_RETRY_COUNT:
        # send email or something
        # exit processes
    return
'''
        
'''
def need_to_wait(activate):
    if activate == False:
        print "Wating..."

        notify_if_needed(retry)
    
        retry++
        
        # waiting few secs
        time.sleep(0.5)
        
        # reset PID
        get_process_info()
        
        return True
    else:
        retry = 0
        return False

def get_process_info():
    print "Get process info"

    try:
        p = psutil.Process(pid)
    except:
        p = None
    
    if p.is_running():
        activate = True
    else:
        activate = False

while True:
    if need_to_wait(activate):
        continue

    if p is None:
        activate = False
        continue
    
    is_running = p.is_running()
    if is_running:
        activate = True
        time.sleep(0.5)
    else:
        activate = False
        print "WhatTheHuck?"
        # run shell script
'''

