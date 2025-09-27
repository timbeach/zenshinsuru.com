Backing up the main system to external storage
---
obsidian://open?vault=obsidian&file=daily-notes%2Fdaily-notes-archive%2F2024%2F05%2F2024-05-15-backing-up-main-system-to-external-storage

First I connected the encrypted external storage and decrypted and mounted

``` Shell
# decrypt 
sudo cryptsetup open /dev/sdc1 sdc1crypt

# mount 
sudo mount /dev/mapper/sdc1crypt /mnt2
```

I need to selectively backup what is on byzantium. I should have a more robust way of doing this.
Here are some backup points with rsync commands as I gather them: 

``` Shell
# from ~
rsync -vhrla code/ /mnt2/code
rsync -vhrla Videos/ /mnt2/Videos
rsync -vhrla Pictures/ /mnt2/Pictures
rsync -vhrla --delete Music/ /mnt2/Music
rsync -vhrla Downloads/ /mnt2/Downloads
rsync -vhrla Reading/ /mnt2/Reading
rsync -vhrla Audio/ /mnt2/Audio
rsync -vhrla Documents/ /mnt2/Documents
rsync -vhrla Applications/ /mnt2/Applications
rsync -vhrla Audio/ /mnt2/Audio
rsync -vhrla obsidian/ /mnt2/obsidian
rsync -vhrla stride-tim-obsidian/ /mnt2/stride-tim-obsidian
```

Other items, non-dir
``` Shell
🪶Aegix:[beach✨byzantium ~]$ find ~ -maxdepth 1 -type f
```
A better approach is to rsync directly like this: 
``` Shell
rsync -av --remove-source-files --exclude '*/' /home/beach/ /mnt2/non-dir-bk --dry-run
```
Above worked for backup to encrypted external drive, but now I want to clean up the source ~ 
``` Shell
###
```

Backing up _dots_
List them here:
``` Shell
sudo du -sch .* |sort -h
0       .yarn
4.0K    .abook
4.0K    .dbus
4.0K    .keras
12K     .irssi
16K     .screenlayout
16K     .task
28K     .gnupg.bk
68K     .pki
68K     .ssh
132K    .dotnet
284K    .gnupg
36M     .librewolf
40M     .npm
355M    .vscode-insiders
738M    .local
1.5G    .minecraft
3.6G    .config
33G     .cache
39G     total
```
Do the backup:
``` Shell
find /home/beach/ -maxdepth 1 -name '.*' -exec rsync -av --progress {} /mnt2/dots/ --dry-run \;
```

It's hard to focus on what I need to focus on when my main personal system is broken.

---

I broke the entire byzantium setup by trying to get vpn working on it.

https://packages.artixlinux.org/details/libxml2
wget https://mirror1.artixlinux.org/pool/world/libxml2/libxml2-<version>-<architecture>.pkg.tar.zst

Older version: 
curl -O https://archive.archlinux.org/packages/l/libxml2/libxml2-2.11.5-1-x86_64.pkg.tar.zst

Latest version: 
curl -O https://mirror1.artixlinux.org/pool/world/libxml2/libxml2-2.12.6-2-x86_64.pkg.tar

cd /path/to/package
pacman -U libxml2-2.12.6-2-x86_64.pkg.tar.zst




