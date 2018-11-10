# genURL
Web-based File system visualization. Url generation to access or give access to specific files.


## Basic idea

Sorry not much time to detail this project. 

But in short this has the purpose of allowing to serve a directory and its children directories so you can see via web browser what is on your server. And enable sharing of certain files directly from your server via http.

The files paths are hashed in md5 and added to redis server.
The hash is the key the absolute path is the value. An expiration will be set.
The web server will serve files for which there exists a hash key in the redis server.

Basically Dropbox or Google Drive for your server. So you don't need to have files stores on an external server.

This is used coupled with syncthing to allow serving of files on my laptop on the go.

Yes I know nextcloud owncloud do this.

--------

## File serving 

File serving will be routed through

[host]/files/[hash]

transfer() { 
  if [[ $1 == *"Include"* ]]; then
      remotePath="prefix/to/folders/"$1;
    curl -s --data "path=$remotePath" https://server/share | awk -F ":" '{print $2}' | tr -d "}\"" | xargs -n 1 -I pat echo "https://"pat;
    #Send hash via ssh
    #hash=$(echo -n "/prefix/to/folder/"$1 | md5sum | awk '{print $1}';);
    #ssh server redis-cli set $hash $path
  fi 
}
alias transfer=transfer();

--------

## Installation 

```shell
$ npm i grunt-cli -g
$ npm i bower -g
$ npm install
$ bower install
$ grunt (Might have to run it twice)

$ sudo apt-get update
$ sudo apt-get install redis-server

#Configure ip and address and start server
$ REDISPASS=password npm start
```


