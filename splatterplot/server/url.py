#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: anchen
# @Date:   2018-07-26 11:31:17
# @Last Modified by:   anchen
# @Last Modified time: 2018-08-28 15:58:21

from Handler.kdeHandler import KDEHandler
from Handler.dbHandler import SaveDataHandler
from Handler.dbHandler import LoadDataHandler

url = [
        (r'/clusterKDE',KDEHandler),
        (r'/saveData',SaveDataHandler),
        (r'/loadData',LoadDataHandler),
]