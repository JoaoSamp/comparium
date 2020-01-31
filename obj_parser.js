
class Obj_Parser{
    constructor({ name, obj, ignored_words, non_defined, key_words }){
        this.name           = name || 'default_name'
        this.obj            = obj
        this.parsed_obj     = {}
        this.xml_obj
        this.ignored_words  = ignored_words
        this.non_defined    = non_defined
        this.key_words      = key_words
    }

    Run_Parse(){
        this.Run_Through_Obj(this.obj)
        if (this.non_defined.length > 0){
            console.log('Palavras não cadastradas')
            console.log(this.non_defined)
        }else{
            // console.log(this.parsed_obj)
        }
    }

    Is_Key_Word( word ) {
        if ( this.key_words[word] ){
            return true
        } 
        return false        
    }

    Is_Non_Defined( word ) {
        return this.non_defined.includes(word)    
    }
    
    Is_Ignored( word){
        return this.ignored_words.includes(word)  
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

    Run_Through_Obj (obj, par_obj){
        let parent_obj = par_obj || this.parsed_obj
        if (Array.isArray(obj)){
            obj.map((item) => {
                this.Run_Through_Obj(item, parent_obj);
            })
        }else if (typeof obj === 'object'){
            for (let prop in obj){
                if ( this.Is_Key_Word(prop) ){
                    parent_obj[prop] = this.Parse_Key_Obj(obj[prop], this.key_words[prop])
                } else if (this.Is_Ignored(prop)){
                    if (!parent_obj[prop]){
                        parent_obj[prop] = {}    
                    }
                    this.Run_Through_Obj(obj[prop], obj)
                }else if(this.Is_Non_Defined(prop)){
                    this.non_defined.push(prop)
                    this.Run_Through_Obj(obj[prop], obj)
                }
            }
        }else{
            console.log('else')
        }
    }
}
module.exports = function ({ obj, ignored_words, non_defined, key_words }) {
    return new Obj_Parser({ obj, ignored_words, non_defined, key_words })
}