var convert = require('xml-js');
var fs = require('fs');
var obj_parser = require('./obj_parser')

var xml_master  = fs.readFileSync('./master/permissionsets/Matriz.permissionset');
var xml_hml     = fs.readFileSync('./hml/permissionsets/Exemplo_PermissionSet_IppIntegrationMV.permissionset');
var json_hml    = convert.xml2json(xml_hml, {compact: true, spaces: 2});
var obj_hml     = JSON.parse(json_hml)


let ps_ignored_words = [ 
        '_declaration', 
        '_attributes', 
        'version', 
        'encoding',
        'xmlns',
        'PermissionSet'
    ]

let ps_key_words = {
    fieldPermissions :          'field',
    objectPermissions :         'object',
    recordTypeVisibilities :    'recordType',
    hasActivationRequired :     'value',
    label :                     'value',
    license :                   'value',
} 

let ps_non_defined = []

let parser = obj_parser({obj: obj_hml, ignored_words: ps_ignored_words, non_defined: ps_non_defined, key_words: ps_key_words})
parser.Run_Parse()



fs.writeFileSync('ps_hml.json', json_hml)
fs.writeFileSync('ps_parsed.json', JSON.stringify(parser.parsed_obj, null, 2))
