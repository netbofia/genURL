# genURL
Web-based File system visualization. Url generation to access or give access to specific files.


## Basic idea

Sorry not must time to detail this project. 

But in short this has the purpose of allowing to serve a directory and its children directories so you can see via web browser what is on your server. And enable sharing of certain files directly from your server via http.

The files are hashed in md5 and added to redis server.
The hash is the key the absolute path is the value. An expiration will be set.
The web server will serve files for which there exists a hash key in the redis server.

Basically Dropbox or Google Drive for your server. So you don't need to have files stores on an external server.

This is used coupled with syncthing to allow serving of files on my laptop on the go.

Yes I know nextcloud owncloud do this.