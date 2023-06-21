import './styles/styles.css';

export const Bar = {

    name: 'sc-progress-bar',
    progressMarkers: [],
    progressBars: [],
    currentPage: 0,
    sectionHeights: [],
    initialized: false,
    activate: {},
    deactivate: {},
    jumpToPage: {},

    init: function (staticData) {
        let {sectionHeights, currentPage, activate, deactivate, jumpToPage} = staticData;
        this.currentPage = currentPage;
        this.sectionHeights = sectionHeights;
        this.activate = activate;
        this.deactivate = deactivate;
        this.jumpToPage = jumpToPage;

        this.buildProgressBar();
        this.progressBars = this.initProgressBar();
        this.progressMarkers = this.initProgressMarkers(currentPage);
    },

    handleScroll: function(scrolledPage, scrollProgress) {

        // set the scroll bar height
        let scrollBar = document.querySelector(`[data-bar="${this.currentPage}"]`);
        if (scrollBar != null) scrollBar.style.height = scrollProgress + '%';

        // if we are going back a page
        if (scrolledPage < this.currentPage) {
            // set the active progress bar to 0
            if (scrollBar != null) document.querySelector(`[data-bar="${this.currentPage}"]`).style.height = '0px';
            // turn off the next progress marker 
            this.progressMarkers[this.currentPage].deactivate();
        } 

        // set the new page's marker as current
        this.progressMarkers[scrolledPage].activate();
        
        // set the current page
        this.currentPage = scrolledPage;

        // initialization operations are here bc window.scrollY does not have a value until scroll event listener is fired
        if (this.initialized) return;

        // initialize progress bars based on current page 
        this.progressBars.forEach((progressBar, i) => {
            // init scroll bar progress to be fully filled
            let barScrollProgress = 100;

            // if we havent reached this page, don't fill in the bar
            if (i > this.currentPage) return;

            // if user is on the current page, init the progress bar to be how far down the page the user is
            if (i == this.currentPage) barScrollProgress = scrollProgress;
            progressBar.style.height = scrollProgress + '%';
        });

        // initialize progress markers based on current page 
        this.progressMarkers.forEach((marker, i) => {
            if (i > this.currentPage) return;
            marker.activate();
        });

        // activate the current page progress marker
        this.progressMarkers[this.currentPage].activate();
        this.initialized = true;
    },

    initProgressMarkers: function (currentPage) {
        let progressMarkers = [...document.querySelectorAll('.progress-marker')];
        progressMarkers.forEach((marker, i) => {

            // set activate and deactivate functions
            marker.activate = () => this.activate(marker);
            marker.deactivate = () => this.deactivate(marker);
            marker.addEventListener('click', () => this.jumpToPage(i));
            marker.deactivate(); 
        });

        progressMarkers[currentPage].activate();
        return progressMarkers;
    },

    initProgressBar: function () {
        // get all progress bars
        let progressBars = [...document.querySelectorAll('.progress-bar')];
    
        // set up each bar
        progressBars.forEach((progressBar, i) => {
            // set the bar number
            progressBar.setAttribute('data-bar', i);
            progressBar.style.height = '0%';
        });

        return progressBars;
    },

    buildProgressBar: function () {
        // build and attach the progress bars and markers to html
        let header = document.querySelector('#header')
        let barTemplate = document.querySelector('template#progress-bar');
        let markerTemplate = document.querySelector('template#progress-marker');
        let pages = [...document.querySelectorAll('.sc-page')];

        // for each page, create a marker and progress bar combo
        pages.forEach((page, i) => {
            let pageName = page.getAttribute('data-page-name');
            let markerClone = markerTemplate.content.firstElementChild.cloneNode(true);
            markerClone.innerText = pageName;
            header.appendChild(markerClone);

            // do not create a bar for the last page
            if (i < pages.length - 1) {
                let barClone = barTemplate.content.firstElementChild.cloneNode(true);
                header.appendChild(barClone);
            }
        });
    },
}