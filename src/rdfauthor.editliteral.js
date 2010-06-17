/*
 * This file is part of the RDFauthor project.
 * http://code.google.com/p/rdfauthor
 * Author: Norman Heino <norman.heino@gmail.com>
 */
RDFauthor.registerWidget({
    name: 'LiteralEdit', 
    
    init: function () {
        this.disclosureID = RDFauthor.nextID();
        this.languages    = RDFauthor.literalLanguages();
        this.datatypes    = RDFauthor.literalDatatypes();
        this.namespaces   = RDFauthor.namespaces();

        this.languages.unshift('');
        
        RDFauthor.loadScript(RDFAUTHOR_BASE + 'libraries/autoresize.jquery.min.js');
    }, 
    
    ready: function () {
        
    }, 
    
    isLarge: function () {
        var objectValue = this.statement.objectValue();
        if (objectValue.search) {
            return ((objectValue.length >= 50) || 0 <= objectValue.search(/\n/));
        }

        return false;
    }, 
    
    makeOptionString: function(options, selected, replaceNS) {
        replaceNS = replaceNS || false;

        var optionString = '';
        for (var i = 0; i < options.length; i++) {
            var display = options[i];
            if (replaceNS) {
                for (var s in this.ns) {
                    if (options[i].match(this.ns[s])) {
                        display = options[i].replace(this.ns[s], s + ':');
                        break;
                    }
                }
            }

            var current = options[i] == selected;
            if (current) {
                // TODO: do something
            }

            // Firefox hack
            if (display == '') {
                display = '[none]';
            }

            optionString += '<option value="' + options[i] + '"' + (current ? 'selected="selected"' : '') + '>' + display + '</option>';
        }

        return optionString;
    }, 
    
    element: function () {
        return jQuery('#literal-value-' + this.ID);
    }, 
    
    markup: function () {
        var areaConfig = {
            rows: (this.isLarge() ? '3' : '1'), 
            style: (this.isLarge() ? 'width:29em' : 'width:16em;height:1.4em;padding-top:0.2em'), 
            buttonClass: (this.isLarge()) ? 'disclosure-button-horizontal' : 'disclosure-button-vertical'
        }

        var areaMarkup = '\
            <div class="container literal-value">\
                <textarea rows="' + String(areaConfig.rows) + '" cols="20" style="' + areaConfig.style + '" id="literal-value-' + 
                    this.ID + '">' + this.statement.objectValue() + '</textarea>\
            </div>\
            <div class="container util" style="clear:left">\
                <a class="disclosure-button ' + areaConfig.buttonClass + ' open" id="' + this.disclosureID 
                        + '" title="Toggle details disclosure"></a>\
            </div>';

        var markup = '\
            ' + areaMarkup + '\
            <div class="container literal-type util ' + this.disclosureID + '" style="display:none">\
                <label><input type="radio" class="radio" name="literal-type-' + this.ID + '"' 
                        + (this.statement.objectDatatype ? '' : ' checked="checked"') + ' value="plain" />Plain</label>\
                <label><input type="radio" class="radio" name="literal-type-' + this.ID + '"' 
                        + (this.statement.objectDatatype ? ' checked="checked"' : '') + ' value="typed" />Typed</label>\
            </div>\
            <div class="container util ' + this.disclosureID + '" style="display:none">\
                <div class="literal-lang"' + (this.statement.objectDatatype() ? ' style="display:none"' : '') + '>\
                    <label for="literal-lang-' + this.ID + '">Language:\
                        <select id="literal-lang-' + this.ID + '" name="literal-lang-' + this.ID + '">\
                            ' + this.makeOptionString(this.languages, this.statement.objectLang()) + '\
                        </select>\
                    </label>\
                </div>\
                <div class="literal-datatype"' + (this.statement.objectDatatype ? '' : ' style="display:none"') + '>\
                    <label>Datatype:\
                        <select id="literal-datatype-' + this.ID + '" name="literal-datatype-' + this.ID + '">\
                            ' + this.makeOptionString(this.datatypes, this.statement.objectDatatype, true) + '\
                        </select>\
                    </label>\
                </div>\
            </div>';

        return markup;
    }, 
    
    remove: function () {
        this.removeOnSubmit = true;
    }, 
    
    submit: function () {
        alert('Submit');
    }
}, {
    hookName: '__LITERAL__'
});