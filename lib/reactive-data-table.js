const _getDataCount = (collection) => {
    let count = 0;
    if (collection instanceof Mongo.Collection
        || collection instanceof Mongo.Collection.Cursor) {
        count = _getDataCount(collection);
    } else if (_.isArray(collection)) {
        count = collection.length;
    }

    return count;
};

Template.reactiveDataTable.onCreated(function() {
    const collection = Template.instance().data.collection;

    if (!(collection instanceof Mongo.Collection
        || collection instanceof Mongo.Collection.Cursor
        || _.isArray(collection))) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: collection argument is not an instance of Mongo.Collection or Cursor or Array');
    }

    if (!_.isArray(Template.instance().data.fields)
        && Template.instance().data.fields) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: fields is not an instance of type array');
    }

    if (Template.instance().data.fields
        && Template.instance().data.fields.length === 0) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: fields instance (array) is empty');
    }

    if (!_.isString(Template.instance().data.tableClass)
        && Template.instance().data.tableClass) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: tableClass is not an instance of string');
    }

    if (!_.isString(Template.instance().data.tableId)
        && Template.instance().data.tableId) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: tableId is not an instance of string');
    }

    if (!_.isString(Template.instance().data.bodyClass)
        && Template.instance().data.bodyClass) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: bodyClass is not an instance of string');
    }

    if (!_.isNumber(Template.instance().data.maxPageNumbers)
        && Template.instance().data.maxPageNumbers) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: maxPageNumbers is not an instance of type number');
    } else if (Template.instance().data.maxPageNumbers
        && (Template.instance().data.maxPageNumbers <= 5)) {

        throw new Meteor.Error('bedorn:reactiveDataTable error: maxPageNumbers minimum is 5');
    }

    Session.set('current-first-page', 1);
    Session.set('current-page', 0);
    Session.set('rows-per-page', 10);

    const currentFirstPage = new ReactiveVar(Session.get('current-first-page')
        || 1);

    const currentPage = new ReactiveVar(Session.get('current-page') || 0);
    const rowsPerPage = new ReactiveVar(Session.get('rows-per-page') || 10);

    this.currentFirstPage = currentFirstPage;
    this.currentPage = currentPage;
    this.rowsPerPage = rowsPerPage;

    this.autorun(() => {
        Session.set('current-first-page', currentFirstPage.get());
        Session.set('current-page', currentPage.get());
        Session.set('rows-per-page', rowsPerPage.get());
    });
});

Template.reactiveDataTable.events({
    'change #clientRowsPerPage' () {
        const rowsNum = parseInt($('#clientRowsPerPage').val(), 10);
        Template.instance().rowsPerPage.set(rowsNum);
        Template.instance().currentPage.set(0);
    },
    'click .next-page' (event) {
        event.preventDefault();
        let currentFirstPage = Template.instance().currentFirstPage.get();
        const maxPageNumbers = Template.instance().data.maxPageNumbers || 10;
        const nextPage = Template.instance().currentPage.get() + 1;
        const collection = Template.instance().data.collection.collection;
        const currentPage = Template.instance().currentPage.get() + 1;

        const countPages = parseInt(collection.find().count()
            / Template.instance().rowsPerPage.get(), 10);

        const countPagesMod = collection.find().count()
            % Template.instance().rowsPerPage.get();

        const count = countPagesMod === 0 ? countPages : (countPages + 1);

        if (count !== currentPage) {
            Template.instance().currentPage.set(nextPage);
        }

        if ((currentPage + 1) > (currentFirstPage + (maxPageNumbers - 1))) {
            currentFirstPage += 1;
            Template.instance().currentFirstPage.set(currentFirstPage);
        }
    },
    'click .previous-page' (event) {
        event.preventDefault();
        let currentFirstPage = Template.instance().currentFirstPage.get();
        const previousPage = Template.instance().currentPage.get() - 1;
        const currentPage = Template.instance().currentPage.get() + 1;

        if (currentPage > 1) {
            Template.instance().currentPage.set(previousPage);
        }

        if ((currentPage - 1) < currentFirstPage) {
            currentFirstPage -= 1;
            Template.instance().currentFirstPage.set(currentFirstPage);
        }
    },
    'click .goToPage' (event) {
        event.preventDefault();
        const page = parseInt(event.target.id, 10) - 1;
        Template.instance().currentPage.set(page);
    },
    'click .last-page' (event) {
        event.preventDefault();
        const collection = Template.instance().data.collection;
        const maxPageNumbers = Template.instance().data.maxPageNumbers || 10;
        const countPages = parseInt(_getDataCount(collection)
            / Template.instance().rowsPerPage.get()) - 1;

        const firstPage = countPages - maxPageNumbers + 1;

        Template.instance().currentFirstPage.set(firstPage + 1);
        Template.instance().currentPage.set(countPages);
    },
    'click .first-page' (event) {
        event.preventDefault();
        Template.instance().currentFirstPage.set(1);
        Template.instance().currentPage.set(0);
    }
});

Template.reactiveDataTable.helpers({
    searchLabel() {
        return TAPi18n.__('table_search');
    },
    currentPage() {
        const currentPage = Template.instance().currentPage.get() + 1;
        return currentPage;
    },
    rowsPerPage() {
        return Template.instance().rowsPerPage.get();
    },
    sumEntries() {
        const collection = Template.instance().data.collection;

        if (_.isBoolean(Template.instance().data.showOwnUser)
                && Template.instance().data.showSearchFilter) {

            if (Template.instance().data.showOwnUser) {
                return _getDataCount(collection);
            }

            return _getDataCount(collection) - 1;
        }

        return _getDataCount(collection);
    },
    isPageOneActive() {
        const currentPage = Template.instance().currentPage.get() + 1;
        return currentPage === 1;
    },
    isLastPageActive() {
        const collection = Template.instance().data.collection;
        const currentPage = Template.instance().currentPage.get() + 1;
        const countPages = parseInt(_getDataCount(collection)
            / Template.instance().rowsPerPage.get(), 10);

        const countPagesMod = _getDataCount(collection)
            % Template.instance().rowsPerPage.get();

        const count = countPagesMod === 0
            ? countPages
            : (countPages + 1);

        return count === currentPage;
    },
    hasMoreThan10Entries() {
        const collection = Template.instance().data.collection;
        return _getDataCount(collection) > 10;
    },
    hasNoEntries() {
        const collection = Template.instance().data.collection;
        return _getDataCount(collection) === 0;
    },
    hasMoreThan1Entry() {
        const collection = Template.instance().data.collection;
        return _getDataCount(collection) > 1;
    },
    showPagination() {
        const collection = Template.instance().data.collection;
        return _getDataCount(collection) > Template.instance().rowsPerPage.get();
    },
    bodyClass() {
        return Template.instance().data.bodyClass || null;
    },
    hasMoreThanMaxDefPages() {
        const maxPageNumbers = Template.instance().data.maxPageNumbers || 10;
        const collection = Template.instance().data.collection;
        const countPages = parseInt(_getDataCount(collection) /
            Template.instance().rowsPerPage.get(), 10);

        return countPages > (maxPageNumbers + 1);
    },
    pages() {
        const maxPageNumbers = Template.instance().data.maxPageNumbers || 10;
        let firstPageNumber = Template.instance().currentFirstPage.get();
        let lastPageNumber = Template.instance().currentFirstPage.get() +
            maxPageNumbers;

        const collection = Template.instance().data.collection;

        const countPages = parseInt(_getDataCount(collection) /
            Template.instance().rowsPerPage.get(), 10);

        const countPagesMod = _getDataCount(collection) %
            Template.instance().rowsPerPage.get();

        const count = countPagesMod === 0 ? countPages : (countPages + 1);

        let hasLessThenMaxPageNumbers = false;

        if (count < (maxPageNumbers + 1)) {
            lastPageNumber = count;
            firstPageNumber = 0;
            hasLessThenMaxPageNumbers = true;
        }

        const pages = [];

        for (let i = firstPageNumber; i < lastPageNumber; i++) {
            if (hasLessThenMaxPageNumbers) {
                pages.push(i + 1);
            } else {
                pages.push(i);
            }
        }

        return pages;
    },
    isPageActive(page) {
        const currentPage = Template.instance().currentPage.get() + 1;
        return page === currentPage;
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
            class: Template.instance().data.tableClass
                || 'table table-bordered table-striped table-hover dataTable',
            id: Template.instance().data.tableId || 'tableId',
            fields: Template.instance().data.fields,
            filters: (Template.instance().data.searchFilterId
                && [Template.instance().data.searchFilterId])
                || ['searchFilter'],
            ready: false
        };
    },
    showSearchFilter() {
        if (!_.isBoolean(Template.instance().data.showSearchFilter) &&
            Template.instance().data.showSearchFilter) {

            throw new Meteor.Error('bedorn:reactiveDataTable error: showSearchFilter is not an instance of boolean');
        }

        return _.isBoolean(Template.instance().data.showSearchFilter) ? Template.instance().data.showSearchFilter : true;
    },
    searchFilterId() {
        if (Template.instance().data.searchFilterId
            && !_.isString(Template.instance().data.searchFilterId)) {

            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFilterId is not an instance of string');
        }

        return Template.instance().data.searchFilterId || 'searchFilter';
    },
    showRowsPerPageFilter() {
        if (!_.isBoolean(Template.instance().data.showRowsPerPageFilter)
            && Template.instance().data.showRowsPerPageFilter) {

            throw new Meteor.Error('bedorn:reactiveDataTable error: showRowsPerPage is not an instance of boolean');
        }

        return _.isBoolean(Template.instance().data.showRowsPerPageFilter)
            ? Template.instance().data.showRowsPerPageFilter
            : true;
    },
    searchFields() {
        if (!_.isArray(Template.instance().data.searchFields)
            && Template.instance().data.searchFields) {

            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFields is not an instance of array');
        }

        if (Template.instance().data.searchFields
            && Template.instance().data.searchFields.length === 0) {
            throw new Meteor.Error('bedorn:reactiveDataTable error: searchFields instance (array) is empty');
        }

        return Template.instance().data.searchFields;
    }
});
