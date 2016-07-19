Package.describe({
    name: 'bedorn:reactive-data-table',
    version: '1.0.5',
    summary: 'Reactive data table, styled with AdminLTE including pagination, filters and reactive translation',
    documentation: 'README.md',
    git: 'https://github.com/bedorn/reactive-data-table.git'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.2.4');

    api.use('templating@1.1.12_1', ['client']);
    api.use('ecmascript@0.4.6_1');
    api.use('underscore@1.0.9');
    api.use('aslagle:reactive-table@0.8.32');
    api.use('tap:i18n@1.8.2');
    api.use('yp2:admin-lte@2.3.1');

    api.addFiles(['lib/reactive-data-table.html',
                   'lib/reactive-data-table.js',
                   'lib/reactive-data-table.css'
                 ], 'client');
});
