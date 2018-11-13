#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: anchen
# @Date:   2018-07-26 11:00:39
# @Last Modified by:   anchen
# @Last Modified time: 2018-08-23 15:12:43

from url import url
import tornado.web
import os

setting = dict(
    template_path=os.path.join(os.path.dirname(__file__), "./"),
    static_path = os.path.join(os.path.dirname(__file__),"./")       #当前目录
    
)

application = tornado.web.Application(
    handlers = url,
    debug = True,
    **setting,
    
)