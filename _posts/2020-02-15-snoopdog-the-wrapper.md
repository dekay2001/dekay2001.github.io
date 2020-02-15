---
layout: post
title:  "snoopdog the wrapper"
categories: [professional, software]
tags: [python, coding, wrapper functions, snoop dogg, rapper, humor]
---
{{ page.date | date: "%m/%d/%Y" }}
 
I know what you are thinking, the title is spelled wrong.  Rest assured, this is not the case.  
 
This is a short story about a block of code that I recently had to remove from a python project during a large refactor.
 
Without further adieu, let me introduce you to snoopdog, the wrapper, unabridged, and unchanged.
 
```python
def snoopdog(func):
    def wrapper(*args, **kwargs):
        caller_name = inspect.stack()[1][3]
        if caller_name != 'before_request':
            raise Exception('Unexpected db session request from ({}).  \
                It should only be used in before_request'.format(caller_name))
            # import ipdb; ipdb.set_trace()
        return func(*args, **kwargs)
    return wrapper
```
 
### Snoop Dogg the Rapper
For those who don't know Snoop Dogg, he is one of the most recognizable and well known rappers who got started in rap in the 90's.  A lot of his music was and still remains controversial.  He is an O.G. from way back, and I've always been a big fan.  I've seen him perform live on 4 occasions at this point.  This story is NOT about him, but I must give credit where credit is due.  Without Snoop Dogg the rapper, snoopdog the wrapper would never exist.
 
Here is a video from a concert I attended last summer at the Bank of New Hampshire Pavilion
 
[Bank of New Hampshire Pavilian](https://www.banknhpavilion.com/ "Bank of New Hampshire Pavilion")
<iframe width="420" height="315" src="/assets/videos/2019-snoop-dogg-concert.mp4" frameborder="0" allowfullscreen></iframe>
 
### snoopdog the wrapper
I'm proud to say I had my hand in writing this function in my early days of python programming.  It was a time when I was learning how to write a Flask application that connected to a database using sqlalchemy.  Needless to say I was trying to solve a problem that had already been solved by other libraries that I wasn't aware of.  Basically I was trying to ensure that I always had a database session initialized for any request sent to my Flask application, and that any database connections were properly cleaned up.    The other members of my team were also learning python, and we previously had some issues with this in code where we were exhausting the db connection pool.  To solve the problem, let me introduce snoopdogg the wrapper (function).  The function got its name on a whim, after we determined we were ultimately trying to snoop around on the call stack to ensure that our database session initialization was originating in a different "before_request" function used by Flask.
 
Ultimately the session management that I came up with created an enormous amount of technical debt, making it very difficult to remove snoopdog and my relentless use of the Flask g.session which is where I was putting my initialized session.  Two days ago, after a week of refactoring, I was finally able to remove snoopdog and my use of g.session, and it saddened me to see it go.  
 
### A Tribute
So here is my tribute, to snoopdog the wrapper, and Snoop Dogg the rapper.  Thanks for being a topic of comic relief and frustration to me and my team for the last few years.  Some of us have taken much pleasure and delight in listening to managers and senior developers complain about the pains he caused and need to get rid of snoopdog the wrapper.  I’m pouring one out for you this evening in your name.
