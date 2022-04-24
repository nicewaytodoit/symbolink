# Symbolink

Symbolink allows you to create multiple link by setting config file and then executing in as appropriate.

## Main
To install:
```$ npm install -g symbolink```

to execute:
```$ symbolink -f ./config.json```

## Config file
```json
{
    "root": "C:/test",
    "links": [
        { "link": "t1-1", "dest": "./destination/folder" },
        { "link": "t1-2", "dest": "./destination/folder" }
    ]
}
```

## Options

- Option 'file', alias: 'f' - path to config file.
- Option 'root', alias: 'r' - root folder for relative paths of links.
- Option 'link', alias: 'l' - symlink name that will be created if already taken, old folder will be renamed
- Option 'dest', alias: 'd' - destination folder, symbolic link above will poin to this folder.
