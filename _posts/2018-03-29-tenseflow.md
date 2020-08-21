---
title: 'tenseflow'
date: 2018-03-29
permalink: /posts/2018-03-29-tenseflow
tags:
  - python
---
<img width="400" src="https://github.com/bendichter/tenseflow/blob/master/static/screenshot.png?raw=true" title="tenseflow app" alt="tenseflow app"/>


I was frustrated while changing the tense of a document, and decided to go down the deep dark rabbit hole of creating an
 automatic tense changer. The basic usage is:
 
 ```python
from tenseflow import change_tense

change_tense('I will go to the store.', 'past')
u'I went to the store.'
```

Little did I know, this is a really tough task, for a few reasons. For anyone who wants to venture down this path,
here are a few of the finer points you'll need to deal with:
1. Identifying verbs is harder than it looks. For instance, take the word "<u>vacuum</u>." This word could be used as a noun,
("Please hand me the <u>vacuum</u>.") or verb ("Please <u>vacuum</u> the dining room.") Vacuum is not a special word-
in fact if you think about it, **most** verbs in the English language can be used as nouns and **most** nouns can be used as verbs.
If you blindly convert any word that could be a verb, you'll get nonsense like "Please hand me the <u>vacuumed</u>."
Therefore, in order to properly tense-alter a passage, you need to first parse the sentence to determine what words are
are being used as verbs. You also need to parse their role in the sentence. For instance, infinitives do not change with
tense. (We don't want e.g. "You asked me to <u>vacuumed</u>)".
2. Once you have identified which word you want to change, there are so many irregular verbs and special rules, you
really need an entire dictionary to do this properly.
3. There are more tenses in English than you might realize. Common wisdom is that we have 3: past, present, and future.
In fact, there are 12, and each of them has three modes: affirmative, negative, and interrogative.
4. There are all sorts of cases where you would want to have multiple tenses in the same sentence, and there isn't really
a good way to infer this automatically.

<img width="400" src="https://lessonsforenglish.com/wp-content/uploads/2019/12/12-Tenses-Formula-With-Examples.png" title="table of tenses" alt="table of tenses"/>

Despite these obstacles, I managed to make a tool that works... OK. It comes with a web-app.
Check it out on GitHub [here](https://github.com/bendichter/tenseflow).
