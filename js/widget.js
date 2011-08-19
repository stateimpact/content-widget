(function() {
    function require(variable, src) {
        if (!variable || !src) return;
        if (!window[variable]) {
            var script = document.createElement('script');
            script.src = src;
            document.head.appendChild(script);
            console.log("Loaded " + variable);
        }
    }
    window.require = require;
    
})();

(function($) {
    var BASE_URL = "http://localhost:9000/";
    var loadCSS = function(url, media) {
        var link   = document.createElement('link');
        link.rel   = 'stylesheet';
        link.type  = 'text/css';
        link.media = media || 'screen';
        link.href  = url;
        var head   = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    };
    
    var WidgetOptions = Backbone.Model.extend({
        
        defaults: {
            count: 10,
            excerpts: true,
            theme: "light",
            state: null
        }
    });
    
    var Story = Backbone.Model.extend({
        
        defaults: {
            title: "",
            author: "",
            date: "",
            excerpt: "",
            url: ""
        },
        
        initialize: function(attributes, options) {
            if (attributes.date) {
                this.attributes.date = new Date( Date.parse( attributes.date ) );
            }
            this.view = new StoryView({ model: this });
        }
    });
    
    var StoryList = Backbone.Collection.extend({
        
        model: Story,
        
        parse: function(response) {
            return response.posts;
        }
    });
    
    var StoryView = Backbone.View.extend({
        
        className: "si-story",
        
        initialize: function(options) {
            _.bindAll(this);
            this.template = window.JST['story']
            this.model.bind('change', this.render);
            return this;
        },
        
        render: function(options) {
            var context = {
                story: this.model.toJSON(),
                options: options
            }
            $(this.el).html(this.template(context));
            return this.el;
        }
    });
    
    
    /***
    StoryWidget defines the public interface for embedding stories.
    ***/
    window.StoryWidget = Backbone.View.extend({
        
        initialize: function(options) {            
            _.bindAll(this);
            this.options = new WidgetOptions(options);
            this.collection = new StoryList;
            
            this.collection.bind('reset', this.render_content);
            this.setBlogUrl(options.state);
            this.template = window.JST['widget'];
            return this.render();
        },
        
        render: function() {
            loadCSS(BASE_URL + 'css/widget.css');
            $(this.el).html(this.template(this.options.toJSON()));
            this.collection.fetch({dataType: 'jsonp'});
            return this;
        },
        
        render_content: function() {
            var el = this.$('.si-content').empty();
            var options = this.options.toJSON();
            this.collection.each(function(story) {
                el.append(story.view.render(options));
            });
        },
        
        setBlogUrl: function(state) {
            if (!this.collection || !state) return;
            this.collection.url = "http://statewatch.argoproject.org/" + state + "/api/get_recent_posts/?count=" + this.options.get('count');
            return this;
        }
    });
    
})(window.jQuery);
