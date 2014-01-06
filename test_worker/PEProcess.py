import os
import subprocess
import psutil

class PEProcess:
    def __init__(self, ps_data=None):
        """PE!!! Process"""
        if ps_data is None:
            print "PID filename must be not null"
            raise
        self.fullpath = ps_data['fullpath']
        self.pid = int(ps_data['pid'])
        self.script_name = os.getcwd() + '/run-' + ps_data['script_name'].split('.')[0]
        print self.script_name
        self.retried = False
        self.alive = False

        self.get_process()

    def read_pid(self):
        with open(self.fullpath) as pid_file:
            self.pid = int(pid_file.readline().rstrip())

    def get_process(self):
        self.process = psutil.Process(self.pid)
        if self.process.is_running():
            self.alive = True
            self.retried = False
        else:
            self.alive = False

    def is_alive(self):
        if self.process is None:
            return False
        return self.process.is_running()

    def retry(self):
        # get_process_info()
        if self.retried:
            self.read_pid()
            self.get_process()
            return
        print self.script_name
        subprocess.call(["/bin/sh", self.script_name, "start"])
        self.retried = True

    def __repr__(self):
        return "PEProcess: " + self.fullpath + '(' + str(self.pid) + ')'

    def __str__(self):
        return "PEProcess: " + self.fullpath + '(' + str(self.pid) + ')'

