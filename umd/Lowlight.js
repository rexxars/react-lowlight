(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["reactLowlight"] = factory(require("react"));
	else
		root["reactLowlight"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	var React = __webpack_require__(1)
	var low = __webpack_require__(2)
	var mapChildren = __webpack_require__(4)
	
	var registeredLanguages = 0
	
	function Lowlight (props) {
	  if (true) {
	    if (!props.language && registeredLanguages === 0) {
	      console.warn(
	        'No language definitions seems to be registered, ' +
	        'did you forget to call `Lowlight.registerLanguage`?'
	      )
	    }
	  }
	
	  var result = props.language
	    ? low.highlight(props.language, props.value, {prefix: props.prefix})
	    : low.highlightAuto(props.value, {prefix: props.prefix, subset: props.subset})
	
	  var codeProps = result.language
	    ? {className: 'hljs ' + result.language}
	    : {className: 'hljs'}
	
	  return (
	    React.createElement('pre', {className: props.className},
	      React.createElement('code', codeProps,
	        result.value.map(mapChildren.depth(0))
	      )
	    )
	  )
	}
	
	Lowlight.propTypes = {
	  className: React.PropTypes.string,
	  language: React.PropTypes.string,
	  value: React.PropTypes.string.isRequired,
	  prefix: React.PropTypes.string,
	  subset: React.PropTypes.arrayOf(React.PropTypes.string)
	}
	
	Lowlight.defaultProps = {
	  className: 'lowlight',
	  prefix: 'hljs-'
	}
	
	Lowlight.registerLanguage = function () {
	  registeredLanguages++
	  low.registerLanguage.apply(low, arguments)
	}
	
	module.exports = Lowlight


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Titus Wormer
	 * @copyright 2016 Titus Wormer
	 * @license MIT
	 * @module lowlight:lowlight
	 * @fileoverview Virtual syntax highlighting for virtual
	 *   DOMs and non-HTML things.
	 */
	
	'use strict';
	
	/* eslint-env commonjs */
	
	/*
	 * Dependencies.
	 */
	
	var high = __webpack_require__(3);
	
	/*
	 * Methods.
	 */
	
	var inherit = high.inherit;
	
	/*
	 * Constants.
	 */
	
	var DEFAULT_PREFIX = 'hljs-';
	var KEY_INSENSITIVE = 'case_insensitive';
	var EMPTY = '';
	
	/*
	 * Constant characters.
	 */
	
	var C_SPACE = ' ';
	var C_PIPE = '|';
	
	/*
	 * Constant types.
	 */
	
	var T_ELEMENT = 'element';
	var T_TEXT = 'text';
	var T_SPAN = 'span';
	
	/*
	 * Maps of syntaxes.
	 */
	
	var languageNames = [];
	var languages = {};
	var aliases = {};
	
	/**
	 * Get a language by `name`.
	 *
	 * @private
	 * @param {string} name - Name or alias of language.
	 * @return {Object?} - Syntax.
	 */
	function getLanguage(name) {
	    name = name.toLowerCase();
	
	    return languages[name] || languages[aliases[name]];
	}
	
	/**
	 * No-op exec.
	 *
	 * @private
	 * @return {null} - Void result.
	 */
	function execNoop() {
	    return null;
	}
	
	/**
	 * Check.
	 *
	 * @private
	 * @param {RegExp} expression - Expression.
	 * @param {string} lexeme - Value.
	 * @return {boolean} - whether `lexeme` matches `re`.
	 */
	function test(expression, lexeme) {
	    var match = expression && expression.exec(lexeme);
	
	    return match && match.index == 0;
	}
	
	/**
	 * Normalize a syntax result.
	 *
	 * @param {Object} result - Syntax result.
	 * @return {Object} - Normalized syntax result.
	 */
	function normalize(result) {
	    return {
	        'relevance': result.relevance || 0,
	        'language': result.language || null,
	        'value': result.value || []
	    };
	}
	
	/**
	 * Compile a language.
	 *
	 * @private
	 * @param {Object} language - Language to compile.
	 */
	function compileLanguage(language) {
	    /**
	     * Get the source of an expression or string.
	     *
	     * @private
	     * @param {RegExp|string} re - Value.
	     * @return {string} - Source.
	     */
	    function source(re) {
	        return (re && re.source) || re;
	    }
	
	    /**
	     * Get the source of an expression or string.
	     *
	     * @private
	     * @param {RegExp|string} value - Expression.
	     * @param {boolean?} [global] - Whether to execute
	     *   globally.
	     * @return {RegExp} - Compiled expression.
	     */
	    function langRe(value, global) {
	        return new RegExp(
	            source(value),
	            'm' + (language[KEY_INSENSITIVE] ? 'i' : '') +
	            (global ? 'g' : '')
	        );
	    }
	
	    /**
	     * Compile a mode.
	     *
	     * @private
	     * @param {Object} mode - Language mode to compile.
	     * @param {Object} [parent] - Parent mode.
	     */
	    function compileMode(mode, parent) {
	        var compiledKeywords = {};
	        var expandedContains = [];
	
	        /**
	         * Flatten a class-name.
	         *
	         * @private
	         * @param {string} className - Classname to flatten.
	         * @param {string} value - Value.
	         */
	        function flatten(className, value) {
	            var pairs;
	            var pair;
	            var index;
	            var length;
	
	            if (language[KEY_INSENSITIVE]) {
	                value = value.toLowerCase();
	            }
	
	            pairs = value.split(C_SPACE);
	            length = pairs.length;
	            index = -1;
	
	            while (++index < length) {
	                pair = pairs[index].split(C_PIPE);
	
	                compiledKeywords[pair[0]] = [
	                    className,
	                    pair[1] ? Number(pair[1]) : 1
	                ];
	            }
	        }
	
	        if (mode.compiled) {
	            return;
	        }
	
	        mode.compiled = true;
	
	        mode.keywords = mode.keywords || mode.beginKeywords;
	
	        if (mode.keywords) {
	            if (typeof mode.keywords == 'string') {
	                flatten('keyword', mode.keywords);
	            } else {
	                Object.keys(mode.keywords).forEach(function (className) {
	                    flatten(className, mode.keywords[className]);
	                });
	            }
	
	            mode.keywords = compiledKeywords;
	        }
	
	        mode.lexemesRe = langRe(mode.lexemes || /\b\w+\b/, true);
	
	        if (parent) {
	            if (mode.beginKeywords) {
	                mode.begin = '\\b(' +
	                    mode.beginKeywords.split(C_SPACE).join(C_PIPE) +
	                ')\\b';
	            }
	            if (!mode.begin) {
	                mode.begin = /\B|\b/;
	            }
	
	            mode.beginRe = langRe(mode.begin);
	
	            if (!mode.end && !mode.endsWithParent) {
	                mode.end = /\B|\b/;
	            }
	
	            if (mode.end) {
	                mode.endRe = langRe(mode.end);
	            }
	
	            mode.terminatorEnd = source(mode.end) || EMPTY;
	
	            if (mode.endsWithParent && parent.terminatorEnd) {
	                mode.terminatorEnd += (mode.end ? C_PIPE : EMPTY) +
	                    parent.terminatorEnd;
	            }
	        }
	
	        if (mode.illegal) {
	            mode.illegalRe = langRe(mode.illegal);
	        }
	
	        if (mode.relevance === undefined) {
	            mode.relevance = 1;
	        }
	
	        if (!mode.contains) {
	            mode.contains = [];
	        }
	
	        mode.contains.forEach(function (c) {
	            if (c.variants) {
	                c.variants.forEach(function (v) {
	                    expandedContains.push(inherit(c, v));
	                });
	            } else {
	                expandedContains.push(c == 'self' ? mode : c);
	            }
	        });
	
	        mode.contains = expandedContains;
	
	        mode.contains.forEach(function (c) {
	            compileMode(c, mode);
	        });
	
	        if (mode.starts) {
	            compileMode(mode.starts, parent);
	        }
	
	        var terminators =
	            mode.contains.map(function (c) {
	                return c.beginKeywords ?
	                    '\\.?(' + c.begin + ')\\.?' :
	                    c.begin;
	            })
	            .concat([mode.terminatorEnd, mode.illegal])
	            .map(source)
	            .filter(Boolean);
	
	        mode.terminators = terminators.length ?
	            langRe(terminators.join(C_PIPE), true) :
	            {'exec': execNoop};
	    }
	
	    compileMode(language);
	}
	
	/**
	 * Register a language.
	 *
	 * @param {string} name - Name of language.
	 * @param {Function} syntax - Syntax constructor.
	 */
	function registerLanguage(name, syntax) {
	    var lang = languages[name] = syntax(low);
	    var values = lang.aliases;
	    var length = values && values.length;
	    var index = -1;
	
	    languageNames.push(name);
	
	    while (++index < length) {
	        aliases[values[index]] = name;
	    }
	}
	
	/**
	 * Core highlighting function.  Accepts a language name, or
	 * an alias, and a string with the code to highlight.
	 * Returns an object with the following properties:
	 *
	 * @private
	 * @param {string} name - Language name.
	 * @param {string} value - Source to highlight.
	 * @param {boolean} [ignore=false] - Whether to ignore
	 *   illegals.
	 * @param {string?} [prefix] - Whether to continue
	 *   processing with `continuation`.
	 * @param {boolean} [continuation] - Whether to continue
	 *   processing with `continuation`.
	 * @return {Object} - Highlighted `value`.
	*/
	function coreHighlight(name, value, ignore, prefix, continuation) {
	    var continuations = {};
	    var stack = [];
	    var modeBuffer = EMPTY;
	    var relevance = 0;
	    var language;
	    var top;
	    var current;
	    var currentChildren;
	    var offset;
	    var count;
	    var match;
	
	    if (typeof name !== 'string') {
	        throw new Error('Expected `string` for name, got `' + name + '`');
	    }
	
	    if (typeof value !== 'string') {
	        throw new Error('Expected `string` for value, got `' + value + '`');
	    }
	
	    var children;
	    language = getLanguage(name);
	    current = top = continuation || language;
	    currentChildren = children = [];
	
	    if (!language) {
	        throw new Error('Expected `' + name + '` to be registered');
	    }
	
	    compileLanguage(language);
	
	    /**
	     * Exit the current context.
	     *
	     * @private
	     */
	    function pop() {
	        currentChildren = stack.pop() || children;
	    }
	
	    /**
	     * Check a sub-mode.
	     *
	     * @private
	     * @param {string} lexeme - Value.
	     * @param {Object} mode - Sub-mode.
	     * @return {boolean} - Whether the lexeme matches.
	     */
	    function subMode(lexeme, mode) {
	        for (var i = 0; i < mode.contains.length; i++) {
	            if (test(mode.contains[i].beginRe, lexeme)) {
	                return mode.contains[i];
	            }
	        }
	    }
	
	    /**
	     * Check if `lexeme` ends `mode`.
	     *
	     * @private
	     * @param {Object} mode - Sub-mode.
	     * @param {string} lexeme - Value.
	     * @return {boolean} - Whether `lexeme` ends `mode`.
	     */
	    function endOfMode(mode, lexeme) {
	        if (test(mode.endRe, lexeme)) {
	            while (mode.endsParent && mode.parent) {
	                mode = mode.parent;
	            }
	            return mode;
	        }
	        if (mode.endsWithParent) {
	            return endOfMode(mode.parent, lexeme);
	        }
	    }
	
	    /**
	     * Check if `lexeme` is illegal according to `mode`.
	     *
	     * @private
	     * @param {string} lexeme - Value.
	     * @param {Object} mode - Sub-mode.
	     * @return {boolean} - Whether `lexeme` is illegal
	     *   according to `mode`.
	     */
	    function isIllegal(lexeme, mode) {
	        return !ignore && test(mode.illegalRe, lexeme);
	    }
	
	    /**
	     * Check if the first word in `keywords` is a keyword.
	     *
	     * @private
	     * @param {Object} mode - Sub-mode.
	     * @param {Array.<string>} keywords - Words.
	     * @return {boolean} - Whether the first word in
	     *   `keywords` is a keyword.
	     */
	    function keywordMatch(mode, keywords) {
	        var keyword = keywords[0];
	
	        if (language[KEY_INSENSITIVE]) {
	            keyword = keyword.toLowerCase();
	        }
	
	        return mode.keywords.hasOwnProperty(keyword) &&
	            mode.keywords[keyword];
	    }
	
	    /**
	     * Build a span.
	     *
	     * @private
	     * @param {string} name - Class-name.
	     * @param {string} contents - Value inside the span.
	     * @param {boolean?} [noPrefix] - Don’t prefix class.
	     * @return {HASTNode} - HAST Element node.
	     */
	    function build(name, contents, noPrefix) {
	        return {
	            'type': T_ELEMENT,
	            'tagName': T_SPAN,
	            'properties': {
	                'className': [(noPrefix ? EMPTY : prefix) + name]
	            },
	            'children': contents
	        };
	    }
	
	    /**
	     * Build a text.
	     *
	     * @private
	     * @param {string} value - Content.
	     * @return {HASTNode} - HAST Text node.
	     */
	    function buildText(value) {
	        return {
	            'type': T_TEXT,
	            'value': value
	        };
	    }
	
	    /**
	     * Add a text.
	     *
	     * @private
	     * @param {string} value - Content.
	     * @param {Array.<Node>} [nodes] - Nodes to add to,
	     *   defaults to `currentChildren`.
	     */
	    function addText(value, nodes) {
	        var tail;
	
	        if (value) {
	            tail = nodes[nodes.length - 1];
	
	            if (tail && tail.type === T_TEXT) {
	                tail.value += value;
	            } else {
	                nodes.push(buildText(value));
	            }
	        }
	
	        return nodes;
	    }
	
	    /**
	     * Add a text.
	     *
	     * @private
	     * @param {Array.<Node>} siblings - Nodes to add.
	     * @param {Array.<Node>} [nodes] - Nodes to add to.
	     */
	    function addSiblings(siblings, nodes) {
	        var length = siblings.length;
	        var index = -1;
	        var sibling;
	
	        while (++index < length) {
	            sibling = siblings[index];
	
	            if (sibling.type === T_TEXT) {
	                addText(sibling.value, nodes);
	            } else {
	                nodes.push(sibling);
	            }
	        }
	    }
	
	    /**
	     * Process keywords.
	     *
	     * @private
	     * @return {Array.<Node>} - Nodes.
	     */
	    function processKeywords() {
	        var nodes = [];
	        var lastIndex;
	        var keyword;
	        var node;
	        var submatch;
	
	        if (!top.keywords) {
	            return addText(modeBuffer, nodes);
	        }
	
	        lastIndex = 0;
	
	        top.lexemesRe.lastIndex = 0;
	
	        keyword = top.lexemesRe.exec(modeBuffer);
	
	        while (keyword) {
	            addText(modeBuffer.substr(
	                lastIndex, keyword.index - lastIndex
	            ), nodes);
	
	            submatch = keywordMatch(top, keyword);
	
	            if (submatch) {
	                relevance += submatch[1];
	
	                node = build(submatch[0], []);
	
	                nodes.push(node);
	
	                addText(keyword[0], node.children);
	            } else {
	                addText(keyword[0], nodes);
	            }
	
	            lastIndex = top.lexemesRe.lastIndex;
	            keyword = top.lexemesRe.exec(modeBuffer);
	        }
	
	        addText(modeBuffer.substr(lastIndex), nodes);
	
	        return nodes;
	    }
	
	    /**
	     * Process a sublanguage.
	     *
	     * @private
	     * @return {Array.<Node>} - Nodes.
	     */
	    function processSubLanguage() {
	        var explicit = typeof top.subLanguage == 'string';
	        var subvalue;
	
	        /* istanbul ignore if - support non-loaded sublanguages */
	        if (explicit && !languages[top.subLanguage]) {
	            return addText(modeBuffer, []);
	        }
	
	        if (explicit) {
	            subvalue = coreHighlight(
	                top.subLanguage,
	                modeBuffer,
	                true,
	                prefix,
	                continuations[top.subLanguage]
	            );
	        } else {
	            subvalue = autoHighlight(modeBuffer, {
	                'subset': top.subLanguage.length ?
	                    top.subLanguage : undefined,
	                'prefix': prefix
	            });
	        }
	
	        /*
	         * Counting embedded language score towards the
	         * host language may be disabled with zeroing the
	         * containing mode relevance.  Usecase in point is
	         * Markdown that allows XML everywhere and makes
	         * every XML snippet to have a much larger Markdown
	         * score.
	         */
	
	        if (top.relevance > 0) {
	            relevance += subvalue.relevance;
	        }
	
	        if (explicit) {
	            continuations[top.subLanguage] = subvalue.top;
	        }
	
	        return [build(subvalue.language, subvalue.value, true)];
	    }
	
	    /**
	     * Process the buffer.
	     *
	     * @private
	     * @return {string} - The processed buffer.
	     */
	    function processBuffer() {
	        return top.subLanguage !== undefined ?
	            processSubLanguage() :
	            processKeywords();
	    }
	
	    /**
	     * Start a new mode.
	     *
	     * @private
	     * @param {Object} mode - Mode to use.
	     * @param {string} lexeme - Lexeme to process..
	     */
	    function startNewMode(mode, lexeme) {
	        var node;
	
	        if (mode.className) {
	            node = build(mode.className, []);
	        }
	
	        if (mode.returnBegin) {
	            modeBuffer = EMPTY;
	        } else if (mode.excludeBegin) {
	            addText(lexeme, currentChildren);
	
	            modeBuffer = EMPTY;
	        } else {
	            modeBuffer = lexeme;
	        }
	
	        /*
	         * Enter a new mode.
	         */
	
	        if (node) {
	            currentChildren.push(node);
	            stack.push(currentChildren);
	            currentChildren = node.children;
	        }
	
	        top = Object.create(mode, {
	            'parent': {
	                'value': top
	            }
	        });
	    }
	
	    /**
	     * Process a lexeme.
	     *
	     * @private
	     * @param {string} buffer - Current buffer.
	     * @param {string} lexeme - Current lexeme.
	     * @return {number} - Next position.
	     */
	    function processLexeme(buffer, lexeme) {
	        var newMode;
	        var endMode;
	        var origin;
	
	        modeBuffer += buffer;
	
	        if (lexeme === undefined) {
	            addSiblings(processBuffer(), currentChildren);
	
	            return 0;
	        }
	
	        newMode = subMode(lexeme, top);
	
	        if (newMode) {
	            addSiblings(processBuffer(), currentChildren);
	
	            startNewMode(newMode, lexeme);
	
	            return newMode.returnBegin ? 0 : lexeme.length;
	        }
	
	        endMode = endOfMode(top, lexeme);
	
	        if (endMode) {
	            origin = top;
	
	            if (!(origin.returnEnd || origin.excludeEnd)) {
	                modeBuffer += lexeme;
	            }
	
	            addSiblings(processBuffer(), currentChildren);
	
	            /*
	             * Close open modes.
	             */
	
	            do {
	                if (top.className) {
	                    pop();
	                }
	
	                relevance += top.relevance;
	                top = top.parent;
	            } while (top !== endMode.parent);
	
	            if (origin.excludeEnd) {
	                addText(lexeme, currentChildren);
	            }
	
	            modeBuffer = EMPTY;
	
	            if (endMode.starts) {
	                startNewMode(endMode.starts, EMPTY);
	            }
	
	            return origin.returnEnd ? 0 : lexeme.length;
	        }
	
	        if (isIllegal(lexeme, top)) {
	            throw new Error(
	                'Illegal lexeme "' + lexeme + '" for mode "' +
	                (top.className || '<unnamed>') + '"'
	            );
	        }
	
	        /*
	         * Parser should not reach this point as all
	         * types of lexemes should be caught earlier,
	         * but if it does due to some bug make sure it
	         * advances at least one character forward to
	         * prevent infinite looping.
	         */
	
	        modeBuffer += lexeme;
	
	        return lexeme.length || /* istanbul ignore next */ 1;
	    }
	
	    try {
	        offset = top.terminators.lastIndex = 0;
	        match = top.terminators.exec(value);
	
	        while (match) {
	            count = processLexeme(
	                value.substr(offset, match.index - offset),
	                match[0]
	            );
	
	            offset = top.terminators.lastIndex = match.index + count;
	            match = top.terminators.exec(value);
	        }
	
	        processLexeme(value.substr(offset));
	        current = top;
	
	        while (current.parent) {
	            if (current.className) {
	                pop();
	            }
	
	            current = current.parent;
	        }
	
	        return {
	            'relevance': relevance,
	            'value': currentChildren,
	            'language': name,
	            'top': top
	        };
	    } catch (e) {
	        /* istanbul ignore else - Catch-all  */
	        if (e.message.indexOf('Illegal') !== -1) {
	            return {
	                'relevance': 0,
	                'value': addText(value, [])
	            };
	        } else {
	            throw e;
	        }
	    }
	}
	
	/**
	 * Highlighting with language detection.  Accepts a string
	 * with the code to highlight.  Returns an object with the
	 * following properties:
	 *
	 * - language (detected language)
	 * - relevance (int)
	 * - value (an HTML string with highlighting markup)
	 * - secondBest (object with the same structure for
	 *   second-best heuristically detected language, may
	 *   be absent).
	 *
	 * @param {string} value - Source to highlight.
	 * @param {Object?} [options={}] - Configuration.
	 * @param {string} [options.prefix='hljs-'] - Highlight
	 *   prefix.
	 * @param {Array.<string>} [options.subset] - List of
	 *   allowed languages.
	 * @return {Object} - Highlighted `value`.
	 */
	function autoHighlight(value, options) {
	    var settings = options || {};
	    var prefix = settings.prefix || DEFAULT_PREFIX;
	    var subset = settings.subset || languageNames;
	    var result;
	    var secondBest;
	    var index;
	    var length;
	    var current;
	    var name;
	
	    length = subset.length;
	    index = -1;
	
	    if (typeof value !== 'string') {
	        throw new Error('Expected `string` for value, got `' + value + '`');
	    }
	
	    secondBest = normalize({});
	    result = normalize({});
	
	    while (++index < length) {
	        name = subset[index];
	
	        if (!getLanguage(name)) {
	            continue;
	        }
	
	        current = normalize(coreHighlight(name, value, false, prefix));
	
	        current.language = name;
	
	        if (current.relevance > secondBest.relevance) {
	            secondBest = current;
	        }
	
	        if (current.relevance > result.relevance) {
	            secondBest = result;
	            result = current;
	        }
	    }
	
	    if (secondBest.language) {
	        result.secondBest = secondBest;
	    }
	
	    return result;
	}
	
	/**
	 * Highlighting `value` in the language `language`.
	 *
	 * @private
	 * @param {string} language - Language name.
	 * @param {string} value - Source to highlight.
	 * @param {Object?} [options={}] - Configuration.
	 * @param {string} [options.prefix='hljs-'] - Highlight
	 *   prefix.
	 * @return {Object} - Highlighted `value`.
	*/
	function highlight(language, value, options) {
	    var settings = options || {};
	    var prefix = settings.prefix || DEFAULT_PREFIX;
	
	    return normalize(coreHighlight(language, value, true, prefix));
	}
	
	/*
	 * The lowlight interface, which has to be compatible
	 * with highlight.js, as this object is passed to
	 * highlight.js syntaxes.
	 */
	
	/** High constructor. */
	function High() {}
	
	High.prototype = high;
	
	var low = new High(); // Ha!
	
	low.highlight = highlight;
	low.highlightAuto = autoHighlight;
	low.registerLanguage = registerLanguage;
	
	/*
	 * Expose.
	 */
	
	module.exports = low;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Syntax highlighting with language autodetection.
	https://highlightjs.org/
	*/
	
	(function(factory) {
	
	  // Find the global object for export to both the browser and web workers.
	  var globalObject = typeof window == 'object' && window ||
	                     typeof self == 'object' && self;
	
	  // Setup highlight.js for different environments. First is Node.js or
	  // CommonJS.
	  if(true) {
	    factory(exports);
	  } else if(globalObject) {
	    // Export hljs globally even when using AMD for cases when this script
	    // is loaded with others that may still expect a global hljs.
	    globalObject.hljs = factory({});
	
	    // Finally register the global hljs with AMD.
	    if(typeof define === 'function' && define.amd) {
	      define([], function() {
	        return globalObject.hljs;
	      });
	    }
	  }
	
	}(function(hljs) {
	
	  /* Utility functions */
	
	  function escape(value) {
	    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
	  }
	
	  function tag(node) {
	    return node.nodeName.toLowerCase();
	  }
	
	  function testRe(re, lexeme) {
	    var match = re && re.exec(lexeme);
	    return match && match.index == 0;
	  }
	
	  function isNotHighlighted(language) {
	    return (/^(no-?highlight|plain|text)$/i).test(language);
	  }
	
	  function blockLanguage(block) {
	    var i, match, length,
	        classes = block.className + ' ';
	
	    classes += block.parentNode ? block.parentNode.className : '';
	
	    // language-* takes precedence over non-prefixed class names.
	    match = (/\blang(?:uage)?-([\w-]+)\b/i).exec(classes);
	    if (match) {
	      return getLanguage(match[1]) ? match[1] : 'no-highlight';
	    }
	
	    classes = classes.split(/\s+/);
	    for (i = 0, length = classes.length; i < length; i++) {
	      if (getLanguage(classes[i]) || isNotHighlighted(classes[i])) {
	        return classes[i];
	      }
	    }
	  }
	
	  function inherit(parent, obj) {
	    var result = {}, key;
	    for (key in parent)
	      result[key] = parent[key];
	    if (obj)
	      for (key in obj)
	        result[key] = obj[key];
	    return result;
	  }
	
	  /* Stream merging */
	
	  function nodeStream(node) {
	    var result = [];
	    (function _nodeStream(node, offset) {
	      for (var child = node.firstChild; child; child = child.nextSibling) {
	        if (child.nodeType == 3)
	          offset += child.nodeValue.length;
	        else if (child.nodeType == 1) {
	          result.push({
	            event: 'start',
	            offset: offset,
	            node: child
	          });
	          offset = _nodeStream(child, offset);
	          // Prevent void elements from having an end tag that would actually
	          // double them in the output. There are more void elements in HTML
	          // but we list only those realistically expected in code display.
	          if (!tag(child).match(/br|hr|img|input/)) {
	            result.push({
	              event: 'stop',
	              offset: offset,
	              node: child
	            });
	          }
	        }
	      }
	      return offset;
	    })(node, 0);
	    return result;
	  }
	
	  function mergeStreams(original, highlighted, value) {
	    var processed = 0;
	    var result = '';
	    var nodeStack = [];
	
	    function selectStream() {
	      if (!original.length || !highlighted.length) {
	        return original.length ? original : highlighted;
	      }
	      if (original[0].offset != highlighted[0].offset) {
	        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
	      }
	
	      /*
	      To avoid starting the stream just before it should stop the order is
	      ensured that original always starts first and closes last:
	
	      if (event1 == 'start' && event2 == 'start')
	        return original;
	      if (event1 == 'start' && event2 == 'stop')
	        return highlighted;
	      if (event1 == 'stop' && event2 == 'start')
	        return original;
	      if (event1 == 'stop' && event2 == 'stop')
	        return highlighted;
	
	      ... which is collapsed to:
	      */
	      return highlighted[0].event == 'start' ? original : highlighted;
	    }
	
	    function open(node) {
	      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"';}
	      result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
	    }
	
	    function close(node) {
	      result += '</' + tag(node) + '>';
	    }
	
	    function render(event) {
	      (event.event == 'start' ? open : close)(event.node);
	    }
	
	    while (original.length || highlighted.length) {
	      var stream = selectStream();
	      result += escape(value.substr(processed, stream[0].offset - processed));
	      processed = stream[0].offset;
	      if (stream == original) {
	        /*
	        On any opening or closing tag of the original markup we first close
	        the entire highlighted node stack, then render the original tag along
	        with all the following original tags at the same offset and then
	        reopen all the tags on the highlighted stack.
	        */
	        nodeStack.reverse().forEach(close);
	        do {
	          render(stream.splice(0, 1)[0]);
	          stream = selectStream();
	        } while (stream == original && stream.length && stream[0].offset == processed);
	        nodeStack.reverse().forEach(open);
	      } else {
	        if (stream[0].event == 'start') {
	          nodeStack.push(stream[0].node);
	        } else {
	          nodeStack.pop();
	        }
	        render(stream.splice(0, 1)[0]);
	      }
	    }
	    return result + escape(value.substr(processed));
	  }
	
	  /* Initialization */
	
	  function compileLanguage(language) {
	
	    function reStr(re) {
	        return (re && re.source) || re;
	    }
	
	    function langRe(value, global) {
	      return new RegExp(
	        reStr(value),
	        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
	      );
	    }
	
	    function compileMode(mode, parent) {
	      if (mode.compiled)
	        return;
	      mode.compiled = true;
	
	      mode.keywords = mode.keywords || mode.beginKeywords;
	      if (mode.keywords) {
	        var compiled_keywords = {};
	
	        var flatten = function(className, str) {
	          if (language.case_insensitive) {
	            str = str.toLowerCase();
	          }
	          str.split(' ').forEach(function(kw) {
	            var pair = kw.split('|');
	            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
	          });
	        };
	
	        if (typeof mode.keywords == 'string') { // string
	          flatten('keyword', mode.keywords);
	        } else {
	          Object.keys(mode.keywords).forEach(function (className) {
	            flatten(className, mode.keywords[className]);
	          });
	        }
	        mode.keywords = compiled_keywords;
	      }
	      mode.lexemesRe = langRe(mode.lexemes || /\b\w+\b/, true);
	
	      if (parent) {
	        if (mode.beginKeywords) {
	          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
	        }
	        if (!mode.begin)
	          mode.begin = /\B|\b/;
	        mode.beginRe = langRe(mode.begin);
	        if (!mode.end && !mode.endsWithParent)
	          mode.end = /\B|\b/;
	        if (mode.end)
	          mode.endRe = langRe(mode.end);
	        mode.terminator_end = reStr(mode.end) || '';
	        if (mode.endsWithParent && parent.terminator_end)
	          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
	      }
	      if (mode.illegal)
	        mode.illegalRe = langRe(mode.illegal);
	      if (mode.relevance === undefined)
	        mode.relevance = 1;
	      if (!mode.contains) {
	        mode.contains = [];
	      }
	      var expanded_contains = [];
	      mode.contains.forEach(function(c) {
	        if (c.variants) {
	          c.variants.forEach(function(v) {expanded_contains.push(inherit(c, v));});
	        } else {
	          expanded_contains.push(c == 'self' ? mode : c);
	        }
	      });
	      mode.contains = expanded_contains;
	      mode.contains.forEach(function(c) {compileMode(c, mode);});
	
	      if (mode.starts) {
	        compileMode(mode.starts, parent);
	      }
	
	      var terminators =
	        mode.contains.map(function(c) {
	          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
	        })
	        .concat([mode.terminator_end, mode.illegal])
	        .map(reStr)
	        .filter(Boolean);
	      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/) {return null;}};
	    }
	
	    compileMode(language);
	  }
	
	  /*
	  Core highlighting function. Accepts a language name, or an alias, and a
	  string with the code to highlight. Returns an object with the following
	  properties:
	
	  - relevance (int)
	  - value (an HTML string with highlighting markup)
	
	  */
	  function highlight(name, value, ignore_illegals, continuation) {
	
	    function subMode(lexeme, mode) {
	      for (var i = 0; i < mode.contains.length; i++) {
	        if (testRe(mode.contains[i].beginRe, lexeme)) {
	          return mode.contains[i];
	        }
	      }
	    }
	
	    function endOfMode(mode, lexeme) {
	      if (testRe(mode.endRe, lexeme)) {
	        while (mode.endsParent && mode.parent) {
	          mode = mode.parent;
	        }
	        return mode;
	      }
	      if (mode.endsWithParent) {
	        return endOfMode(mode.parent, lexeme);
	      }
	    }
	
	    function isIllegal(lexeme, mode) {
	      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
	    }
	
	    function keywordMatch(mode, match) {
	      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
	      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
	    }
	
	    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
	      var classPrefix = noPrefix ? '' : options.classPrefix,
	          openSpan    = '<span class="' + classPrefix,
	          closeSpan   = leaveOpen ? '' : '</span>';
	
	      openSpan += classname + '">';
	
	      return openSpan + insideSpan + closeSpan;
	    }
	
	    function processKeywords() {
	      if (!top.keywords)
	        return escape(mode_buffer);
	      var result = '';
	      var last_index = 0;
	      top.lexemesRe.lastIndex = 0;
	      var match = top.lexemesRe.exec(mode_buffer);
	      while (match) {
	        result += escape(mode_buffer.substr(last_index, match.index - last_index));
	        var keyword_match = keywordMatch(top, match);
	        if (keyword_match) {
	          relevance += keyword_match[1];
	          result += buildSpan(keyword_match[0], escape(match[0]));
	        } else {
	          result += escape(match[0]);
	        }
	        last_index = top.lexemesRe.lastIndex;
	        match = top.lexemesRe.exec(mode_buffer);
	      }
	      return result + escape(mode_buffer.substr(last_index));
	    }
	
	    function processSubLanguage() {
	      var explicit = typeof top.subLanguage == 'string';
	      if (explicit && !languages[top.subLanguage]) {
	        return escape(mode_buffer);
	      }
	
	      var result = explicit ?
	                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
	                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);
	
	      // Counting embedded language score towards the host language may be disabled
	      // with zeroing the containing mode relevance. Usecase in point is Markdown that
	      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
	      // score.
	      if (top.relevance > 0) {
	        relevance += result.relevance;
	      }
	      if (explicit) {
	        continuations[top.subLanguage] = result.top;
	      }
	      return buildSpan(result.language, result.value, false, true);
	    }
	
	    function processBuffer() {
	      result += (top.subLanguage !== undefined ? processSubLanguage() : processKeywords());
	      mode_buffer = '';
	    }
	
	    function startNewMode(mode, lexeme) {
	      result += mode.className? buildSpan(mode.className, '', true): '';
	      top = Object.create(mode, {parent: {value: top}});
	    }
	
	    function processLexeme(buffer, lexeme) {
	
	      mode_buffer += buffer;
	
	      if (lexeme === undefined) {
	        processBuffer();
	        return 0;
	      }
	
	      var new_mode = subMode(lexeme, top);
	      if (new_mode) {
	        if (new_mode.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (new_mode.excludeBegin) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
	            mode_buffer = lexeme;
	          }
	        }
	        startNewMode(new_mode, lexeme);
	        return new_mode.returnBegin ? 0 : lexeme.length;
	      }
	
	      var end_mode = endOfMode(top, lexeme);
	      if (end_mode) {
	        var origin = top;
	        if (origin.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (!(origin.returnEnd || origin.excludeEnd)) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (origin.excludeEnd) {
	            mode_buffer = lexeme;
	          }
	        }
	        do {
	          if (top.className) {
	            result += '</span>';
	          }
	          if (!top.skip) {
	            relevance += top.relevance;
	          }
	          top = top.parent;
	        } while (top != end_mode.parent);
	        if (end_mode.starts) {
	          startNewMode(end_mode.starts, '');
	        }
	        return origin.returnEnd ? 0 : lexeme.length;
	      }
	
	      if (isIllegal(lexeme, top))
	        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
	
	      /*
	      Parser should not reach this point as all types of lexemes should be caught
	      earlier, but if it does due to some bug make sure it advances at least one
	      character forward to prevent infinite looping.
	      */
	      mode_buffer += lexeme;
	      return lexeme.length || 1;
	    }
	
	    var language = getLanguage(name);
	    if (!language) {
	      throw new Error('Unknown language: "' + name + '"');
	    }
	
	    compileLanguage(language);
	    var top = continuation || language;
	    var continuations = {}; // keep continuations for sub-languages
	    var result = '', current;
	    for(current = top; current != language; current = current.parent) {
	      if (current.className) {
	        result = buildSpan(current.className, '', true) + result;
	      }
	    }
	    var mode_buffer = '';
	    var relevance = 0;
	    try {
	      var match, count, index = 0;
	      while (true) {
	        top.terminators.lastIndex = index;
	        match = top.terminators.exec(value);
	        if (!match)
	          break;
	        count = processLexeme(value.substr(index, match.index - index), match[0]);
	        index = match.index + count;
	      }
	      processLexeme(value.substr(index));
	      for(current = top; current.parent; current = current.parent) { // close dangling modes
	        if (current.className) {
	          result += '</span>';
	        }
	      }
	      return {
	        relevance: relevance,
	        value: result,
	        language: name,
	        top: top
	      };
	    } catch (e) {
	      if (e.message.indexOf('Illegal') != -1) {
	        return {
	          relevance: 0,
	          value: escape(value)
	        };
	      } else {
	        throw e;
	      }
	    }
	  }
	
	  /*
	  Highlighting with language detection. Accepts a string with the code to
	  highlight. Returns an object with the following properties:
	
	  - language (detected language)
	  - relevance (int)
	  - value (an HTML string with highlighting markup)
	  - second_best (object with the same structure for second-best heuristically
	    detected language, may be absent)
	
	  */
	  function highlightAuto(text, languageSubset) {
	    languageSubset = languageSubset || options.languages || Object.keys(languages);
	    var result = {
	      relevance: 0,
	      value: escape(text)
	    };
	    var second_best = result;
	    languageSubset.forEach(function(name) {
	      if (!getLanguage(name)) {
	        return;
	      }
	      var current = highlight(name, text, false);
	      current.language = name;
	      if (current.relevance > second_best.relevance) {
	        second_best = current;
	      }
	      if (current.relevance > result.relevance) {
	        second_best = result;
	        result = current;
	      }
	    });
	    if (second_best.language) {
	      result.second_best = second_best;
	    }
	    return result;
	  }
	
	  /*
	  Post-processing of the highlighted markup:
	
	  - replace TABs with something more useful
	  - replace real line-breaks with '<br>' for non-pre containers
	
	  */
	  function fixMarkup(value) {
	    if (options.tabReplace) {
	      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1 /*..., offset, s*/) {
	        return p1.replace(/\t/g, options.tabReplace);
	      });
	    }
	    if (options.useBR) {
	      value = value.replace(/\n/g, '<br>');
	    }
	    return value;
	  }
	
	  function buildClassName(prevClassName, currentLang, resultLang) {
	    var language = currentLang ? aliases[currentLang] : resultLang,
	        result   = [prevClassName.trim()];
	
	    if (!prevClassName.match(/\bhljs\b/)) {
	      result.push('hljs');
	    }
	
	    if (prevClassName.indexOf(language) === -1) {
	      result.push(language);
	    }
	
	    return result.join(' ').trim();
	  }
	
	  /*
	  Applies highlighting to a DOM node containing code. Accepts a DOM node and
	  two optional parameters for fixMarkup.
	  */
	  function highlightBlock(block) {
	    var language = blockLanguage(block);
	    if (isNotHighlighted(language))
	        return;
	
	    var node;
	    if (options.useBR) {
	      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
	    } else {
	      node = block;
	    }
	    var text = node.textContent;
	    var result = language ? highlight(language, text, true) : highlightAuto(text);
	
	    var originalStream = nodeStream(node);
	    if (originalStream.length) {
	      var resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      resultNode.innerHTML = result.value;
	      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
	    }
	    result.value = fixMarkup(result.value);
	
	    block.innerHTML = result.value;
	    block.className = buildClassName(block.className, language, result.language);
	    block.result = {
	      language: result.language,
	      re: result.relevance
	    };
	    if (result.second_best) {
	      block.second_best = {
	        language: result.second_best.language,
	        re: result.second_best.relevance
	      };
	    }
	  }
	
	  var options = {
	    classPrefix: 'hljs-',
	    tabReplace: null,
	    useBR: false,
	    languages: undefined
	  };
	
	  /*
	  Updates highlight.js global options with values passed in the form of an object.
	  */
	  function configure(user_options) {
	    options = inherit(options, user_options);
	  }
	
	  /*
	  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
	  */
	  function initHighlighting() {
	    if (initHighlighting.called)
	      return;
	    initHighlighting.called = true;
	
	    var blocks = document.querySelectorAll('pre code');
	    Array.prototype.forEach.call(blocks, highlightBlock);
	  }
	
	  /*
	  Attaches highlighting to the page load event.
	  */
	  function initHighlightingOnLoad() {
	    addEventListener('DOMContentLoaded', initHighlighting, false);
	    addEventListener('load', initHighlighting, false);
	  }
	
	  var languages = {};
	  var aliases = {};
	
	  function registerLanguage(name, language) {
	    var lang = languages[name] = language(hljs);
	    if (lang.aliases) {
	      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
	    }
	  }
	
	  function listLanguages() {
	    return Object.keys(languages);
	  }
	
	  function getLanguage(name) {
	    name = (name || '').toLowerCase();
	    return languages[name] || languages[aliases[name]];
	  }
	
	  /* Interface definition */
	
	  hljs.highlight = highlight;
	  hljs.highlightAuto = highlightAuto;
	  hljs.fixMarkup = fixMarkup;
	  hljs.highlightBlock = highlightBlock;
	  hljs.configure = configure;
	  hljs.initHighlighting = initHighlighting;
	  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
	  hljs.registerLanguage = registerLanguage;
	  hljs.listLanguages = listLanguages;
	  hljs.getLanguage = getLanguage;
	  hljs.inherit = inherit;
	
	  // Common regexps
	  hljs.IDENT_RE = '[a-zA-Z]\\w*';
	  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
	  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
	  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
	  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
	  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';
	
	  // Common modes
	  hljs.BACKSLASH_ESCAPE = {
	    begin: '\\\\[\\s\\S]', relevance: 0
	  };
	  hljs.APOS_STRING_MODE = {
	    className: 'string',
	    begin: '\'', end: '\'',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.QUOTE_STRING_MODE = {
	    className: 'string',
	    begin: '"', end: '"',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.PHRASAL_WORDS_MODE = {
	    begin: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
	  };
	  hljs.COMMENT = function (begin, end, inherits) {
	    var mode = hljs.inherit(
	      {
	        className: 'comment',
	        begin: begin, end: end,
	        contains: []
	      },
	      inherits || {}
	    );
	    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
	    mode.contains.push({
	      className: 'doctag',
	      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
	      relevance: 0
	    });
	    return mode;
	  };
	  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
	  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
	  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
	  hljs.NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE,
	    relevance: 0
	  };
	  hljs.C_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.C_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.BINARY_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.BINARY_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.CSS_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE + '(' +
	      '%|em|ex|ch|rem'  +
	      '|vw|vh|vmin|vmax' +
	      '|cm|mm|in|pt|pc|px' +
	      '|deg|grad|rad|turn' +
	      '|s|ms' +
	      '|Hz|kHz' +
	      '|dpi|dpcm|dppx' +
	      ')?',
	    relevance: 0
	  };
	  hljs.REGEXP_MODE = {
	    className: 'regexp',
	    begin: /\//, end: /\/[gimuy]*/,
	    illegal: /\n/,
	    contains: [
	      hljs.BACKSLASH_ESCAPE,
	      {
	        begin: /\[/, end: /\]/,
	        relevance: 0,
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }
	    ]
	  };
	  hljs.TITLE_MODE = {
	    className: 'title',
	    begin: hljs.IDENT_RE,
	    relevance: 0
	  };
	  hljs.UNDERSCORE_TITLE_MODE = {
	    className: 'title',
	    begin: hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };
	  hljs.METHOD_GUARD = {
	    // excludes method names from keyword processing
	    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };
	
	  return hljs;
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	var React = __webpack_require__(1)
	
	function mapChild (child, i, depth) {
	  if (child.tagName) {
	    return React.createElement(
	      child.tagName,
	      assign({key: 'lo-' + depth + '-' + i}, child.properties),
	      child.children && child.children.map(mapWithDepth(depth + 1))
	    )
	  }
	
	  return child.value
	}
	
	function mapWithDepth (depth) {
	  return function mapChildrenWithDepth (child, i) {
	    return mapChild(child, i, depth)
	  }
	}
	
	function assign (dst, src) {
	  for (var key in src) {
	    dst[key] = src[key]
	  }
	
	  return dst
	}
	
	exports.depth = mapWithDepth


/***/ }
/******/ ])
});
;
//# sourceMappingURL=Lowlight.js.map