'use strict';

if (!window.dddd) {
    window.dddd  = {}
}

if (!window.dddd.jekyll) {
    window.dddd.jekyll = {}
}

(function (win, doc, loc) {
    const utils = {
        deparam: () => {
            const paramString = decodeURIComponent(loc.href.substring(loc.href.indexOf('?') + 1, loc.href.length))

            const paramPairs = paramString.split('&')
            return paramPairs.reduce((acc, curr) => {
                const paramPair = curr.split('=')

                return {
                    [paramPair[0]]: paramPair[1],
                    ...acc
                }
            }, {})
        },
        warning: (message) => {
            console.log(`%c${message}`, 'color: #e91e63')
        },
        getParameterValue: function (key, defaultValue = '') {
            try {
                const params = this.deparam()

                const paramterValue = params[key]
                if (paramterValue === undefined) {
                    throw 'Not found query parameter'
                }

                return  paramterValue
            } catch (e) {
                this.warning(e)
                return defaultValue
            }
        },
        querySelector: function (selector) {
            try {
                return doc.querySelector(selector)
            } catch (e) {
                this.warning(`Not Found Element: ${selector}`)
                return {}
            }
        },
        formatDate: function (val, format) {
            const date = new Date(val)
            if (!date) {
                return '';
            }

            const weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
            const hours = date.getHours()

            return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
                switch ($1) {
                    case "yyyy": return date.getFullYear();
                    case "yy": return utils.zf(date.getFullYear() % 1000);
                    case "MM": return utils.zf(date.getMonth() + 1);
                    case "dd": return utils.zf(date.getDate());
                    case "E": return weekName[date.getDay()];
                    case "HH": return utils.zf(date.getHours());
                    case "hh": return utils.zf((hours % 12) ? hours : 12);
                    case "mm": return utils.zf(date.getMinutes());
                    case "ss": return utils.zf(date.getSeconds());
                    case "a/p": return date.getHours() < 12 ? "오전" : "오후";
                    default: return $1;
                }
            });
        },
        zf: function (val, len = 2) {
            let str = '';
            for (let i = 0; i < len - val.toString().length; i++) {
                str += '0';
            }

            return `${str}${val}`
        }
    }

    const defaults = {
        input: '#searchInput',
        targets: ['title', 'content', 'categories', 'tags'],
        dateFormat: 'yyyy.MM.dd',
        resultTemplate: '#template-post-list',
        resultContainer: '#postSection',
        parameterName: 'q',
        posts: [],
        renderResult: function(posts, q) {}
    }

    function Search (options) {
        this._defaults = defaults

        this.init(options)

        return this;
    }

    Search.prototype.init = function (options) {
        this.setConfig(options)

        const parameterValue = utils.getParameterValue(this._config.parameterName)

        utils.querySelector(this._config.input).value = parameterValue
        this._config.renderResult(this.filterPost(parameterValue), parameterValue)
    }

    Search.prototype.setConfig = function (options = {}) {
        try {
            if (!options.posts || (!options.renderResult && !win._)) {
                throw 'Undefined required properties.'
            }

            this._config = {
                ...this._defaults,
                renderResult: this.renderResult,
                ...options
            }

            console.log(this._config, this.renderResult)
        } catch (e) {
            utils.warning(e)
            throw e;
        }
    }

    Search.prototype.filterPost = function (q) {
        try {
            if (!(this._config.posts instanceof Array)) {
                throw 'Mismatch post type'
            }

            if (!q) {
                return []
            }

            return this._config.posts.filter((post) => {
                return this._config.targets.some(target => {
                    return post[target].indexOf(q) > -1
                })
            })
        } catch (e) {
            utils.warning(e)
            return []
        }
    }

    Search.prototype.renderResult = function (posts, q) {
        try {
            console.log(this._config)
            const html = _.template(utils.querySelector(this._config.resultTemplate).innerText)({
                posts,
                q,
                formatDate: (date) => utils.formatDate(date, this._config.dateFormat)
            })

            utils.querySelector(this._config.resultContainer).innerHTML = html
        } catch (e) {
            utils.warning('Please check resultTemplate or resultContainer')
        }
    }

    win.dddd.jekyll.Search = Search
})(window, document, location)


