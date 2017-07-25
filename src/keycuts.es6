import _ from 'underscore';

const SHIFTNUMS = {
		'`': '~',
		'1': '!',
		'2': '@',
		'3': '#',
		'4': '$',
		'5': '%',
		'6': '^',
		'7': '&',
		'8': '*',
		'9': '(',
		'0': ')',
		'-': '_',
		'=': '+',
		';': ':',
		"'": '"',
		',': '<',
		'.': '>',
		'/': '?',
		'\\': '|'
	};

const SPECIALKEYS = {
		esc: 27,
		escape: 27,
		tab: 9,
		space: 32,
		return: 13,
		enter: 13,
		backspace: 8,
		scrolllock: 145,
		scroll_lock: 145,
		scroll: 145,
		capslock: 20,
		caps_lock: 20,
		caps: 20,
		numlock: 144,
		num_lock: 144,
		num: 144,
		pause: 19,
		break: 19,
		insert: 45,
		home: 36,
		delete: 46,
		end: 35,
		pageup: 33,
		page_up: 33,
		pu: 33,
		pagedown: 34,
		page_down: 34,
		pd: 34,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		f1: 112,
		f2: 113,
		f3: 114,
		f4: 115,
		f5: 116,
		f6: 117,
		f7: 118,
		f8: 119,
		f9: 120,
		f10: 121,
		f11: 122,
		f12: 123
	};

const MODIFIERS = {
		shift: {
			wanted: false,
			pressed: false
		},
		ctrl: {
			wanted: false,
			pressed: false
		},
		alt: {
			wanted: false,
			pressed: false
		},
		meta: {
			wanted: false,
			pressed: false
		}
	};

export default class Keycuts {
	constructor() {
		this.defaultShortcutOption = {
			type: 'keydown',
			propagate: false,
			disableInInput: false,
			target: document,
			keycode: false
		};
		this.allShortcuts = {};
	}

	add(shortcutCombination, callback, option = {}) {
		option = _.defaults(option, this.defaultShortcutOption);
 		shortcutCombination = shortcutCombination.toLowerCase();
		let targetElement = _.isString(option.target) ? document.getElementById(option.target) : option.target;
		let handler = e => {
			let char, code, kp = 0,
				modifiers = {
					shift: {
						wanted: false,
						pressed: false
					},
					ctrl: {
						wanted: false,
						pressed: false
					},
					alt: {
						wanted: false,
						pressed: false
					},
					meta: {
						wanted: false,
						pressed: false
					}
				};

			e = e || window.event;

			if(option.disableInInput) {
				let element = e.target ? e.target : (e.srcElement ? e.srcElement : null);

				if(element !== null && element.nodeType === 3) {
					element = element.parentNode;
				}

				if(element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
					return false;
				}
			}

			if(e.keyCode) {
				code = e.keyCode;
			} else if(e.which) {
				code = e.which;
			}

			char = (code === 188 ? ',' : (code === 190 ? '.' : String.fromCharCode(code).toLowerCase()));

			if(e.ctrlKey) {
				modifiers.ctrl.pressed = true;
			}
			if(e.shiftKey) {
				modifiers.shift.pressed = true;
			}
			if(e.altKey) {
				modifiers.alt.pressed = true;
			}
			if(e.metaKey) {
				modifiers.meta.pressed = true;
			}

			shortcutCombination.split('+').forEach((key) => {
				switch(key) {
					case 'ctrl':
					case 'control':
						kp++;
						modifiers.ctrl.wanted = true;
					break;
					case 'shift':
						kp++;
						modifiers.shift.wanted = true;
					break;
					case 'alt':
						kp++;
						modifiers.alt.wanted = true;
					break;
					case 'meta':
						kp++;
						modifiers.meta.wanted = true;
					break;
					default:
						if(key.length > 1 && SPECIALKEYS[key] === code) {
							kp++;
						} else if(option.keycode) {
							kp++;
						} else {
							if(char === key) {
								kp++;
							} else {
								if(SHIFTNUMS[char] && e.shiftKey) {
									char = SHIFTNUMS[char];
									if(char === k) {
										kp++;
									}
								}
							}
						}
					break;
				}
			});

			if(kp == keys.length &&
				modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
				modifiers.shift.pressed === modifiers.shift.wanted &&
				modifiers.alt.pressed === modifiers.alt.wanted &&
				modifiers.meta.pressed === modifiers.meta.wanted) {
				callback(e);

				if(!option.propagate) {
					e.cancelBubble = true;
					e.returnValue = false;

					if(e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}

					return false;
				}
			}
		};

		this.allShortcuts[shortcutCombination] = {
			callback: handler,
			target: targetElement,
			event: option.type
		};

		if(targetElement.addEventListener) {
			targetElement.addEventListener(option.type, handler, false);
		} else if(targetElement.attachEvent) {
			targetElement.attachEvent(`on${option.type}`, handler);
		} else {
			targetElement[`on${option.type}`] = handler;
		}
	}

	remove(shortcutCombination) {
		shortcutCombination = shortcutCombination.toLowerCase();
		let binding = this.allShortcuts[shortcutCombination];
		delete(this.allShortcuts[shortcutCombination])
		if(!binding) {
			return;
		}

		let type = binding.event;
		let targetElement = binding.target;
		let callback = binding.callback;

		if(targetElement.detachEvent) {
			targetElement.detachEvent(`on${type}`, callback);
		} else if(targetElement.removeEventListener) {
			targetElement.removeEventListener(type, callback, false);
		} else {
			targetElement[`on${type}`] = false;
		}
	}
};
