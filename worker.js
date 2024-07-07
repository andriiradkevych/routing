const fetchPageByRoute = async (path) => {
  return await fetch(path).then(res => res.text())
}


self.onmessage = async function(e) {
    const {routes, defaultPath} = e.data;

    const defaultPage = await fetchPageByRoute(routes[defaultPath]);

    self.postMessage({
      defaultPage
    });  

    const all = await Promise.all(Object.keys(routes).map(async route => {
      return {
        route,
        html: await fetchPageByRoute(routes[route])
      };
    }));
    
    const response = all.reduce((prev, next) => {
      return {
        ...prev,
        [next.route]: next.html
      }
    }, {})

    self.postMessage({
      routes: response
    });    
}