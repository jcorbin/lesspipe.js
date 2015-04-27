# lesspipe.js

A modern Node.js lesspipe

## Usage

You can run lesspipe.js directly to prettify input or a file:

    $ lesspipe.js somefile
    $ ... | lesspipe.js

But really the whole point is to be transparent through less.

## Installation

Install lesspipe.js globally, and then use it in shell rc / profile:

    $ npm install -g lesspipe.js

    $ export LESSOPEN="|$(which lesspipe.js) %s"

Add the `export ...` line to your `.profile` (or failing that, your `.bashrc`)
to make it stick.

## Runtime Dependencies

### tree

If tree is present, it will be used to prettify directories.  Most linux
distros ship this, and you can `brew install tree` on OS X.

### compression and archive programs

Currently only gzip, bzip2, and tar are supported.  More will be added soon.

### git

If you less a git object or pack directly, `git-show` or `git-show-index` will
be used to format.  Try it out:

    $ find .git/objects -type f | xargs less

### Pygmentize

If you have pygmentize on your path, then it will be used to syntax highlight
any supported file types.

## Contributors

 - Joshua T Corbin

## MIT Licenced
