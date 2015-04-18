#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

############################################
# leave these the same in devel and publish

# metadata
AUTHOR = 'Kevin Sprong'
SITENAME = 'kevinsprong.com'
TIMEZONE = 'US/Eastern'
DEFAULT_LANG = 'en'

# settings/paths
THEME = 'themes/krs'
THEME_STATIC_DIR = 'theme'

# site layout and page info
DEFAULT_DATE_FORMAT = ('%a %B %d %Y')

TEMPLATE_PAGES = {'themes/krs/templates/projects.html': 'projects.html',
                  'themes/krs/templates/resume.html': 'resume.html',
                  'themes/krs/templates/about.html': 'about.html'}
STATIC_PATHS = ['favicon.ico', 'LICENSE.txt', 'images', 'projects']

AUTHOR_SAVE_AS = False
AUTHORS_SAVE_AS = False

DEFAULT_PAGINATION = False
ARTICLE_DIR = 'raw_posts'
ARTICLE_URL = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'


############################################
# change these when publishing
SITEURL = '' #'http://yoursite.com' to publish
ROOTDIR = '/path/to/your/local/directory' #'/' to publish

# change all of these, or don't
FEED_ATOM = None
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

GOOGLE_ANALYTICS = '' #'UA-XXXXXXXX-Y'


