class Compare {
    constructor (parsed_a, parsed_b){
        this.parsed_a = parsed_a
        this.parsed_b = parsed_b
        this.parsed_c = {}
    }
    Run_Comparison(){
        for (let prop in parsed_a){
            if (parsed_b[prop]){
            }else{
                parsed_c[prop] = parsed_a[prop]
            }
        }
    }
}