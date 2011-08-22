import os
from fabric.api import *

env.s3_bucket = "nprstateimpact"
env.prefix = "widget"

here = os.path.realpath(os.path.dirname(__file__))

def deploy():
    os.chdir(here)
    local('jammit')
    local('s3cmd sync -P -M public/assets/ s3://%(s3_bucket)s/%(prefix)s/' % env)