# "no DOM is an iland"

## TODO
1. Remove that flavour bit and do everything in options... hanami, etc.
1. remove openshift stuff

### Service
Service that responds with JSON of `nodes + data + x,y` and `edges + data` for:

- Route that gets url from POST data, knows the type of JSON expected, returns JSON 
  - module dom2Graph (run if possible, get x,y) and cache response.
    - module dom2Json for sigma
      - sigma.js in node 
    - module dom2Json for ngraph
      - ngraph in node
    - module dom2Json for d3
      - d3 in node
    - module dom2Json ...
      - ... in node
      - 
Try to make as little deviation as possible, extra data is ok. Test schemas with extra data also work with simpler ones.

The service will compute the x,y in the server so we can take advantage of just adding the nodes in the client, with simple physics.
A 3d island visualisation only needs the x,y as it would be coming up fro mwater
Also will lru-cache the results for a while.

The client can then use:
- view layer of any visualisation
- themes per view layer

The service can then be called by something like Unity

### Roadmap
- [x] Move to service architecture - v1
- [x] Make test pages (Currently if the service has no connectivity to the net, it will load a hardcoded tsouk.com JSON response)
- [x] Implement simple 3d ngraph approach
- [x] Implement 2d ngraph
- [x] island implementation v1
- [ ] Remove that flavour stuff
- [ ] 3d Hanami for Hanami season...
- [ ] Look into cytoscape
- [ ] Upgrade to Node9
- [ ] Lodash is now in ilandom, maybe should be only in ngraph.three 
- [ ] Move ngraph.pixel in the node_modules instead. BUT bundles can be made outside
- [ ] ADD SOUND!
- [ ] ALPHA SHAPES: https://github.com/mikolalysenko/alpha-shape

- [ ] Redoing the surface:
  -  Circular shapes (or turrets): These are created when too many children form unilateraly around the parent. The ideal solution would be in the layout algorithm (1). The next solution would be affecting the heights. A `MAX_CHILDREN_PER_NODE` parameter is used to alleviate the problem now. This is not ideal because some of these children hold most of the rest of the website. So a first pass that gets information from the DOM is important. Should reconsider cheerio here to figure out a better data object to begin with, or add info to the nodes.

- [ ] a non linear height function might work better.
- [ ] For any node with no children, should add seanodes based on it's (maxDepth - depth), to make the form more rounded.
- [ ] the leftover nodes of mountains are layout3d ngraph clouds.
- [ ] the mountain will slowly grow
- [ ] snow/weather coming off
- [ ] island implementation v2

- [ ] a nurbs / plane geometry version
- [ ] a mortphNormals non-buffer Geometry version 