var fs = require('fs');
var convert     = require('xml-js');
var obj_parser  = require('./obj_parser')

class Comparium {
    constructor ({data_a, data_b, ignored_words, key_words}){
        this.parser_a       = obj_parser({
            name: data_a.name, 
            file: data_a.file, 
            ignored_words, 
            key_words
        })
        this.parser_b       = obj_parser({
            name: data_b.name, 
            file: data_b.file, 
            ignored_words, 
            key_words
        })
        this.ignored_words  = ignored_words
        this.non_defined    = {}
        this.key_words      = key_words
        this.final_file     = {}
        this.differences    = {}
        this.adds           = {}
    }

    Copy_Obj( source ){
        let result = {}
        for (let prop in source){
            if (source.hasOwnProperty(prop)){
                if (Array.isArray(source[prop])){
                    result[prop] = source[prop].map((item) => {
                        return this.Copy_Obj(item)
                    })
                }else if (typeof source[prop] == 'object'){
                    result[prop] = this.Copy_Obj(source[prop])
                }else{
                    result[prop] = source[prop]
                }
            }
        }
        return result
    }

    Add_Missing_Elements(){
        for (let key in this.key_words){
            this.adds[key] = {}
            for (let element in this.parser_a.parsed_obj[key]){
                // se estiver em a 
                // e nao estiver em b adiciona no conjunto de adições
                if ( this.parser_a.parsed_obj[key].hasOwnProperty(element) && (!(this.parser_b.parsed_obj[key].hasOwnProperty(element)) )){
                    //this.final_file[key][element]    = this.parser_a.parsed_obj[key][element]
                    this.adds[key][element]          = this.parser_a.parsed_obj[key][element]
                }
            }
        }
    }

    Remove_From_Adds(key, element){
        delete this.adds[key][element]
    }

    Check_For_Differences(){
        for (let key in this.key_words){
            this.differences[key] = {}
            for (let element in this.parser_a.parsed_obj[key]){
                // se estiver em a e em b compara valores
                if ( this.parser_a.parsed_obj[key].hasOwnProperty(element) && this.parser_b.parsed_obj[key].hasOwnProperty(element) ){
                    for (let value in this.parser_a.parsed_obj[key][element]){
                        let exists = this.parser_a.parsed_obj[key][element].hasOwnProperty(value) && this.parser_b.parsed_obj[key][element].hasOwnProperty(value)
                        let are_equals = this.parser_a.parsed_obj[key][element][value] == this.parser_b.parsed_obj[key][element][value]
                        if ( exists && are_equals ){
                            continue
                        }else{
                            this.differences[key][element] = {}
                            this.differences[key][element][this.parser_a.name] = this.parser_a.parsed_obj[key][element]
                            this.differences[key][element][this.parser_b.name] = this.parser_b.parsed_obj[key][element]
                            break
                        }
                    }
                }
            }
        }
    }

    Run_Comparison(){
        this.parser_a.Run_Parse()
        this.parser_b.Run_Parse()
        this.final_file = this.Copy_Obj(this.parser_b.parsed_obj)
        this.Add_Missing_Elements()
        this.Check_For_Differences()
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

module.exports = function ({data_a, data_b, ignored_words, key_words}) {
    return new Comparium( {data_a, data_b, ignored_words, key_words} )
}