import React from 'react';
import {
	TextField,
	Typography,
	SvgIcon,
	Button,
} from '@mui/material';
import styles from '../styles';
import { withStyles } from '@mui/styles';
import {ReactComponent as SearchIcon} from '../assets/search.svg';

function SearchButton(props) {
	const {
		verifyScholarAddress,
		scholarAddress
	} = props;

	return (
		<Button
	 	  style={{
	 	  	padding: '12px 12px',
	 	  	top: '0px',
	 	  	width: '200px',
	 	  	height: '46px',
	 	  	background: '#C79E57',
	 	  	borderRadius: '8px',
	 	  	flex: 'none',
	 	  	order: 1,
	 	  	alignSelf: 'end',
	 		}}
		 variant="contained"
		 onClick={() => verifyScholarAddress(scholarAddress)}
	  >
			<SvgIcon>
				<SearchIcon/>
			</SvgIcon>
			<Typography
				noWrap={true}
				style={{
					display: 'inline',
					color: '#000000',
					size: '15px',
					lineHeight: '20.46px',
					letter: '0.37px',
				}}
			>
				Search transfers
			</Typography>
	  </Button>
	);
};

export default withStyles(styles)(SearchButton);
