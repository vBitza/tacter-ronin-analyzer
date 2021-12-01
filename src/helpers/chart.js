import * as d3 from 'd3';
import uid from './uid';

function drawChart (data, width, height, setCurrentData) {
	const x = d3.scaleLinear().rangeRound([0, width]);
	const y = d3.scaleLinear().rangeRound([0, height]);

  // const colors = ["#FFFFFF", "#87CAFF"];
  // const colorRange = d3.scaleLinear.quantile().domain(colorDomain).range(colors);
  // const colorDomain = d3.extent(data.children.map((item) => {
    // return item.value / 10;
  // }));

  // const colorRange = d3.scaleLinear()
  //   .range(colors)
  //   .domain(colorDomain);
  // const colors = d3.interpolate('#87CAFF', '#C4D4E1');
  const total = data.children.reduce((acc, current) => acc+=current.value, 0);

  // const colors = d3.scaleSequential()
  //   .interpolator(d3.interpolateDiscrete(['#FFFFFF', '#87CAFF']))
    // .domain([1, 100]);
  var colors  = d3.scaleLinear().domain([1, total * 2])
    .range(['#C4D4E1', '#87CAFF']);

  // const colors = d3.interpolateDiscrete(['#FFFFFF', '#87CAFF'])
    // .domain([min, max])
    // .domain([1,10])

  const svg = d3.create("svg")
		.attr('viewBox', [0.5, -30.5, width, height])
		.style('font', '10px sans-serif')

	function tile(node, x0, y0, x1, y1) {
	  d3.treemapBinary(node, 0, 0, width, height);
	  for (const child of node.children) {
	    child.x0 = x0 + child.x0 / width * (x1 - x0);
	    child.x1 = x0 + child.x1 / width * (x1 - x0);
	    child.y0 = y0 + child.y0 / height * (y1 - y0);
	    child.y1 = y0 + child.y1 / height * (y1 - y0);
	  }
	}

	const treemap = (data) => d3.treemap()
    .tile(tile)(d3.hierarchy(data)
    .sum(d => {
      console.log(d)
      return d.value;
    })
    .sort((a, b) => b.value - a.value));

	const getName = (d) => d.ancestors().reverse().map(d => d.data.name).join("/");

  let group = svg.append('g')
  	.call(render, treemap(data));

  function position(group, root) {
    group.selectAll("g")
        .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
      .select("rect")
        .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
        .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = group = svg.append("g").call(render, d);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .call(position, d.parent))
        .call(t => group1.transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d));

    setCurrentData((d.children).map((item) => item.data));
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {

    const group0 = group.attr("pointer-events", "none");
    const group1 = group = svg.insert("g", "*").call(render, d.parent);

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d))
        .call(t => group1.transition(t)
          .call(position, d.parent));

    setCurrentData(d.parent.data.children);
  }

  function render(group, root) {
  	const format = d3.format(",d")
  	const node = group
  		.selectAll('g')
  		.data(root.children.concat(root))
  		.join('g')

  	node.filter(d => d === root ? d.parent : d.children)
      .attr("cursor", "pointer")
      .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

    node.append("title")
      .text(d => `${getName(d)}\n${format(d.value)} SLP\n${new Date(d.timestamp * 1000)}`);

    node.append("rect")
      .attr("id", d => (d.leafUid = uid("leaf")).id)
      .attr("fill", d => colors(d.value))
      .attr("stroke", "#fff");

    node.append("clipPath")
      .attr("id", d => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("xlink:href", d => d.leafUid.href);

    node.append("text")
      .attr("clip-path", d => d.clipUid)
      .attr("font-weight", d => d === root ? "bold" : null)
      .selectAll("tspan")
      .data(d => {
        // let total = d.children.reduce((acc, current) => acc += current.value, 0);
        // console.log(d);
        // For some reason the d3 mapping makes a weird sum for tiles that have childrens
        // It basically adds the total value of all childrens twice therefore
        // a quick fix was to divide the tiles based on childrens length
        // console.log(d)
        // if (d && d.children && d.children.every((item) => item.children && item.children.length !== 0)) {
        //   value = d.value / 2;
        // }
        let value = d.value;
        if (d && d.children && d.children.length !== 0) {
          value = d.value / 2;
        }

        return (d === root ? getName(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(`${format(value)} SLP`)
      })
      .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
      .text(d => d);

    group.call(position, root);
    // replaceNode(svg);
  }

  return svg.node();
};

export default drawChart;
