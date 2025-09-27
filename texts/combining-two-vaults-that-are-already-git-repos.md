The goal here is to take two distinct obsidian vault folders (which we will call directories hence forth) and combine them into a single, unified obsidian vault.

I'm going to do this now and document the steps as I go.

These are the two folders I'm using for this example. I'm going to use the real names of the folders instead of `dir1-obsidian-vault` and `dir2`, because reasons. (I'm an old person with a fragile brain.)

These two directories contain two distinct obsidian vaults. I use the one called `obsidian` for personal work, and the one called `stride-tim-obsidian` for evil_corp work.

You know what, I will call them `dir1` and `dir2` for brevity, but in the examples you'll see the real names.
``` Shell
dir1=obsidian
dir2=stride-tim-obsidian
```

The first thing we'll do is backup `dir2` like this: 
``` Shell
cp -r stride-tim-obsidian stride-tim-obsidian.bk
```

Now in case we biff something, we can always restore from `dir2.bk`.

After we have a safe copy of the directory we are going to move, let's just move it into `dir1` like this: 
``` Shell
🪶Aegix:[beach✨byzantium ~]$ mv stride-tim-obsidian obsidian
renamed 'stride-tim-obsidian' -> 'obsidian/stride-tim-obsidian'
```

Phew. We're done! (=🝦ﻌ🝦=).. just kidding.

Next we'll add `dir2` to the repo in `dir1`'s `.gitignore` file like this: 
(I'm assuming you know how to use vim, if not, stop and learn that first. Type `vimtutor` into your terminal and work through that; then come back when you can interact with a computer like a civilized human.)
```
vim obsidian/.gitignore
```
Add a line like this based on the real name of your personal `dir2`: 
```
dir2/
```

_Side Note:_ If you already messed this up and added your `dir2` to your `dir1` git, you can remove it after adding it to your `.gitnore` file like this: `git rm -r --cached dir2` (obviously from within your `dir1` repo.

For context, here's what my `dir1` .gitignore looks like now: 
``` Shell
.obsidian/workspace
.obsidian/workspace.json.bk
.obsidian/workspace.json
.obsidian/workspace.json
.obsidian/themes/
stride-tim-obsidian/
```

We're getting close. We just need to neutralize the `dir2/.obsidian` directory so that obsidian doesn't get confused.
``` Shell
🪶Aegix:[beach✨byzantium ~]$ mv obsidian/stride-tim-obsidian/.obsidian obsidian/stride-tim-obsidian/.obsidian.bk
renamed 'obsidian/stride-tim-obsidian/.obsidian' -> 'obsidian/stride-tim-obsidian/.obsidian.bk'
```

Done.

Let's validate by entering `dir1` and making sure that git isn't picking up anything about or in `dir2`.
``` Shell
🪶Aegix:[beach✨byzantium ~/obsidian]$ which sta
sta: aliased to git status
🪶Aegix:[beach✨byzantium ~/obsidian]$ which gg
gg: aliased to add && commit && push
🪶Aegix:[beach✨byzantium ~/obsidian]$ which add
add: aliased to git add -A
🪶Aegix:[beach✨byzantium ~/obsidian]$ which commit
commit: aliased to git commit -m "$(date +"%D %T")"
🪶Aegix:[beach✨byzantium ~/obsidian]$ which push
push: aliased to git push
🪶Aegix:[beach✨byzantium ~/obsidian]$ sta
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Let's enter `dir2` and make sure our separate git repo there is still functional.
``` Shell
🪶Aegix:[beach✨byzantium ~/obsidian/stride-tim-obsidian]$ sta
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Now `dir2` as a separate repo, ignored by `dir1`'s repo is unified in the eyes of obsidian, but still separate in the eyes of git.