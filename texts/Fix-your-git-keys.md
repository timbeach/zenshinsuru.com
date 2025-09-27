In case you migrated a git repo from one machine to another and you've fumbled your keys or something to the point where your `git pull` attempt complains about permission being denied, try this:

cd to the repo

Identify which key will work. I found it. .haha
```
🪶Aegix:[beach✨byzantium ~co/stride/1-apps/stride-sims]$ ssh -i ~/.ssh/id_rsa_stride -T git@bitbucket.org authenticated via ssh key. You can use git to connect to Bitbucket. Shell access is disabled
```

You can `ll ~/.ssh/` to list out your keys.
If you're a disorganized trash panda like me, you might not remember which key went to which repo. This could imply several things about your psyche, but we won't go into that now. 

Once you're at your repo in your shell, you can try your keys one by one: 
```
ssh -i ~/.ssh/private-key-1-path -T git@bitbucket.org
```
Of course `git@bitbucket.org` can be whatever.

Then once you get a response like: 
```
authenticated via ssh key
```
instead of something like this: 
```
Permission denied (publickey).
```
you can set the proper key like this: 

```
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_yours -F /dev/null"
```

Then you can test it with: 
```
git config --get core.sshCommand
```
or just run `git pull`.

The end⋆˚ﮩ٨ـﮩﮩ٨ـ♡ﮩ٨ـﮩﮩ٨ـ˚⋆