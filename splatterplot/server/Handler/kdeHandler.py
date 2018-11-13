#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: anchen
# @Date:   2018-08-22 20:49:12
# @Last Modified by:   anchen
# @Last Modified time: 2018-11-10 11:29:59

import tornado.web
from tornado.options import options

import pymongo
from pymongo import MongoClient

import setting

import json

from scipy import stats
import numpy as np

import math

from Handler.compassdb import COMPASSDB

maDB = COMPASSDB() ;
maDB.connectDB("First", "localhost", 27017)

class Distance():
    def distanceCompute(self, dotInfo):
        
        sourceAndTarget = []
        print("compute distance")
        
        for i in range(0, len(dotInfo)):
            minDistance = 9999
            #print("number i:",i)
            #if( i+1 != len(dotInfo)):
            for j in range(0, len(dotInfo)):
                if(j == i):
                    continue
                else:
                    #print("number j:",j)
                    dx = abs(dotInfo[i]["x"] - dotInfo[j]["x"])
                    dy = abs(dotInfo[i]["y"] - dotInfo[j]["y"]) 
                    distance = math.sqrt(dx*dx + dy*dy)
                    if(distance < minDistance):
                        minDistance = distance
                        mintarget = j
            print("source:",i)
            print("target:",mintarget)    
            print("minDistance",minDistance)
            sourceAndTarget.append({
                "source" : i ,
                "target" : mintarget,
                "mindistance": minDistance,
            })

        print("sourceAndTarget", sourceAndTarget)
        return sourceAndTarget

class KDE():

    def listZip(self, m1, m2):
        list1 = list(m1)
        list2 = list(m2)
        return list(zip(list1, list2))

    def kde(self, m1, m2, xmin, xmax, ymin, ymax):
        X, Y = np.mgrid[xmin:xmax:800j, ymin:ymax:800j];
        #print("X",X)
        #print("Y",Y)
        positions = np.vstack([X.ravel(), Y.ravel()]) ;
        #print("positions", positions) 
        values = np.vstack([m1, m2]) ;
        #print("values", values) ;
        kernel = stats.gaussian_kde(values)
        #print("kernel", kernel) 
        Z = np.reshape(kernel(positions).T, X.shape)
        #print(" shape Z ", Z.shape)
        #print("rot90(Z)",np.rot90(Z))
        return np.rot90(Z)

KDEContour = KDE()
DistanceField = Distance()

class KDEHandler(tornado.web.RequestHandler):
    def post(self):
        print(" KDE handler ") ;
        self.set_header("Access-Control-Allow-Origin", "*")
        dataName = json.loads(self.get_argument("name")) ;
        dotInfo = maDB.getDots(dataName) ;

        classIdDots = dotInfo["dots"] ;
        liCluster = []
        distanceCollect = []
        contourPar = []
        xmin = 0;
        xmax = 800 ;
        ymin = 0;
        ymax = 800;

        for classId, dots in classIdDots.items():
            #print("classid", classId, len(dots))

            liDistance = DistanceField.distanceCompute(dots)
            m1, m2 = self.getXY(dots) ;  


            #print("m1",m1)

            #print("m2",m2)

            liDot1 = KDEContour.listZip(m1, m2)

            Z1 = KDEContour.kde(m1, m2, xmin, xmax, ymin, ymax) ;   
            liDensity = list(Z1.ravel())
            #print("Density Min, Max", min(liDensity), max(liDensity))   
            liCluster.append({
                "classId": classId,
                "dots": liDot1 ,
                "densitys": liDensity,
                "mindensity": Z1.ravel().min(),
                "maxdensity": Z1.ravel().max(),
                "lidistance": liDistance,
                
            })

        #print("liCluster:", liCluster)
        self.write({"clusters": liCluster, "mm": [xmin, xmax, ymin, ymax]})


    def getXY(self, liDotInfo):
        liX = [] ;
        liY = [] ;
        print("len(liDotInfo)", len(liDotInfo))
        for i in range(0, len(liDotInfo)):
            ##print("i",i) ;
            ##print("liDotInfo:" ,liDotInfo[i])
            liX.append(liDotInfo[i]['x'])
            liY.append(liDotInfo[i]['y'])
        ##print("liX:",liX)
        ##print("liY:", liY)
        return np.array(liX), np.array(liY)  
