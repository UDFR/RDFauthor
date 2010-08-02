/*
 * This file is part of the RDFauthor project.
 * http://code.google.com/p/rdfauthor
 * Author: Norman Heino <norman.heino@gmail.com>
 */

/*
 * RDFauthor widget template.
 * Use this as a base for your own widget implementations.
 */
RDFauthor.registerWidget({
    /*
    // Uncomment this to execute code when your widget is instantiated, 
    // e.g. load scripts/stylesheets etc.
    init: function () {},
    */ 
    
    // Uncomment this to execute code when you widget's markup is ready in the DOM, 
    // e.g. load jQuery plug-ins, attach event handlers etc.
    ready: function () {
        var self   = this;
        var cssRed = 'rgb(255, 187, 187)';
        this.element().keyup(function (event) {
            if (!self.validateLabel(self.element().val())) {
                var currentColour = self.element().css('background-color');
                if (currentColour != cssRed) {
                    self.element().data('previousColour', self.element().css('background-color'));
                }
                self.element().css('background-color', cssRed);
            } else {
                self.element().css('background-color', self.element().data('previousColour'));
            }
        });
    },
    
    // return your jQuery-wrapped main input element here
    element: function () {
        return $('#mail-value-' + this.ID);
    }, 
    
    /*
    // Uncomment to give focus to your widget.
    // The default implementation will give focus to the first match in the 
    // return value of element().
    focus: function () {},
    */ 
    
    // return your widget's markup code here
    markup: function () {        
        var markup = '\
            <div class="container resource-value" style="width:' + this.availableWidth() + 'px;">\
                <input type="text" id="mail-value-' + this.ID + '" class="text"\
                 value="' + this.labelForURI(this.statement.objectValue()) + '"\
                 style="width:' + (this.availableWidth() - 24) + 'px;\
                        background-position:1% center;\
                        background-image:url(\'' + RDFAUTHOR_BASE + 'img/email.png\');\
                        background-repeat:no-repeat;\
                        padding-left:22px" />\
            </div>';

        return markup;
    }, 
    
    // commit changes here (add/remove/change)
    submit: function () {
        if (this.shouldProcessSubmit()) {
            // get databank
            var databank   = RDFauthor.databankForGraph(this.statement.graphURI());
            var hasChanged = (
                this.statement.hasObject() 
                && this.statement.objectValue() !== this.value()
            );
            
            if (hasChanged || this.removeOnSubmit) {
                databank.remove(this.statement.asRdfQueryTriple());
            }
            
            if (!this.removeOnSubmit) {
                try {
                    var newStatement = this.statement.copyWithObject({value: '<' + this.value() + '>'});
                    databank.add(newStatement.asRdfQueryTriple());
                } catch (e) {
                    var msg = e.message ? e.message : e;
                    alert('Could not save resource for the following reason: \n' + msg);
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
    
    value: function() {
        var typedValue = this.element().val();
        if ('' !== typedValue) {
            return this.URIForLabel(typedValue);
        }
        
        return null;
    }, 
    
    labelForURI: function (URI) {
        var label = String(URI)
            .replace(/mailto:/g, '');   // remove the mailto: prefix
        
        return label;
    }, 
    
    validateLabel: function (label) {
        var phoneRE = new RegExp(/^[a-zA-Z_-]+@([0-9a-z-]+\.)+([a-z]){2,5}$/);
        
        return phoneRE.test(label);
    }, 
    
    URIForLabel: function (label) {
        var URI = String(label);
        
        return 'mailto:' + URI;
    }
}, [{
    // hooks to register your widget for
        // Uncomment this if your widgets binds to the property hook, 
        // and denote the type of property (ObjectProperty or DatatypeProperty).
        // For other hooks this can be inferred automatically.
        type: 'ObjectProperty', 
        // name of first hook
        name: 'property',
        // array of values for first hook 
        values: ['http://xmlns.com/foaf/0.1/mbox']
    }]
);