import React from 'react';
import {
	TextField,
	Typography,
	SvgIcon,
} from '@mui/material';
import styles from '../styles';
import { withStyles } from '@mui/styles';
import {ReactComponent as RoninIcon} from '../assets/ronin.svg';

function SearchBarHeader(props) {
	const {classes} = props;

	return (
		<div
			className="search-header"
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				padding: '0px',
				position: 'static',
				width: '700px',
				height: '44px',
				left: '0px',
				top: '0px',
				flex: 'none',
				order: 0,
				flexGrow: 0,
				margin: '16px 0px',
			}}
		>
			<SvgIcon
				style={{
					position: 'static',
					width: '32px',
					height: '32px',
					left: '0px',
					top: '6px',
					flex: 'none',
					order: 0,
					flexGrow: 0,
					margin: '0px 8px',
				}}
			>
				<RoninIcon/>
			</SvgIcon>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					padding: '0px',
					width: '616px',
					height: '44px',
					flex: 'none',
					order: 1,
					flexGrow: 1,
					margin: '0px 8px'
				}}
			>
				<Typography
					style={{
						height: '20px',
						size: '15px',
						lineHeight: '20.43px',
						letter: '0.37px',
					}}
					className={classes.primaryText}
				>
					Track your scholar’s transfers
				</Typography>

				<Typography
					style={{
						height: '16px',
						size: '12px',
						lineHeight: '16.34px',
					}}
					className={classes.secondaryText}
				>
					Add your scholar's ronin address to check if the account is suspicious of multi-accounting.
				</Typography>
			</div>
		</div>
	);
};

export default withStyles(styles)(SearchBarHeader);
