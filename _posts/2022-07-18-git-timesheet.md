---
title: 'Git Timesheet'
date: 2022-07-18
permalink: /posts/2022-07-18-git-timesheet
tags:
- matplotlib
- python
---

I recently faced a situation where I needed to assess the amount of work
done by each member of a team on a project that has spanned over a year.
That project has a git repo, and I could see when each person made a commit.
I decided to break it down by weeks. Whenever a person submitted any commit
to the repo on any branch, I counted them as working on the project for that week.
Of course this is imperfect- someone could work a lot and make no commits for
that week and someone could have submitted a commit but might have worked very
little. Still, this seems like the most fair way to assess work I could think of.


The code will work on any locally cloned git repo. `skip` allows you to remove
contributors, and is ideal for handling bots. `author_map` allows you to tranform
handles. This is ideal if members of your team make some contributions through PRs
from a clone of the repo and some of their PRs through GitHub directly, or if
they have multiple usernames.

```python
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tqdm
import datetime
import matplotlib

def git_timesheet(git_dir, skip=None, author_map=None):
    
    if skip is None:
        skip = [
            "dependabot[bot]",
            "!git for-each-ref --format='%(refname:short)' `git symbolic-ref HEAD`",
        ]
    
    if author_map is None:
        author_map = dict()

    os.system(f"git --git-dir {git_dir}/.git log --all --numstat --pretty=format:'--%h--%ad--%aN' --no-renames > git.log")

    commits = pd.read_csv("git.log", sep="\u0012", header=None, names=['raw'])

    commit_marker = commits[commits['raw'].str.startswith("--",na=False)]
    commit_info = commit_marker['raw'].str.extract(r"^--(?P<sha>.*?)--(?P<date>.*?)--(?P<author>.*?)$", expand=True)
    commit_info['date'] = pd.to_datetime(commit_info['date'])

    file_stats_marker = commits[~commits.index.isin(commit_info.index)]
    file_stats = file_stats_marker['raw'].str.split("\t", expand=True)
    file_stats = file_stats.rename(columns={0: "insertions", 1: "deletions", 2: "filename"})
    file_stats['insertions'] = pd.to_numeric(file_stats['insertions'], errors='coerce')
    file_stats['deletions'] = pd.to_numeric(file_stats['deletions'], errors='coerce')

    commit_data = commit_info.reindex(commits.index).fillna(method="ffill")
    commit_data = commit_data[~commit_data.index.isin(commit_info.index)]
    commit_data = commit_data.join(file_stats)

    # get total authors and weeks
    all_authors = commit_data["author"].unique()
    all_authors = list(np.unique([author_map.get(x, x) for x in all_authors if x not in skip]))
    
    dates = commit_data["date"]
    start = dates.min()
    stop = dates.max()

    n_weeks = (stop-start).days // 7

    timesheet = np.zeros((len(all_authors), n_weeks))

    # iterate over commits and timesheet per week
    for week_n in tqdm.trange(n_weeks):
        week_start = start + datetime.timedelta(7 * (week_n-1))
        week_stop = start + datetime.timedelta(7 * week_n)
        commit_data_for_week = commit_data[(week_start < commit_data["date"]) & (commit_data["date"] < week_stop)]
        authors_for_week = commit_data_for_week["author"].unique()
        # handle different usernames
        authors_for_week = list(np.unique([author_map.get(x, x) for x in authors_for_week]))
        for i, author in enumerate(all_authors):
            if author in authors_for_week:
                timesheet[i, week_n] = 1

    fig, ax = plt.subplots(figsize=(30, 10))
    ax.imshow(timesheet, cmap="Greys")
    ax.set_yticks(range(len(all_authors)))
    _ = ax.set_yticklabels(all_authors)
    ax.set_xlabel("weeks")

    plt.minorticks_on()
    plt.gca().xaxis.set_minor_locator(matplotlib.ticker.MultipleLocator(1))
    plt.gca().yaxis.set_minor_locator(matplotlib.ticker.MultipleLocator(1))
    plt.grid(which="both", linewidth=0.25, color="k")
```
I developed a function for parsing the git log and creating a visualization
of weeks worked by each member. The repo I used this for is private, so I will
demonstrate it on a separate repo from CatalystNeuro that is public.
```python
git_timesheet(
    "path/to/nwb-conversion-tools",
    author_map={
        "bendichter": "Ben Dichter",
        "luiz": "Luiz Tauffer",
        "luiztauffer": "Luiz Tauffer",
        "CodyCBakerPhD": "Cody Baker",
        "h-mayorquin": "Heberto Mayorquin",
        "sbuergers": "Steffen Bürgers",
        "weiglszonja": "Szonja Weigl",
    }
)
```

![git-timesheet](../../git-timesheet.png)