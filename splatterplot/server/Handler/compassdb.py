#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: anchen
# @Date:   2018-08-22 19:57:00
# @Last Modified by:   anchen
# @Last Modified time: 2018-08-23 11:00:32
import pymongo
from pymongo import MongoClient

import os
import glob
from os.path import basename

import pandas as pd

dbIP = "localhost" ;

class COMPASSDB:

    def connectDB(self, dbname, dbip, port):
        self._conn = MongoClient(dbip, port) 
        self._db = self._conn[dbname]
        collectionname = "points"
        self._collection = self._db[collectionname]

    def saveMa(self, dataInfo):
        record = self._collection.find_one({"name": dataInfo["name"]})
        print("record", record, record!=None) 
        if(record != None):
            print("exist!") ;
            dots = dataInfo["dots"] ;
            self._collection.update_one({"name": dataInfo["name"]}, {"$set": {"dots": dots}}) ;
        else:
            self._collection.insert(dataInfo) ;
        print("[save] end")

    def getDots(self, maName):
        imgRecord = self._collection.find_one({"name": maName}) ;
        return imgRecord ;