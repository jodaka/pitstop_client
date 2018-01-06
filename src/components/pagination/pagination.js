class Pagination {
    constructor (AppConfig) {
        this.perPage = AppConfig.pagination.perPage;
    }

    $onChanges () {
        this.calculateVisiblePages();
    }

    changePage (page) {
        this.page = page;
        this.onChangePage({ page });
    }

    static isPageInRange (curPage, index, maxPages, pageBefore, pageAfter) {
        if (index <= 1) {
        // first 2 pages
            return true;
        }
        if (index >= maxPages - 2) {
        // last 2 pages
            return true;
        }
        if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
            return true;
        }

        return false;
    }

    render (curPage, items) {
        this.pages = [];
        let separatorAdded = false;

        items.forEach((item, idx) => {
            if (Pagination.isPageInRange(curPage, idx, this.pagesCount, 3, 2)) {
                this.pages.push(`${item}`);
                // as we added a page, we reset the separatorAdded
                separatorAdded = false;
            } else if (!separatorAdded) {
            // only add a separator when it wasn't added before
                this.pages.push('…');
                separatorAdded = true;
            }
        });
    }

    calculateVisiblePages () {
        const total = Number(this.itemsCount);
        this.pagesLimit = 10;
        this.pagesCount = Math.ceil(total / this.perPage);

        const pages = [];
        for (let i = 1; i <= this.pagesCount; i++) {
            pages.push(i);
        }

        this.render(this.page, pages, true);
    }
}

angular.module('k.components').component('pagination', {
    bindings: {
        itemsCount: '<',
        onChangePage: '&',
        page: '<'
    },
    templateUrl: 'partials/pagination/pagination.html',
    controller: ['AppConfig', Pagination]
});
