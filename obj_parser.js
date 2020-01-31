var convert     = require('xml-js');
var fs          = require('fs');
class Obj_Parser{
    constructor({ name, file, ignored_words, non_defined, key_words }){
        this.name           = name || 'default_name'
        this.file           = file
        this.parsed_obj     = {}
        this.ignored_words  = ignored_words
        this.non_defined    = non_defined
        this.key_words      = key_words
    }

    Run_Parse(){
        let xml_file    = fs.readFileSync(this.file);
        var json_file   = convert.xml2json(xml_file, {compact: true, spaces: 2});
        this.obj        = JSON.parse(json_file)

        this.Run_Through_Obj(this.obj)
        if (this.non_defined.length > 0){
            console.log('Palavras não cadastradas')
            console.log(this.non_defined)
        }else{
            // console.log(this.parsed_obj)
        }
    }

    Is_Key_Word( word ) {
        if ( !this.ignored_words.includes(word) ){
            if ( this.key_words[word] ){
                return true
            } 
        }
        return false        
    }
    
    Add_If_Non_Defined( word){
        if ( !this.ignored_words.includes(word) ){
            if ( !this.non_defined.includes(word) ){
                this.non_defined.push(word)
            } 
        }
    }

    Create_Key_Obj(obj, key_name){
        if (key_name == 'value'){
            return obj._text
        }else{
            let key_obj = {}
            for (let prop in obj){
                if (prop != key_name){
                    key_obj[prop] = obj[prop]._text
                }
            }
            return key_obj
        }
    }

    Parse_Key_Obj ( obj, key_name ) {
        if (Array.isArray(obj)){
            let parsed_key_obj = obj.reduce(( parsed, item ) => {
                parsed[
                    item[ key_name ]._text
                ] = this.Create_Key_Obj(item, key_name)
                return parsed
            }, {})
            return parsed_key_obj
        }else{
            return this.Create_Key_Obj(obj, key_name)
        }
    }
    
    Run_Through_Obj (obj){
        if (Array.isArray(obj)){
            obj.map((item) => {
                this.Run_Through_Obj(item);
            })
        }else if (typeof obj === 'object'){
            for (let prop in obj){
                if ( this.Is_Key_Word(prop) ){
                    this.parsed_obj[prop] = this.Parse_Key_Obj(obj[prop], this.key_words[prop])
                } else {
                    this.Add_If_Non_Defined(prop)
                    this.Run_Through_Obj(obj[prop])
                }
            }
        }
    }
}
module.exports = function ({ name, file, ignored_words, non_defined, key_words }) {
    return new Obj_Parser({ name, file, ignored_words, non_defined, key_words })
}