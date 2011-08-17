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
    
    require('jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js');
    require('_', 'http://documentcloud.github.com/underscore/underscore-min.js');
})();

var JST = {};
JST.story = _.template('<h4 class="si-story-title"><a href="<%= link %>"><%= title %></a></h4>' +
                  '<p class="si-story-meta">' +
                    '<span class="si-story-author"><%= author %></span> | ' +
                    '<span class="si-story-date"><%= date.toDateString() %></span>' + 
                  '</p>' + 
                  '<p class="si-story-excerpt"><%= excerpt %></p>')

jQuery(function($) {
    
    var Story = Backbone.Model.extend({
        
        defaults: {
            title: "",
            author: "",
            date: "",
            excerpt: "",
            link: ""
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
            return response.value.items;
        }
    });
    
    var StoryView = Backbone.View.extend({
        
        className: "si-story",
        template: JST.story,
        
        initialize: function(options) {
            _.bindAll(this);
            this.model.bind('change', this.render);
            return this.render();
        },
        
        render: function() {
            $(this.el).html( this.template( this.model.toJSON() ));
            return this;
        }
    });
    
    
    /***
    StoryWidget defines the public interface for embedding stories.
    ***/
    window.StoryWidget = Backbone.View.extend({
        
        initialize: function(options) {            
            _.bindAll(this);
            _.defaults(options, {
                height : 0,
                width  : 0
            });
            
            this.collection = options.collection || new StoryList;
            
            if (options.url) {
                this.collection.url = options.url;
            }
            
            this.collection.bind('reset', this.render);
            
            this.options = options;
            return this;
        },
        
        render: function() {
            var el = $(this.el).empty();
            el.css({
                height : this.options.height,
                width  : this.options.width
            });
            this.collection.each(function(story) {
                el.append(story.view.el);
            });
        }
    });
    
})
