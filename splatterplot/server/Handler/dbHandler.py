
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: anchen
# @Date:   2018-07-26 10:34:19
# @Last Modified by:   anchen
# @Last Modified time: 2018-09-06 10:20:40

import tornado.web
from tornado.options import options

import pymongo

import setting

from Handler.compassdb import COMPASSDB

from bson import BSON
from bson import json_util

import json



ssDB = COMPASSDB() ;
ssDB.connectDB("First", "localhost", 27017)

class SaveDataHandler(tornado.web.RequestHandler):
    def post(self):
        print(" save handler !")
        dots_str = self.get_argument("dots") ;
        dots = json.loads(dots_str) ;
        print("save", dots) ;
        name = self.get_argument("name") ;
        ssDB.saveMa({
            "name": name ,
            "dots": dots,
            }) ;
        self.set_header("Access-Control-Allow-Origin", "*") ;
        self.write({"save": "ok"})

class LoadDataHandler(tornado.web.RequestHandler):
    def post(self):
        print("load handler !")
        name = self.get_argument("name") ;
        dotsRec = ssDB.getDots(name) ;
        #print("load dots", dotsRec["dots"])

        self.set_header("Access-Control-Allow-Origin", "*") ;
        self.write({"dots": dotsRec["dots"]})
