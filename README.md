# Responsive, reactive, styled, internationalized Data Table

A simple filterable data table providing reactive internationalization and a proper responsive style using Bootstrap.

![Example](table-example.png)

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
    "table_Last": "Last",
    "table_First": "First",
    "table_search": "Search"
}
```

Subscribe a collection and add code below into your template:

```
{{> reactiveDataTable
        collection=collection
        tableClass="table table-bordered table-striped table-hover dataTable"
        tableId="germanPlayersTable"
        fields=fields
        searchFields=searchFields
        showSearchFilter=true
        showRowsPerPageFilter=true
        showOwnUser=false
        searchFilterId="germanPlayersSearchFilter"
        maxPageNumbers=5
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

* `tableId`: String value which defines the Id of the table"

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

* `showOwnUser`: Optional Bool value which considers the total value of entries if the collection is Meteor.users and the query excludes the own/logged in user. Default is false.

* `searchFilterId`: Optional String value for define the id of the search input field. If there are more than one instances of the reactive-data-table set the id, as the search input value would affect all table instances.

* `maxPageNumbers`: Number how many page buttons are displayed. Optional Number value, minimum is 5, Default is 10. If the maximum of page numbers exceed the param, the two buttons "first" and "last" appear.

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
