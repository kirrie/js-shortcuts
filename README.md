# Keycuts

forked from [xaneem's js-shortcuts](https://github.com/xaneem/js-shortcuts). just rewrite scripts as es6 and make a amd module package. (this scripts needs underscore).

## Usage
```javaScript
	require(['keycuts'], Keycuts => {
		const keycuts = new Keycuts.default();

		keycuts.add('right', e => {
			alert('right arrow pushed!');
		});
	});
```

More information available on the [original doc](http://www.openjs.com/scripts/events/keyboard_shortcuts/) page.

## Installation

### Bower
Install via bower:
```shell
	> bower install keycuts --save
```

## License
BSD License
