/*
 * JsMin
 * Javascript Compressor
 * http://www.crockford.com/
 * http://www.smallsharptools.com/
 */
dp.sh.Brushes.JScript = function () {
    var keywords = 'abstract boolean break byte case catch char class const continue debugger ' + 'default delete do double else enum export extends final finally float ' + 'for function goto if implements import in instanceof int interface long native ' + 'null package private protected public return short static super switch ' + 'synchronized throw throws transient try typeof var void volatile while with';
    var kw_value = "this true false";
    var kw_orange = "= new x y parent";
    this.regexList = [{
        regex: dp.sh.RegexLib.SingleLineCComments,
        css: 'comment'
    }, {
        regex: dp.sh.RegexLib.MultiLineCComments,
        css: 'comment'
    }, {
        regex: dp.sh.RegexLib.DoubleQuotedString,
        css: 'string'
    }, {
        regex: dp.sh.RegexLib.SingleQuotedString,
        css: 'string'
    }, {
        regex: new RegExp('^\\s*#.*', 'gm'),
        css: 'preprocessor'
    }, {
        regex: new RegExp(this.GetKeywords(keywords), 'gm'),
        css: 'keyword'
    }, {
        regex: new RegExp(this.GetKeywords(kw_value), 'gm'),
        css: 'value'
    }, {
        regex: new RegExp(this.GetKeywords(kw_orange), 'gm'),
        css: 'orange'
    }, {
        regex: new RegExp('\\d[.]\\d|\\s\\d(?=;)|\\d+(?=,)|\\d+(?=[)])', 'gm'), // numbers
        css: 'value'
    }, {
        regex: new RegExp('(^[.][.][.])$', 'gm'),
        css: 'gray'
    }, {
        regex: new RegExp('[=]', 'gm'),
        css: 'orange'
    }, {
        regex: new RegExp('\\b\\s(\\w+|\\w+[.]\\w+)(?=[(].*[)](;|,))', 'g'),
        css: 'class'
    }, {
        regex: new RegExp('\\w+(?=: function)', 'g'),
        css: 'class'
    }];
    this.CssClass = 'dp-c';
}
dp.sh.Brushes.JScript.prototype = new dp.sh.Highlighter();
dp.sh.Brushes.JScript.Aliases = ['js', 'jscript', 'javascript'];