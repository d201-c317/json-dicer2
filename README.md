The JSON-Dicer, with filtering functionality
==============

Derscription
------------
This simple Node.js Script is used for generating a lot of smaller JSON files (approx. 250 bytes)
from a singleton bigger JSON Array[] file. Indeed for pagination.

Version
-------
1.0.0

Usage
-----
1. Checkout this repository
2. Open the CLI You like.
3. Navigate to the directory contains the checked out repository. 
4. Type: `npm install` to install dependency.
5. Finally...

```sh
$ node index.js [Options] <Full path to the Source JSON Array File>  <Output Directory> 
```

Outputs can be found under the output directory you defined

### Options

```sh
-h, --help         output usage information
-V, --version      output the version number
-e, --entries <n>  How Many Entries in a single file?
-p, --pretty       Pretty Formatted JSON in the outputs
-m, --metadata     Generate an metadata JSON
-f, --filter       Filter Words that not matching Regex (Source: alphabets)
```

### License
GPLv3