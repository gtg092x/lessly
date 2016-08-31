# [Less][] Standalone Functions [![Build Status](https://travis-ci.org/gtg092x/lessly.svg?branch=master)](https://travis-ci.org/gtg092x/lessly)

Use less color functions without less.

[![NPM](https://nodei.co/npm/lessly.png?downloads=true&stars=true)](https://nodei.co/npm/lessly/)


## Installation

    % npm install lessly
    
## Usage

Lessly is a hack around the color manipulation functions in [Less][]. 

```js
import {fade} from 'lessly';

fade('red', .9);
// outputs rgba(255, 0, 0, 0.9)
```

Alternatively, you can pass in any entity string that less would normally process.

```js
import lessly from 'lessly';

lessly('fade(red, .9)');
// outputs rgba(255, 0, 0, 0.9)
```

These operations happen recursively, so feel free to use [any less color function](http://lesscss.org/functions/#color-definition).

```js
import lessly from 'lessly';

lessly('red(fade(red, .9))');
// outputs 255
```

## Variables

For entity parsing, you can pass in variables to be swapped out with a params object

```js
import lessly from 'lessly';

lessly('fade(@mycolor, .9)', {mycolor: 'blue'});
// outputs rgba(0, 0, 255, 0.9)
```

In keeping the React style convention, we'll also check camel case variables against dash variables.

```js
import lessly from 'lessly';

lessly('fade(@my-color, .9)', {myColor: 'blue'});
// outputs rgba(0, 0, 255, 0.9)
```

## Themes

If you have an existing color configuration, we can bind these vars to all lessly calls.

```js
import {theme} from 'lessly';

const lesslyTheme = theme({myColor: 'blue'});

lesslyTheme('fade(@my-color, .9)');
// outputs rgba(0, 0, 255, 0.9)

lesslyTheme.fade('@my-color', .9);
// outputs rgba(0, 0, 255, 0.9)

```

## Dimensions

Dimensions made easy - basic operations are free too!

```js
import {dimension} from 'lessly'; // or dim for short


dimension(10, 'px');
// outputs 10px

dimension('10px', 'px');
// outputs 10px

dimension('10px + 10');
// outputs 20px

dimension('10px -' , 5);
// outputs 5px

dimension('10px' , ' * 10');
// outputs 100px

dimension(10 , ' + 10px');
// outputs 20px

```

There's also handy shortcuts for [every css unit](http://www.tutorialspoint.com/css/css_measurement_units.htm).

```js
import {px, percent, inch, mm, vh, vw, rad, pt, cm} from 'lessly';

px(10);
// outputs 10px

percent(10);
// outputs 10%

inch(10);
// outputs 10in

mm(10);
// outputs 10mm

vh(10);
// outputs 10vh

vw(10);
// outputs 10vw

rad(10);
// outputs 10rad

pt(10);
// outputs 10pt

cm(10);
// outputs 10cm

```

## Further Documentation

Check out the [less color definition functions](http://lesscss.org/functions/#color-definition). Every color definition function is supoorted.

The function list with sample arguments is available at `test/functions.js`.
    
lessly is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Less]: https://github.com/less/less.js
[Matthew Drake]: http://www.mediadrake.com
