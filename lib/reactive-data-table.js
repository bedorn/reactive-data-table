Template.reactiveDataTable.onCreated(function() {
    let collection = Template.instance().data.collection;
    if (!(collection instanceof Mongo.Collection || collection instanceof Mongo.Collection.Cursor)) {
        throw new Meteor.Error("bedorn:reactiveDataTable error: collection argument is not an instance of Mongo.Collection or Cursor");
    }
    if (!_.isArray(Template.instance().data.fields) && Template.instance().data.fields) {
        throw new Meteor.Error('bedorn:reactiveDataTable error: fields is not an instance of type array');
    }
    if (Template.instance().data.fields && Template.instance().data.fields.length == 0) {
        throw new Meteor.Error('bedorn:reactiveDataTable error: fields instance (array) is empty');
    }
    if (!_.isString(Template.instance().data.tableClass) && Template.instance().data.tableClass) {
        throw new Meteor.Error('bedorn:reactiveDataTable error: tableClass is not an instance of string');
    }
    if (!_.isString(Template.instance().data.tableId) && Template.instance().data.tableId) {
        throw new Meteor.Error('bedorn:reactiveDataTable error: tableId is not an instance of string');
    }
    Session.set('current-page', 0);
    Session.set('rows-per-page', 10);
    let currentPage = new ReactiveVar(Session.get('current-page') || 0);
    let rowsPerPage = new ReactiveVar(Session.get('rows-per-page') || 10);
    this.currentPage = currentPage;
    this.rowsPerPage = rowsPerPage;
    this.autorun(() => {
        Session.set('current-page', currentPage.get());
        Session.set('rows-per-page', rowsPerPage.get());
    });
});

Template.reactiveDataTable.events({
    'change #clientRowsPerPage' () {
        const rows_num = parseInt($('#clientRowsPerPage').val());
        Template.instance().rowsPerPage.set(rows_num);
        Template.instance().currentPage.set(0);
    },
    'click .next-page' (event) {
        event.preventDefault();
        const nextPage = Template.instance().currentPage.get() + 1;
        const collection = Template.instance().data.collection.collection;
        const currentPage = Template.instance().currentPage.get() + 1;
        const countPages = parseInt(collection.find().count() / Template.instance().rowsPerPage.get());
        const countPagesMod = collection.find().count() % Template.instance().rowsPerPage.get();
        let count = countPagesMod == 0 ? countPages : (countPages + 1);
        if (count !== currentPage) {
            Template.instance().currentPage.set(nextPage);
        }
    },
    'click .previous-page' (event) {
        event.preventDefault();
        const previousPage = Template.instance().currentPage.get() - 1;
        const currentPage = Template.instance().currentPage.get() + 1;
        if (currentPage > 1) {
            Template.instance().currentPage.set(previousPage);
        }
    },
    'click .goToPage' (event) {
        event.preventDefault();
        const page = parseInt(event.target.id);
        Template.instance().currentPage.set(page);
    }
});

Template.reactiveDataTable.helpers({
    searchLabel() {
        return TAPi18n.__("table_search");
    },
    currentPage() {
        const currentPage = Template.instance().currentPage.get() + 1;
        return currentPage;
    },
    rowsPerPage() {
        return Template.instance().rowsPerPage.get();
    },
    sumEntries() {
        const collection = Template.instance().data.collection.collection;
        if (_.isBoolean(Template.instance().data.showOwnUser) && Template.instance().data.showSearchFilter) {
            if (Template.instance().data.showOwnUser) {
                return collection.find().count();
            }
            return collection.find().count() - 1;
        }
        return collection.find().count();
    },
    isPageOneActive() {
        const currentPage = Template.instance().currentPage.get() + 1;
        return currentPage === 1;
    },
    isLastPageActive() {
        const collection = Template.instance().data.collection.collection;
        const currentPage = Template.instance().currentPage.get() + 1;
        const countPages = parseInt(collection.find().count() / Template.instance().rowsPerPage.get());
        const countPagesMod = collection.find().count() % Template.instance().rowsPerPage.get();
        let count = countPagesMod == 0 ? countPages : (countPages + 1);
        return count === currentPage;
    },
    hasMoreThan10Entries() {
        const collection = Template.instance().data.collection.collection;
        return collection.find().count() > 10;
    },
    hasNoEntries() {
        const collection = Template.instance().data.collection.collection;
        return collection.find().count() == 0;
    },
    hasMoreThan1Entry() {
        const collection = Template.instance().data.collection.collection;
        return collection.find().count() > 1;
    },
    showPagination() {
        const collection = Template.instance().data.collection.collection;
        return collection.find().count() > Template.instance().rowsPerPage.get();
    },
    pages() {
        const collection = Template.instance().data.collection.collection;
        const countPages = parseInt(collection.find().count() / Template.instance().rowsPerPage.get());
        const countPagesMod = collection.find().count() % Template.instance().rowsPerPage.get();
        let pages = Array();
        let count = countPagesMod == 0 ? countPages : (countPages + 1);
        for (let i = 0; i < count; i++) {
            pages[i] = i + 1;
        }
        return pages;
    },
    isPageActive(page) {
        const currentPage = Template.instance().currentPage.get() + 1;
        return page == currentPage;
    },
    showing() {
        const showing = (Template.instance().rowsPerPage.get() *
            Template.instance().currentPage.get()) + 1;
        return showing;
    },
    to() {
        const to = Template.instance().rowsPerPage.get() *
            (Template.instance().currentPage.get() + 1);
        return to;
    },
    settings() {
        return {
            collection: Template.instance().data.collection,
            rowsPerPage: Template.instance().rowsPerPage,
            currentPage: Template.instance().currentPage,
            showFilter: false,
            showRowCount: false,
            showNavigation: 'never',
            showNavigationRowsPerPage: false,
            showColumnToggles: false,
            multiColumnSort: true,
            class: Template.instance().data.tableClass || "table table-bordered table-striped table-hover dataTable",
            id: Template.instance().data.tableId || "tableId",
            fields: Template.instance().data.fields,
            filters: (Template.instance().data.searchFilterId && [Template.instance().data.searchFilterId]) || ['searchFilter'],
            ready: false
        };
    },
    showSearchFilter() {
        if (!_.isBoolean(Template.instance().data.showSearchFilter) && Template.instance().data.showSearchFilter) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: showSearchFilter is not an instance of boolean');
        }
        return _.isBoolean(Template.instance().data.showSearchFilter) ? Template.instance().data.showSearchFilter : true;
    },
    searchFilterId() {
        if (Template.instance().data.searchFilterId && !_.isString(Template.instance().data.searchFilterId)) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFilterId is not an instance of string');
        }
        return Template.instance().data.searchFilterId || 'searchFilter';
    },
    showRowsPerPageFilter() {
        if (!_.isBoolean(Template.instance().data.showRowsPerPageFilter) && Template.instance().data.showRowsPerPageFilter) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: showRowsPerPage is not an instance of boolean');
        }
        return _.isBoolean(Template.instance().data.showRowsPerPageFilter) ? Template.instance().data.showRowsPerPageFilter : true;
    },
    searchFields() {
        if (!_.isArray(Template.instance().data.searchFields) && Template.instance().data.searchFields) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFields is not an instance of array');
        }
        if (Template.instance().data.searchFields && Template.instance().data.searchFields.length == 0) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFields instance (array) is empty');
        }
        return Template.instance().data.searchFields;
    }
});
