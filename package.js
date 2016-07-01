Package.describe({
    name: 'bedorn:reactive-data-table',
    version: '0.0.1',
    summary: 'Reactive data table based on JS Data table and styled with AdminLTE including pagniation, filters and reactive translation',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.2.4');

    api.use('templating', ['client']);
    api.use('ecmascript');
    api.use('underscore');
    api.use('aslagle:reactive-table');
    api.use('tap:i18n');
    api.use('yp2:admin-lte');

    api.addFiles(['lib/reactive-data-table.html',
                   'lib/reactive-data-table.js',
                   'lib/reactive-data-table.css'
                 ], 'client');
});
