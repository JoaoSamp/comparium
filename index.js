var comparer    = require('./comparium')

let ignored_words = [ 
        '_declaration', 
        '_attributes', 
        'version', 
        'encoding',
        'xmlns',
        'PermissionSet'
    ]

let key_words = {
    fieldPermissions :          'field',
    objectPermissions :         'object',
    recordTypeVisibilities :    'recordType',
    userPermissions :           'name',
    hasActivationRequired :     'value',
    label :                     'value',
    license :                   'value',
} 

data_a = {
    name: 'hml',
    file: './hml/permissionsets/IppIntegrationMV.permissionset'
}
data_b = {
    name: 'master',
    file: './master/permissionsets/IppIntegrationMV.permissionset'
}

let comparium = comparer({data_a, data_b, key_words, ignored_words})
comparium.Run_Comparison()
comparium.Export('report')