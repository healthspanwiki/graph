"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getPageTitles_1 = __importDefault(require("./helpers/getPageTitles"));
var login_1 = __importDefault(require("./helpers/login"));
var dotenv = __importStar(require("dotenv"));
var editPage_1 = __importDefault(require("./helpers/editPage"));
var fetch_cookie_1 = __importDefault(require("fetch-cookie"));
var getPageContents_1 = __importDefault(require("./helpers/getPageContents"));
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var titles, pages, pageTitleSet, _i, pages_1, page, deadLinksSet, _a, pages_2, page, _b, _c, link, deadLinks, originalFetch, fetch, token, _d, pages_3, page, content, _e, deadLinks_1, deadLink, content;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, getPageTitles_1.default)()];
                case 1:
                    titles = _f.sent();
                    return [4 /*yield*/, (0, getPageContents_1.default)(titles)];
                case 2:
                    pages = _f.sent();
                    pageTitleSet = new Set();
                    for (_i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                        page = pages_1[_i];
                        pageTitleSet.add(page.title);
                    }
                    deadLinksSet = new Set();
                    for (_a = 0, pages_2 = pages; _a < pages_2.length; _a++) {
                        page = pages_2[_a];
                        for (_b = 0, _c = page.links; _b < _c.length; _b++) {
                            link = _c[_b];
                            if (!pageTitleSet.has(link)) {
                                deadLinksSet.add(link);
                            }
                        }
                    }
                    deadLinks = Array.from(deadLinksSet);
                    originalFetch = require('node-fetch');
                    fetch = (0, fetch_cookie_1.default)(originalFetch, new fetch_cookie_1.default.toughCookie.CookieJar());
                    return [4 /*yield*/, (0, login_1.default)(fetch, process.env.BOT_USERNAME || '', process.env.BOT_PASSWORD || '')];
                case 3:
                    token = _f.sent();
                    console.log(token);
                    _d = 0, pages_3 = pages;
                    _f.label = 4;
                case 4:
                    if (!(_d < pages_3.length)) return [3 /*break*/, 7];
                    page = pages_3[_d];
                    if (!(!page.categories.includes("Red") && !page.categories.includes("Green") && !page.categories.includes("Yellow"))) return [3 /*break*/, 6];
                    content = page.content + "\n[[Category:Red]]";
                    return [4 /*yield*/, (0, editPage_1.default)(fetch, page.title, content, token)];
                case 5:
                    _f.sent();
                    _f.label = 6;
                case 6:
                    _d++;
                    return [3 /*break*/, 4];
                case 7:
                    _e = 0, deadLinks_1 = deadLinks;
                    _f.label = 8;
                case 8:
                    if (!(_e < deadLinks_1.length)) return [3 /*break*/, 11];
                    deadLink = deadLinks_1[_e];
                    content = "empty\n[[Category:Red]]";
                    return [4 /*yield*/, (0, editPage_1.default)(fetch, deadLink, content, token)];
                case 9:
                    _f.sent();
                    _f.label = 10;
                case 10:
                    _e++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main();
