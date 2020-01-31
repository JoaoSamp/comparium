var fs = require('fs');

class Compare {
    constructor ({parser_a, parser_b}){
        this.parser_a = parser_a
        this.parser_b = parser_b
        this.parsed_a = {}
        this.parsed_b = {}
        this.parsed_c = {}
        this.differences = {}
        this.adds = {}
    }

    Iterate(a, b){
        for (let key in a){
            if (typeof a[key] == 'object'){
                if(b[key]){
                    if (! this.Iterate(a[key], b[key])){
                        this.differences[key] = {a : a[key], b: b[key]}
                    }
                }else{                
                    if (!a.Is_Key_Word){
                        this.parsed_c[key] = a[key]
                        this.adds[key] = a[key]
                    }
                }
            }else{
                if( a[key] != b[key] ){
                    return false 
                }
            }            
        }
        return true
    }

    Run_Comparison(){
        this.parser_a.Run_Parse()
        this.parser_b.Run_Parse()
        this.parsed_a = this.parser_a.parsed_obj
        this.parsed_b = this.parser_b.parsed_obj
        this.Iterate(this.parsed_a, this.parsed_b)
        this.Iterate(this.parsed_b, this.parsed_a )
    }

    Export(file_name){
        let report = {
            differences: this.differences,
            adds: this.adds
        }
        fs.writeFileSync(`${this.parser_a.name}_parsed.json`, JSON.stringify(this.parser_a.parsed_obj, null, 2))
        fs.writeFileSync(`${this.parser_b.name}_parsed.json`, JSON.stringify(this.parser_b.parsed_obj, null, 2))
        fs.writeFileSync(`${file_name}.json`, JSON.stringify(report, null, 2))
    }
}

module.exports = function ({parser_a, parser_b}) {
    return new Compare( {parser_a, parser_b} )
}