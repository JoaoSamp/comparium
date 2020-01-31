var fs = require('fs');
var convert     = require('xml-js');
var obj_parser  = require('./obj_parser')

class Comparium {
    constructor ({data_a, data_b, ignored_words, non_defined, key_words}){
        this.parser_a       = obj_parser({
            name: data_a.name, 
            file: data_a.file, 
            ignored_words, 
            non_defined, 
            key_words
        })
        this.parser_b       = obj_parser({
            name: data_b.name, 
            file: data_b.file, 
            ignored_words, 
            non_defined, 
            key_words
        })
        this.ignored_words  = ignored_words
        this.non_defined    = non_defined
        this.key_words      = key_words
        this.final_file       = {}
        this.differences    = {}
        this.adds           = {}
    }

    CopyObj( source){
        let result = {}
        for (let prop in source){
            if (source.hasOwnProperty(prop)){
                if (typeof source[prop] == 'object'){
                    result[prop] = this.CopyObj(source[prop])
                }else{
                    result[prop] = source[prop]
                }
            }
        }
        return result
    }

    Inc_All(){
        for (let key in this.key_words){
            this.adds[key] = {}
            for (let permission in this.parser_a.parsed_obj[key]){
                // se estiver em a 
                // e nao estiver em b adiciona no obj final
                if ( this.parser_a.parsed_obj[key].hasOwnProperty(permission) && (!(this.parser_b.parsed_obj[key].hasOwnProperty(permission)) )){
                    this.final_file[key][permission]    = this.parser_a.parsed_obj[key][permission]
                    this.adds[key][permission]          = this.parser_a.parsed_obj[key][permission]
                }
            }
        }
    }

    Run_Comparison(){
        this.parser_a.Run_Parse()
        this.parser_b.Run_Parse()
        this.final_file = this.CopyObj(this.parser_b.parsed_obj)
        this.Inc_All()

    }

    Export(file_name){
        let report = {
            differences: this.differences,
            adds: this.adds
        }
        fs.writeFileSync(`${this.parser_a.name}_parsed.json`, JSON.stringify(this.parser_a.parsed_obj, null, 2))
        fs.writeFileSync(`${this.parser_b.name}_parsed.json`, JSON.stringify(this.parser_b.parsed_obj, null, 2))
        fs.writeFileSync(`${file_name}.json`, JSON.stringify(report, null, 2))
        fs.writeFileSync(`final_file.json`, JSON.stringify(this.final_file, null, 2))
        let xml = convert.json2xml(JSON.stringify(this.final_file), {compact: true, spaces: 4})
        fs.writeFileSync(`permission.xml`, xml)
    }
}

module.exports = function ({data_a, data_b, ignored_words, non_defined, key_words}) {
    return new Comparium( {data_a, data_b, ignored_words, non_defined, key_words} )
}