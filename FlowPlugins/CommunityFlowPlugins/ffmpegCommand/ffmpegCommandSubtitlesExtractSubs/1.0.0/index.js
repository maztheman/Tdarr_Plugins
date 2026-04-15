"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
    name: 'Subtitles Extract Subs',
    description: 'Extract Subtitles to SRT,'
        + ' You must use the Begin/Exectute Command made for Multi Output.'
        + 'This outputs the subs to the input folder',
    style: {
        borderColor: '#6efefc',
    },
    tags: 'subtitle',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '',
    inputs: [
        {
            label: 'Overwrite existing SRT Files',
            name: 'overwrite',
            type: 'boolean',
            defaultValue: 'false',
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Overwrite with the extracted SRT files',
        },
        {
            label: 'Temp folder to extract to',
            name: 'sub_tmp_path',
            type: 'string',
            defaultValue: '',
            inputUI: {
                type: 'directory'
            },
            tooltip: 'If you enter a directory, this is where the subtitle files will be moved to, for later processing'
        }
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Continue to next plugin',
        },
    ],
}); };
exports.details = details;
var languageMap = {
    "aar": "aa", "abk": "ab", "afr": "af", "aka": "ak", "alb": "sq", "amh": "am", "ara": "ar", "arg": "an", "arm": "hy", "asm": "as", "ava": "av", "ave": "ae", "aym": "ay", "aze": "az", "bak": "ba", "bam": "bm", "baq": "eu", "bel": "be", "ben": "bn", "bih": "bh",
    "bis": "bi", "bod": "bo", "bos": "bs", "bre": "br", "bul": "bg", "bur": "my", "cat": "ca", "ces": "cs", "cha": "ch", "che": "ce", "chi": "zh", "chu": "cu", "chv": "cv", "cor": "kw", "cos": "co", "cre": "cr", "cym": "cy", "cze": "cs", "dan": "da", "deu": "de",
    "div": "dv", "dut": "nl", "dzo": "dz", "ell": "el", "eng": "en", "epo": "eo", "est": "et", "eus": "eu", "ewe": "ee", "fao": "fo", "fas": "fa", "fij": "fj", "fin": "fi", "fra": "fr", "fre": "fr", "fry": "fy", "ful": "ff", "geo": "ka", "ger": "de", "gla": "gd",
    "gle": "ga", "glg": "gl", "glv": "gv", "gre": "el", "grn": "gn", "guj": "gu", "hat": "ht", "hau": "ha", "heb": "he", "her": "hz", "hin": "hi", "hmo": "ho", "hrv": "hr", "hun": "hu", "hye": "hy", "ibo": "ig", "ice": "is", "ido": "io", "iii": "ii", "iku": "iu",
    "ile": "ie", "ina": "ia", "ind": "id", "ipk": "ik", "isl": "is", "ita": "it", "jav": "jv", "jpn": "ja", "kal": "kl", "kan": "kn", "kas": "ks", "kat": "ka", "kau": "kr", "kaz": "kk", "khm": "km", "kik": "ki", "kin": "rw", "kir": "ky", "kom": "kv", "kon": "kg",
    "kor": "ko", "kua": "kj", "kur": "ku", "lao": "lo", "lat": "la", "lav": "lv", "lim": "li", "lin": "ln", "lit": "lt", "ltz": "lb", "lub": "lu", "lug": "lg", "mac": "mk", "mah": "mh", "mal": "ml", "mao": "mi", "mar": "mr", "may": "ms", "mkd": "mk", "mlg": "mg",
    "mlt": "mt", "mon": "mn", "mri": "mi", "msa": "ms", "mya": "my", "nau": "na", "nav": "nv", "nbl": "nr", "nde": "nd", "ndo": "ng", "nep": "ne", "nld": "nl", "nno": "nn", "nob": "nb", "nor": "no", "nya": "ny", "oci": "oc", "oji": "oj", "ori": "or", "orm": "om",
    "oss": "os", "pan": "pa", "per": "fa", "pli": "pi", "pol": "pl", "por": "pt", "pus": "ps", "que": "qu", "roh": "rm", "ron": "ro", "rum": "ro", "run": "rn", "rus": "ru", "sag": "sg", "san": "sa", "sin": "si", "slk": "sk", "slo": "sk", "slv": "sl", "sme": "se",
    "smo": "sm", "sna": "sn", "snd": "sd", "som": "so", "sot": "st", "spa": "es", "sqi": "sq", "srd": "sc", "srp": "sr", "ssw": "ss", "sun": "su", "swa": "sw", "swe": "sv", "tah": "ty", "tam": "ta", "tat": "tt", "tel": "te", "tgk": "tg", "tgl": "tl", "tha": "th",
    "tib": "bo", "tir": "ti", "ton": "to", "tsn": "tn", "tso": "ts", "tuk": "tk", "tur": "tr", "twi": "tw", "uig": "ug", "ukr": "uk", "urd": "ur", "uzb": "uz", "ven": "ve", "vie": "vi", "vol": "vo", "wel": "cy", "wln": "wa", "wol": "wo", "xho": "xh", "yid": "yi",
    "yor": "yo", "zha": "za", "zho": "zh", "zul": "zu"
};
function getLanguageCode(input) {
    return languageMap[input] || input;
}
var buildSubtitleConfiguration = function (args) {
    var overwrite = Boolean(args.inputs.overwrite);
    var sub_tmp_path = String(args.inputs.sub_tmp_path);
    var fs = require('fs');
    var subIdx = -1;
    var subtitleSettings = {
        processFile: false,
        subOutput: [],
    };
    args.variables.ffmpegCommand.streams.forEach(function (stream) {
        var _a, _b;
        if (stream.codec_type !== 'subtitle') {
            return;
        }
        subIdx += 1;
        if (stream.removed) {
            return;
        }
        var lang = '';
        var title = '';
        var strDisposition = '';
        var boolTextSubs = false;
        var boolImageSubs = false;
        var subExt = '';
        var codec = '';
        if (((_a = stream.tags) === null || _a === void 0 ? void 0 : _a.language) !== undefined) {
            lang = getLanguageCode(stream.tags.language.toLowerCase());
        }
        if (((_b = stream.tags) === null || _b === void 0 ? void 0 : _b.title) !== undefined) {
            title = stream.tags.title.toLowerCase();
        }
        if (stream.codec_name !== undefined) {
            codec = stream.codec_name.toLowerCase();
        }
        if (stream.disposition.forced || (title.includes('forced'))) {
            strDisposition = '.forced';
        }
        else if (stream.disposition.sdh || (title.includes('sdh'))) {
            strDisposition = '.sdh';
        }
        else if (stream.disposition.cc || (title.includes('cc'))) {
            strDisposition = '.cc';
        }
        else if (stream.disposition.commentary || stream.disposition.description
            || (title.includes('commentary')) || (title.includes('description'))) {
            strDisposition = '.commentary';
        }
        else if (stream.disposition.lyrics
            || (title.includes('signs')) || (title.includes('songs'))) {
            strDisposition = '.signsandsongs';
        }
        if (codec === 'ass' || codec === 'mov_text' || codec === 'ssa' || codec === 'subrip') {
            boolTextSubs = true;
            subExt = 'srt';
        }
        else if (codec === 'dvd_subtitle') {
            boolImageSubs = true;
            subExt = 'mks';
        }
        if (!boolTextSubs && !boolImageSubs) {
            return;
        }
        if (!sub_tmp_path || sub_tmp_path.trim().length === 0) {
            // str is null, undefined, empty, or just whitespace
        }
        // Build subtitle file names.
        var fileName = (0, fileUtils_1.getFileName)(args.originalLibraryFile._id);
        var orignalFolder = (!sub_tmp_path || sub_tmp_path.trim().length === 0)
            ? (0, fileUtils_1.getFileAbsoluteDir)(args.originalLibraryFile._id)
            : sub_tmp_path;
        var tempsubsFile = [orignalFolder, '/', fileName];
        if (lang === '') {
            tempsubsFile.push(".und".concat(strDisposition, ".").concat(subExt));
        }
        else {
            tempsubsFile.push(".".concat(lang).concat(strDisposition, ".").concat(subExt));
        }
        var subsFile = tempsubsFile.join('');
        // Send Commands.
        if (fs.existsSync(subsFile) && !overwrite) {
            return;
        }
        args.jobLog("Extracting Subtitles at index ".concat(stream.index));
        subtitleSettings.processFile = true;
        if (boolTextSubs) {
            subtitleSettings.subOutput.push('-map', "0:s:".concat(subIdx), subsFile);
        }
        else {
            subtitleSettings.subOutput.push('-map', "0:s:".concat(subIdx), '-f', 'matroska', '-c:s', 'copy', subsFile);
        }
    });
    return subtitleSettings;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    var subtitleSettings = buildSubtitleConfiguration(args);
    if (subtitleSettings.processFile) {
        subtitleSettings.subOutput.forEach(function (element) {
            args.variables.ffmpegCommand.multiOutputArguments.push(element);
        });
    }
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
