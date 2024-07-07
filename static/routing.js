window.RouterWorker = {
    routeNode: null,
    routes: {},
    getPath: function(href) {
        return href.replace(location.origin, "")
    },
    pageRender: function (page){
        this.routeNode.innerHTML = page;
    },
    moveToPath: function(path) { 
        history.pushState({}, "", path);
    },
    initialize: function (routes, routeNode) {
        const routerWorker = new Worker('worker.js');

        let self = this;
        self.routeNode = routeNode;

        routerWorker.onmessage = function (event) {
            const {defaultPage, routes} = event.data;

            if (defaultPage) {
                self.pageRender(defaultPage);
            }else {
                self.routes = {
                    ...self.routes,
                    ...routes
                };
            }
        };
        routerWorker.onerror = function(e) {
            console.error('Error from worker: ', e);
        };

        routerWorker.postMessage({defaultPath: this.getPath(location.href), routes});
    },
    hrefClick: function (event){
        const {href}= event.target;

        const path = this.getPath(href);
        
        this.moveToPath(path);
        this.pageRender(this.routes[path]);

        event.preventDefault();
    }
}