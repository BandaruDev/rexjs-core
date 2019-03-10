"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var loader_utils_1 = require("loader-utils");
var path_1 = require("path");
var postcss_1 = require("postcss");
var url_1 = require("url");
function wrapUrl(urls) {
    var wrappedUrl;
    var hasSingleQuotes = urls.indexOf("'") >= 0;
    if (hasSingleQuotes) {
        wrappedUrl = "\"" + urls + "\"";
    }
    else {
        wrappedUrl = "'" + urls + "'";
    }
    return "url(" + wrappedUrl + ")";
}
function resolve(file, base, resolver) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, resolver('./' + file, base)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, resolver(file, base)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = postcss_1.default.plugin('postcss-cli-resources', function (options) {
    if (!options) {
        throw new Error("missing required configuration");
    }
    var _a = options.deployUrl, deployUrl = _a === void 0 ? '' : _a, _b = options.baseHref, baseHref = _b === void 0 ? '' : _b, _c = options.resourcesOutputPath, resourcesOutputPath = _c === void 0 ? '' : _c, filename = options.filename, loader = options.loader;
    var dedupeSlashes = function (urls) { return urls.replace(/\/\/+/g, '/'); };
    var process = function (inputUrl, context, resourceCache) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var cacheKey, cachedUrl, outputUrl, _a, pathname, hash, search, resolver, result;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // If root-relative, absolute or protocol relative url, leave as is
                    if (/^((?:\w+:)?\/\/|data:|chrome:|#)/.test(inputUrl)) {
                        return [2 /*return*/, inputUrl];
                    }
                    // If starts with a caret, remove and return remainder
                    // this supports bypassing asset processing
                    if (inputUrl.startsWith('^')) {
                        return [2 /*return*/, inputUrl.substr(1)];
                    }
                    cacheKey = path_1.default.resolve(context, inputUrl);
                    cachedUrl = resourceCache.get(cacheKey);
                    if (cachedUrl) {
                        return [2 /*return*/, cachedUrl];
                    }
                    if (inputUrl.startsWith('~')) {
                        inputUrl = inputUrl.substr(1);
                    }
                    if (inputUrl.startsWith('/')) {
                        outputUrl = '';
                        if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                            // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                            outputUrl = "" + deployUrl.replace(/\/$/, '') + inputUrl;
                        }
                        else if (baseHref.match(/:\/\//)) {
                            // If baseHref contains a scheme, include it as is.
                            outputUrl = baseHref.replace(/\/$/, '') + dedupeSlashes("/" + deployUrl + "/" + inputUrl);
                        }
                        else {
                            // Join together base-href, deploy-url and the original URL.
                            outputUrl = dedupeSlashes("/" + baseHref + "/" + deployUrl + "/" + inputUrl);
                        }
                        resourceCache.set(cacheKey, outputUrl);
                        return [2 /*return*/, outputUrl];
                    }
                    _a = url_1.default.parse(inputUrl.replace(/\\/g, '/')), pathname = _a.pathname, hash = _a.hash, search = _a.search;
                    resolver = function (file, base) {
                        return new Promise(function (resolves, reject) {
                            loader.resolve(base, file, function (err, results) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolves(result);
                            });
                        });
                    };
                    return [4 /*yield*/, resolve(pathname, context, resolver)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, new Promise(function (resolves, reject) {
                            loader.fs.readFile(result, function (err, content) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                var outputPath = loader_utils_1.interpolateName({ resourcePath: result }, filename, {
                                    content: content,
                                });
                                if (resourcesOutputPath) {
                                    outputPath = path_1.default.posix.join(resourcesOutputPath, outputPath);
                                }
                                loader.addDependency(result);
                                loader.emitFile(outputPath, content, undefined);
                                var outputUrl = outputPath.replace(/\\/g, '/');
                                if (hash || search) {
                                    outputUrl = url_1.default.format({ pathname: outputUrl, hash: hash, search: search });
                                }
                                if (deployUrl && loader.loaders[loader.loaderIndex].options.ident !== 'extracted') {
                                    outputUrl = url_1.default.resolve(deployUrl, outputUrl);
                                }
                                resourceCache.set(cacheKey, outputUrl);
                                resolves(outputUrl);
                            });
                        })];
            }
        });
    }); };
    return function (root) {
        var urlDeclarations = [];
        root.walkDecls(function (decl) {
            if (decl.value && decl.value.includes('url')) {
                urlDeclarations.push(decl);
            }
        });
        if (urlDeclarations.length === 0) {
            return;
        }
        var resourceCache = new Map();
        return Promise.all(urlDeclarations.map(function (decl) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var value, urlRegex, segments, match, lastIndex, modified, inputFile, context, originalUrl, processedUrl, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = decl.value;
                        urlRegex = /url\(\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s*\)/g;
                        segments = [];
                        lastIndex = 0;
                        modified = false;
                        inputFile = decl.source && decl.source.input.file;
                        context = (inputFile && path_1.default.dirname(inputFile)) || loader.context;
                        _a.label = 1;
                    case 1:
                        if (!(match = urlRegex.exec(value))) return [3 /*break*/, 6];
                        originalUrl = match[1] || match[2] || match[3];
                        processedUrl = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, process(originalUrl, context, resourceCache)];
                    case 3:
                        processedUrl = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        loader.emitError(decl.error(err_1.message, { word: originalUrl }).toString());
                        return [3 /*break*/, 1];
                    case 5:
                        if (lastIndex < match.index) {
                            segments.push(value.slice(lastIndex, match.index));
                        }
                        if (!processedUrl || originalUrl === processedUrl) {
                            segments.push(match[0]);
                        }
                        else {
                            segments.push(wrapUrl(processedUrl));
                            modified = true;
                        }
                        lastIndex = match.index + match[0].length;
                        return [3 /*break*/, 1];
                    case 6:
                        if (lastIndex < value.length) {
                            segments.push(value.slice(lastIndex));
                        }
                        if (modified) {
                            decl.value = segments.join('');
                        }
                        return [2 /*return*/];
                }
            });
        }); }));
    };
});
