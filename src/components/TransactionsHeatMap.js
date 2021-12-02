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
		managerAddress,
		changeLoaderState,
	} = props;

	const [renderedGraph, setRenderedGraph] = useState('');
	const chartRef = useRef(null);
	const [chartSvg, setChartSvg] = useState(null);
	const [isChartReady, setIsChartReady] = useState(false);

	const width = 740;
	const height = 440;

	useEffect(() => {
		const drawChartSvg = drawChart(data, managerAddress, width, height, setCurrentData);
		setChartSvg(drawChartSvg);
		changeLoaderState(false);

		if (chartRef.current.children[0]) {
			chartRef.current.children[0].remove();
			chartRef.current.appendChild(drawChartSvg);
		} else {
			chartRef.current.appendChild(drawChartSvg);
		}
	}, [data])

	return (
		<React.Fragment>
			{
				isChartReady
					? <CircularProgress/>
					:	<div
						key={managerAddress}
				   	className='chart'
				   	ref={chartRef}
				   	style={{
				   		marginTop: '10px',
				   		marginBottom: '40px',
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
