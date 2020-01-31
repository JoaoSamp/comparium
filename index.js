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

let non_defined = []
data_a = {
    name: 'xml',
    file: './hml/permissionsets/Matriz.permissionset'
}
data_b = {
    name: 'master',
    file: './master/permissionsets/Matriz.permissionset'
}

let comparium = comparer({data_a, data_b, key_words, ignored_words, non_defined})
comparium.Run_Comparison()
comparium.Export('report')