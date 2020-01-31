var convert     = require('xml-js');
var fs          = require('fs');
var obj_parser  = require('./obj_parser')
var comparer    = require('./compare')

var xml_hml     = fs.readFileSync('./hml/permissionsets/Exemplo_PermissionSet_IppIntegrationMV (Modificado).permissionset');
var xml_master  = fs.readFileSync('./hml/permissionsets/Exemplo_PermissionSet_IppIntegrationMV.permissionset');

var json_hml    = convert.xml2json(xml_hml,     {compact: true, spaces: 2});
var json_master = convert.xml2json(xml_master,  {compact: true, spaces: 2});

var obj_hml     = JSON.parse(json_hml)
var obj_master  = JSON.parse(json_master)

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

let hml_parser = obj_parser({name: 'hml', obj: obj_hml, ignored_words: ps_ignored_words, non_defined: ps_non_defined, key_words: ps_key_words})
let master_parser = obj_parser({name: 'master', obj: obj_master, ignored_words: ps_ignored_words, non_defined: ps_non_defined, key_words: ps_key_words})
let comparium = comparer({parser_a: hml_parser, parser_b: master_parser})
comparium.Run_Comparison()
comparium.Export('report')