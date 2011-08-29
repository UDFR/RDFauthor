/*
 * This file is part of the RDFauthor project.
 * http://code.google.com/p/rdfauthor
 * Author: Norman Heino <norman.heino@gmail.com>
 *         Clemens Hoffmann <cannelony@gmail.com>
 */
RDFauthor.registerWidget({
    // Uncomment this to execute code when your widget is instantiated, 
    // e.g. load scripts/stylesheets etc.
    init: function () {
        this._embedPicasaGalleryLoaded = false;
        this._slimboxLoaded = false;
        this._domRdy = false;
        var self = this;

        RDFauthor.loadStylesheet(RDFAUTHOR_BASE + 'libraries/slimbox/slimbox2.css');
        
        RDFauthor.loadStylesheet(RDFAUTHOR_BASE + 'src/widget.imagepicker.css');
        
        RDFauthor.loadScript(RDFAUTHOR_BASE + 'libraries/slimbox/slimbox2.js', function(){
            self._slimboxLoaded = true;
            self._init();
        });

        RDFauthor.loadScript(RDFAUTHOR_BASE + 'libraries/jquery.EmbedPicasaGallery.js', function(){
            self._embedPicasaGalleryLoaded = true;
            self._init();
        });

    },
    
    // Uncomment this to execute code when you widget's markup is ready in the DOM, 
    // e.g. load jQuery plug-ins, attach event handlers etc.
    ready: function () {
        var self = this;
        self._domRdy = true;
        self._init();
    },
    
    // return your jQuery-wrapped main input element here
    element: function () {
        return $('#imagepicker-edit-' + this.ID);
    }, 
    
    /*
    // Uncomment to give focus to your widget.
    // The default implementation will give focus to the first match in the 
    // return value of element().
    focus: function () {},
    */ 
    
    // return your widget's markup code here
    markup: function () {
        var markup = 
            '<div class="container" style="width:100%">\
                <input type="text" style="width:50%" class="text" name="imagepicker" id="imagepicker-edit-' + this.ID + '" value="' 
                    + (this.statement.hasObject() ? this.statement.objectValue() : '') + '"/>\
            </div>';

        var imagePicker = 
            '<div id="imagepicker" class="window" style="display: none;">\
               <h1 class="title">ImagePicker</h1>\
               <div class="window-buttons">\
                 <div class="window-buttons-left"></div>\
                 <div class="window-buttons-right">\
                   <span class="button button-windowclose"><span>\
                 </div>\
               </div>\
               <div class="content">\
                 <div id="gallery" class="width99" style="height:500px;border:1px solid #ccc;">\
                 </div>\
              </div>\
             </div>\
            ';
        
        if( $('#imagepicker').length == 0 ) {
            $('body').append(imagePicker);
        }

        return markup;
    }, 
    
    // commit changes here (add/remove/change)
    submit: function () {
        if (this.shouldProcessSubmit()) {
            // get databank
            var databank = RDFauthor.databankForGraph(this.statement.graphURI());
            
            var somethingChanged = (
                this.statement.hasObject() && 
                    this.statement.objectValue() !== this.value()
            );
            
            var isNew = !this.statement.hasObject() && (null !== this.value());
            
            if (somethingChanged || this.removeOnSubmit) {
                var rdfqTriple = this.statement.asRdfQueryTriple();
                if (rdfqTriple) {
                    databank.remove(String(rdfqTriple));
                }
            }
            
            if ((null !== this.value()) && !this.removeOnSubmit && (somethingChanged || isNew)) {
                try {
                    var newStatement = this.statement.copyWithObject({
                        value: this.value(), 
                        type: 'uri'
                    });
                    databank.add(newStatement.asRdfQueryTriple());
                } catch (e) {
                    var msg = e.message ? e.message : e;
                    alert('Could not save literal for the following reason: \n' + msg);
                    return false;
                }
            }
        }
        
        return true;
    }, 
    
    shouldProcessSubmit: function () {
        var t1 = !this.statement.hasObject();
        var t2 = null === this.value();
        var t3 = this.removeOnSubmit;
        
        return (!(t1 && t2) || t3);
    },
    
    value: function () {
        var value = this.element().val();
        if (String(value).length > 0) {
            return value;
        }
        
        return null;
    },

    _init: function () {
        var self = this;
        var focus;
        if (self._embedPicasaGalleryLoaded && self._slimboxLoaded && self._domRdy) {
            self.element().click(function(){
                focus = true;
                // positioning
                var left = self._getPosition().left + 'px !important;';
                var top = self._getPosition().top + 'px !important';

                $('#imagepicker').css('left',left)
                                 .css('top',top)
                                 .data('input',$(this))
                                 .show();
            });
            
            $("html").click(function(){
                if ($('#imagepicker').css("display") != "none" && focus == false) {
                    $('#imagepicker').fadeOut();
                }else if (focus == true){
                    $('#imagepicker').fadeIn();
                }
            });
            $('#imagepicker,input[name="imagepicker"]').mouseover(function(){
                focus = true;
            });
            $('#imagepicker,input[name="imagepicker"]').mouseout(function(){
                focus = false;
            });

            $('.rdfauthor-view-content,html').scroll(function() {
                var left = self._getPosition().left + 'px !important;';
                var top = self._getPosition().top + 'px !important';
                    
                $('#imagepicker').css('left',left)
                                .css('top',top);
                $('#imagepicker').fadeOut();
            });

            $('#imagepicker .button-windowclose').live('click', function() {
                $('#imagepicker').fadeOut();
            });

        }
    },

    _getPosition: function() {
        var pos = {
            'top' : this.element().offset().top + this.element().outerHeight(),
            'left': this.element().offset().left
        };
        return pos;
    }

}, {
        name: 'property',
        values: ['http://xmlns.com/foaf/0.1/depiction',
                 'http://xmlns.com/foaf/0.1/image']
   }
);
