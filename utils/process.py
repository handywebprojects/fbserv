import threading
import os
import subprocess

from utils.misc import GETANSI, ANSI_BRIGHTRED, ANSI_UNDERLINE, ANSI_ENDC

class Process:
    def __init__(self, args):

        #print("create process from", args)

        self.args = args
        self.command = args.get("command", None)
        self.add_cwd_to_command = args.get("add_cwd_to_command", False)
        self.command_args = args.get("command_args", [])
        self.working_dir = args.get("working_dir", None)
        self.add_cwd_to_working_dir = args.get("add_cwd_to_working_dir", False)
        self.read_stdout_callback = args.get("read_stdout_callback", None)
        self.read_stderr_callback = args.get("read_stderr_callback", None)
        self.terminated_callback = args.get("terminated_callback", None)
        self.verbose = args.get("verbose", False)

        self.cwd = os.getcwd()

        self.command_path = self.command
        if self.add_cwd_to_command:
            self.command.path = os.path.join(self.cwd, self.command)        
        
        self.working_dir_path = self.working_dir
        if ( not ( self.working_dir is None ) ) and self.add_cwd_to_working_dir:
            self.working_dir_path = os.path.join(self.cwd, self.working_dir)

        self.command_and_args = [self.command_path]
        if not ( self.command_args is None ):
            self.command_and_args += self.command_args

        self.popen_args = {                        
            "stdin": subprocess.PIPE,
            "stdout": subprocess.PIPE,
            "stderr": subprocess.PIPE,            
            "bufsize": 1,  # Line buffering
            "universal_newlines": True,        
        }        

        if not ( self.working_dir_path is None ):
            self.popen_args["cwd"] = self.working_dir_path

        print(f"open process {self.command_and_args}")

        if self.verbose:            
            print(f"working dir {self.working_dir_path}")
            print(f"popen args {self.popen_args}")

        self.process = subprocess.Popen(self.command_and_args, **self.popen_args)

        self.stdin_lock = threading.Lock()

        self.read_stdout_thread = None
        if not ( self.read_stdout_callback is None ):
            self.read_stdout_thread = threading.Thread(target = self.read_stdout_thread_target)
            self.read_stdout_thread.daemon = True
            self.read_stdout_thread.start()
            if self.verbose:
                print("read stdout thread started")

        self.read_stderr_thread = None
        if not ( self.read_stderr_callback is None ):
            self.read_stderr_thread = threading.Thread(target = self.read_stderr_thread_target)
            self.read_stderr_thread.daemon = True
            self.read_stderr_thread.start()
            if self.verbose:
                print("read stderr thread started")

    def read_stdout_thread_target(self):
        while True:
            line = self.process.stdout.readline()

            if not line:
                break

            sline = line.rstrip()

            if not ( self.read_stdout_callback is None ):
                self.read_stdout_callback(sline)

        self.process.stdout.close()
        with self.stdin_lock:
            self.process.stdin.close()

        if self.is_alive():
            self.terminate()
            self.wait_for_return_code()

        if not ( self.terminated_callback is None ):
            self.terminated_callback()

    def read_stderr_thread_target(self):
        while True:
            line = self.process.stderr.readline()

            if not line:
                break

            sline = line.rstrip()
            
            if not ( self.read_stderr_callback is None ):
                self.read_stderr_callback(sline)

    def send_line(self, sline):        
        with self.stdin_lock:
            self.process.stdin.write(sline + "\n")
            self.process.stdin.flush()

    def is_alive(self):
        return self.process.poll() is None

    def terminate(self):
        self.process.terminate()

    def kill(self):
        self.process.kill()

    def wait_for_return_code(self):
        self.process.wait()
        return self.process.returncode

    def pid(self):
        return self.process.pid

    def __repr__(self):
        return "[Process at {} (pid={})]".format(hex(id(self)), self.pid())

class ProcessManager:
    def __init__(self, args):
        self.args = args
        self.name = args.get("name", None)
        self.verbose = args.get("verbose", False)
        if self.name is None:
            self.name = args.get("command", None)
        self.process = None
        self.ansicolor = GETANSI(args.get("color", "BRIGHTYELLOW"))
        print(self.ansicolor, end = "")
        self.args["read_stdout_callback"] = self.read_stdout_callback
        self.args["read_stderr_callback"] = self.read_stderr_callback

    def read_stdout_callback(self, sline):
        print("{}{} > {}".format(self.ansicolor, self.name, sline))

    def read_stderr_callback(self, sline):
        print("{}{} ! {}".format(ANSI_BRIGHTRED, self.name, sline))

    def start(self):
        if not ( self.process is None ):
            print("{} already started".format(self.name))        
            return
        self.process = Process(self.args)

    def stop(self):
        if self.process is None:
            print("{} already stopped".format(self.name))        
            return
        self.process.kill()
        self.process = None

    def wait_for_return_code(self):
        if self.process is None:
            print("{} already stopped".format(self.name))        
            return 0

        self.process.read_stdout_thread.join()

        returncode = self.process.wait_for_return_code()

        if self.verbose:
            print(f"{ANSI_ENDC}{ANSI_UNDERLINE}{self.name} terminated with code {returncode}{ANSI_ENDC}")

        return returncode

def runcmd(args):
    procman = ProcessManager(args)
    procman.start()
    return procman.wait_for_return_code()
