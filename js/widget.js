(function($) {    
    
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
                // using a regex here since we know what the date will look like
                var d = attributes.date.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
                this.attributes.date = new Date( d[1], d[2], d[3], d[4], d[5], d[6] );
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
            return $(this.render);
        },
        
        render: function() {
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
            this.collection.url = "http://stateimpact.npr.org/" + state.toLowerCase() + "/api/get_recent_posts/?count=" + this.options.get('count');
            return this;
        }
    });
    
})(window.jQuery);
