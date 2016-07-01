# Responsive, reactive, styled, internationalized Data Table

A simple filterable data table providing reactive internationalization and a proper responsive style using Bootstrap.

## Features

* Showing data in [Data Tables](https://github.com/aslagle/reactive-table/)
* Reactive internationalization using [Tapi18n](https://github.com/TAPevents/tap-i18n/)
* Pretty responsive styling based on Bootsrap ([AdminLTE](https://github.com/yp2/AdminLTE/))
* Search Filter
* Rows per Page Filter
* Pagination

## Installation

The installation doc includes examples showing german football players in a data table.

Install reactive table:

`meteor add bedorn:reactive-data-table`

Create a folder, named "i18n" in root directory including the language files
and copy the follwoing translation into it (ex. english, en.i18n.json):

```
{
    "table_NoEntries": "no entries",
    "table_entries": "entries",
    "table_entry": "entry",
    "table_showing": "Showing",
    "table_to": "to",
    "table_of": "of",
    "table_has": "has",
    "table_table": "Table",
    "table_Previous": "Previous",
    "table_Next": "Next",
    "table_search": "Search"
}
```

Subscribe a collection and add code below into your template:

```
{{> reactiveDataTable
        collection=collection
        tableClass="table table-bordered table-striped table-hover dataTable"
        fields=fields
        searchFields=searchFields
        showSearchFilter=true
        showRowsPerPageFilter=true
}}
```

### Settings

* `collection`: Collection. Use a helper and return the collection which should be displayed within the table

```
collection() {
    return Players.find();
}
```

* `tableClass`: Optional value. CSS class for table. Default value is "table table-bordered table-striped table-hover dataTable"

* `fields`: Object. Controls the Columns. For reactive translation, you need to add the expressions in brackets into the json translation files. However it is also possible to use a simple String

```
fields() {
    return [
        {
            key: 'name',
            label: function() {
                return TAPi18n.__("tableColumnHeadline_name");
            }
        }, 
        {
            key: 'number',
            label: function() {
                return TAPi18n.__("tableColumnHeadline_number");
            }
        }, 
        {
            key: 'position',
            label: function() {
                return TAPi18n.__("tableColumnHeadline_position");
            }
        }, 
        {
            key: 'club',
            label: function() {
                return TAPi18n.__("tableColumnHeadline_club");
            }
        },
        {
            label: function() {
                return TAPi18n.__("tableColumnHeadline_profile");
            },
            tmpl: Template.showProfileButton,
            sortable: false
        }
    ];
}
```

* `searchFields`: Array. Includes the column keys which should be used for filtering (search filter)

```
searchFields() {
    return ['name', 'position', 'club'];
},
```

* `showSearchFilter`: Optional Bool value if searchFilter should appear, Default is "true"

* `showRowsPerPageFilter`: Optional Bool value if RowsPerPageFilter should appear, Default is "true". If the amount of rows is below 10, the filter and pagination does not appear.

### Style color (pagination button)

Copy the code below in your css file:

```
.pagination > .active > a,
    .pagination > .active > a:focus,
    .pagination > .active > a:hover,
    .pagination > .active > span,
    .pagination > .active > span:focus,
    .pagination > .active > span:hover {
        background-color: #dd4b39;
        border-color: #d73925;
        color: #fff;
    }
```

## License

MIT