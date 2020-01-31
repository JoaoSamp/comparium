
    function CopyObj( source){
        let result = {}
        for (prop in source){
            if (source.hasOwnProperty(prop)){
                if (typeof source[prop] == 'object'){
                    result[prop] = CopyObj(source[prop])
                }else{
                    result[prop] = source[prop]
                }
            }
        }
        return result
    }


    obj = {
        nome: {
            primeiro: 'joao',
            sobrenome: 'sampaio'
        },
        idade : 28,
        endereco: {
            rua: 'estrada dos tres rios',
            numero: '347',
            complemento: {
                apt: '203',
                ponto_referencia: 'padaria kuffura'
            }
        }
    }
    copia = CopyObj(obj)
    copia.nome.primeiro = 'bruno'
    copia.endereco.complemento.apt = 204
    console.log(obj)
    console.log(copia)