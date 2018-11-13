#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date:   2018-07-26 10:35:25
# @Last Modified time: 2018-08-23 15:09:48

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import sys

from application import application
from tornado.options import options
import setting

def main():
    tornado.options.parse_command_line() 
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    print('Server is running at http://127.0.0.1:%s/' %options.port)
    print('Quit the server with Ctrl-C')
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()
