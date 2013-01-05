/*jslint browser: true, white: true, passfail: false*/
/*global jQuery, $*/

/**
 * jQuery Pager : a client-side jQuery pager plugin
 *
 * @author Peter Bakondy <pbakondy@gmail.com>
 * @version 1.0
 * @extends {jQuery}
 */
(function($){
    "use strict";

    $.pager = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        base.init = function(){
            base.options = $.extend({}, $.pager.defaultOptions, options);

            // current visible page
            base.currentPage = document.location.hash && !isNaN(parseInt(document.location.hash.substr(1), 10)) ? parseInt(document.location.hash.substr(1), 10) : 1;

            // items
            base.items = base.$el.find(base.options.itemSelector);
            base.itemCount = base.items.length;

            // sum pages
            base.pageCount = Math.ceil(base.itemCount / base.options.itemsPerPage);

            if (base.currentPage > base.pageCount) {
                base.currentPage = base.pageCount;
                document.location.hash = base.pageCount;
            }

            // need pager
            base.pagerDisplay = (base.itemCount > base.options.itemsPerPage);

            // is enough space form long (prev/next) buttons?
            base.longButton = (base.pageCount <= base.options.longButtonTreshold);

            base.prevPageAlt = base.options.prevPageLabel;
            base.nextPageAlt = base.options.nextPageLabel;
            base.prevPageText = base.longButton ? base.prevPageAlt : base.options.prevPageShort;
            base.nextPageText = base.longButton ? base.nextPageAlt : base.options.nextPageShort;

            base.pagerHtml = '';

            if (base.pagerDisplay) {
                // set items visibility by displayed page
                base.setItemVisibility();

                if (base.options.firstPageItemClass) {
                    base.$el.find(base.options.itemSelector + ':nth-child(' + base.options.itemsPerPage + 'n+1)').addClass(base.options.firstPageItemClass);
                }
                if (base.options.lastPageItemClass) {
                    base.$el.find(base.options.itemSelector + ':nth-child(' + base.options.itemsPerPage + 'n)').addClass(base.options.lastPageItemClass);
                }

                base.pagerHtml += '<ul class="pager">';
                base.pagerHtml += base.prevButton();
                base.pagerHtml += base.pagerStart();
                base.pagerHtml += base.pagerMiddle();
                base.pagerHtml += base.pagerEnd();
                base.pagerHtml += base.nextButton();
                base.pagerHtml += '</ul>';

                base.$el.append(base.pagerHtml);

                base.$el.find('.pager').delegate('a', 'click', base.pagerClick);

            }

        };

        base.setItemVisibility = function(){
            var i;
            for (i = 0; i < base.itemCount; i += 1) {
                if (i < (base.currentPage - 1) * base.options.itemsPerPage) {
                    base.items.eq(i).hide();
                }
                if ((i >= (base.currentPage - 1) * base.options.itemsPerPage) && (i < base.currentPage * (base.options.itemsPerPage))) {
                    base.items.eq(i).show();
                }
                if (i >= base.currentPage * base.options.itemsPerPage) {
                    base.items.eq(i).hide();
                }
            }
        };

        base.prevButton = function(){
            var ret = '',
                href = Math.max(1, base.currentPage - 1);

            ret += base.longButton ? '<li class="prev">' : '<li class="prev short">';
            if (base.currentPage > 1) {
                ret += '<a href="#' + href + '" title="' + base.prevPageAlt + '">' + base.prevPageText + '</a>';
            }
            ret += '</li>';
            return ret;
        };

        base.nextButton = function(){
            var ret = '',
                href = Math.min(base.pageCount, base.currentPage + 1);

            ret += base.longButton ? '<li class="next">' : '<li class="next short">';
            if (base.currentPage < base.pageCount) {
                ret += '<a href="#' + href + '" title="' + base.nextPageAlt + '">' + base.nextPageText + '</a>';
            }
            ret += '</li>';
            return ret;
        };

        base.pagerStart = function(){
            var ret = '',
                activeFirst = base.currentPage === 1 ? ' class="active"' : '';

            ret += '<li' + activeFirst + '><a href="#1">1</a></li>';
            if (!base.longButton && base.currentPage - base.options.visiblePageSiblings > 2) {
                ret += '<li class="empty"><span>...</span></li>';
            }

            return ret;
        };

        base.pagerEnd = function(){
            var ret = '',
                activeLast = base.currentPage === base.pageCount ? ' class="active"' : '';

            if (!base.longButton && base.currentPage + base.options.visiblePageSiblings < base.pageCount - 1) {
                ret += '<li class="empty"><span>...</span></li>';
            }
            ret += '<li' + activeLast + '><a href="#' + base.pageCount + '">' + base.pageCount + '</a></li>';


            return ret;
        };

        base.pagerMiddle = function(){
            var ret = '',
                startPage = 2,
                endPage = base.pageCount - 1,
                i, activePage;

            if (base.options.longButtonTreshold < base.pageCount) {
                startPage = Math.max(2, base.currentPage - base.options.visiblePageSiblings);
                endPage = Math.min(base.pageCount - 1, base.currentPage + base.options.visiblePageSiblings);
            }

            for (i = startPage; i <= endPage; i += 1) {
                activePage = base.currentPage === i ? ' class="active"' : '';
                ret += '<li' + activePage + '><a href="#' + i + '">' + i + '</a></li>';
            }

            return ret;
        };

        base.pagerClick = function(e){
            e.preventDefault();
            base.$el.find('ul.pager').remove();
            document.location.hash = $(this).attr('href').substr(1);
            base.init();
        };

        // Run initializer
        base.init();
    };

    $.pager.defaultOptions = {
        prevPageLabel: "Previous page",
        nextPageLabel: "Next page",
        prevPageShort: "«",
        nextPageShort: "»",
        itemSelector: '.item',
        firstPageItemClass: 'first',
        lastPageItemClass: 'last',
        itemsPerPage: 10,
        longButtonTreshold: 8,
        visiblePageSiblings: 3
    };

    $.fn.pager = function(options){
        return this.each(function(){
            if (!$.data(this, 'pager')) {
                $.data(this, 'pager', $.pager(this, options));
            }
        });
    };

}(jQuery));