(function() {
    if (window.StoryWidget && StoryWidget.loaded) return;
    
    window.StoryWidget = window.StoryWidget || {};
    var BASE_URL = "http://nprstateimpact.s3.amazonaws.com/widget/";
    // var BASE_URL = "/public/assets/";
    
    var loadCSS = function(url, media) {
        var link   = document.createElement('link');
        link.rel   = 'stylesheet';
        link.type  = 'text/css';
        link.media = media || 'screen';
        link.href  = url;
        var head   = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    };
    loadCSS(BASE_URL + 'widget.css');
    window.StoryWidget.loaded = true;
    document.write('<script src="' + BASE_URL + 'postswidget.js" type="text/javascript"></script>')
})()