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
            marker.deactivate(); 
        });

        let markerContainers = [...document.querySelectorAll('.marker-container')];
        markerContainers.forEach((container, i) => {
            // add click to navigate to that page
            container.addEventListener('click', () => this.jumpToPage(i));
        })

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
        let nav = document.createElement('nav');
        let ol = document.createElement('ol');
        
        nav.appendChild(ol);
        let pages = [...document.querySelectorAll('.sc-page')];

        // for each page, create a marker and progress bar combo
        pages.forEach((page, i) => {
            let pageName = page.getAttribute('data-page-name');
            let barContainer = document.createElement('li');

            let markerContainer = document.createElement('div');
            markerContainer.classList.add('marker-container');

            let progressMarker = document.createElement('div');
            progressMarker.classList.add('progress-marker');
            markerContainer.appendChild(progressMarker);

            let progressMarkerLabel = document.createElement('p');
            progressMarkerLabel.classList.add('marker-label');
            progressMarkerLabel.innerText = pageName;
            markerContainer.appendChild(progressMarkerLabel);
            barContainer.appendChild(markerContainer);

            if (i < pages.length - 1) {
                let progressBarContainer = document.createElement('div');
                progressBarContainer.classList.add('progress-container')
                let progressBar = document.createElement('div');
                progressBar.classList.add('progress-bar');
                progressBarContainer.appendChild(progressBar);
                barContainer.appendChild(progressBarContainer);
            }

            ol.appendChild(barContainer);
        });
        let header = document.querySelector('#header');
        header.appendChild(nav);
        console.log(header)
    },
}
