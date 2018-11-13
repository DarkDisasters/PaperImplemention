from tornado.options import define,options

define("port", default=30001, help="run on the given port", type=int)