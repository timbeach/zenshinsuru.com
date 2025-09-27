## Problem

- Amazon only provides postgresql versions up to 14.
- There are still rpm files that can be located online to obtain:
	- `postgresql16-16.1-1PGDG.rhel8.x86_64.rpm`
	- `postgresql16-libs-16.1-1PGDG.rhel8.x86_64.rpm`
- Manually installing these produces a dependency hell situation with `libreadline.so.7`
	- This can be found online and built and compiled from source but even with the right symlinks in place, yum won't recognize that it is installed.

## Solution

Since the system recognizes `libreadline.so.7` but `yum` does not, let's try creating a `provides` file manually. This is a workaround that may help `yum` recognize the library.

### Step 1: Create the `provides` File

1. **Create a new file for `libreadline.so.7`**:
    
    `sudo nano /etc/yum.repos.d/local-provides.repo`
    
2. **Add the following content**:
    
    `[local-provides] name=Local Provides baseurl=file:///usr/local/lib enabled=1 gpgcheck=0`
    

### Step 2: Create a Fake RPM to Satisfy the Dependency

1. **Create a directory for building the RPM**:
    
    `mkdir -p ~/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}`
    
2. **Create the spec file**:
    
    `nano ~/rpmbuild/SPECS/readline7.spec`
    
3. **Add the following content to the spec file**:
    
    `Name:           readline7 Version:        7.0 Release:        1 Summary:        Readline library 7.0 License:        GPL Group:          System Environment/Libraries BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root Provides:       libreadline.so.7()(64bit) %description This is a dummy package to provide the libreadline.so.7 dependency. %files`
    
4. **Build the fake RPM**:
    
    `rpmbuild -bb ~/rpmbuild/SPECS/readline7.spec`
    
5. **Install the fake RPM**:
    
    `sudo rpm -i ~/rpmbuild/RPMS/x86_64/readline7-7.0-1.x86_64.rpm`
    

### Step 3: Install PostgreSQL 16

Now, try installing PostgreSQL 16 again:

`sudo yum install -y postgresql16-16.1-1PGDG.rhel8.x86_64.rpm`

## Conclusion

This was the only way I could help `yum` recognize the `libreadline.so.7` dependency and allow the installation of PostgreSQL 16 successfully.