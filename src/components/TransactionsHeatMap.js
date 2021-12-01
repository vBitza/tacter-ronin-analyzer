import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles';
import { withStyles } from '@mui/styles';
import * as d3 from 'd3';
import drawChart from '../helpers/chart';
import CircularProgress from '@mui/material/CircularProgress';

function TransactionsHeatMap(props) {
	const {
		data,
		setCurrentData,
	} = props;

	const [renderedGraph, setRenderedGraph] = useState('');
	const chartRef = useRef(null);
	const [chartSvg, setChartSvg] = useState(null);
	const [isChartReady, setIsChartReady] = useState(false);

	const width = 740;
	const height = 440;

	useEffect(() => {
		const drawChartSvg = drawChart(data, width, height, setCurrentData);
		setChartSvg(drawChartSvg);

		if (chartRef.current.children[0]) {
			chartRef.current.children[0].remove();
			chartRef.current.appendChild(drawChartSvg);
		} else {
			chartRef.current.appendChild(drawChartSvg);
		}
	}, [])
	// const setChartSvg = () => {

	// }

  function replaceNode(svg) {
  	let a = document.querySelectorAll('.chart')[0];
  	// document.querySelectorAll('.chart')[0].appendChild(svg.node());
  }

	return (
		<React.Fragment>
			{
				isChartReady
					? <CircularProgress/>
					:	<div
				   	className='chart'
				   	ref={chartRef}
				   	style={{
				   		margin: '20px 0px',
				   		width: '100%',
				   		height,
				   		display: 'flex',
				   		alignItems: 'center',
				   	}}
			   	/>
			}
		</React.Fragment>
	)
};

export default withStyles(styles)(TransactionsHeatMap);
