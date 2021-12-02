import React from 'react';
import {
	TextField,
	Typography,
} from '@mui/material';
import styles from '../styles';
import { withStyles } from '@mui/styles';

function ManagerWalletInput(props) {
	const {
		addressValidationError,
		setManagerAddress,
		classes,
		scholarAddress,
	} = props;

	return (

		<React.Fragment>
			<Typography
				className={classes.secondaryText}
			>
				Optional - Add your ronin address to highlight your transfers to this scholar.
			</Typography>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					padding: '0px',
					width: '816px',
					height: '44px',
					left: '0px',
					top: '64px',
					flex: 'none',
					alignSelf: 'stretch',
					margin: '16px 0px'
				}}
			>
				<Typography
					style={{
						width: '100px',
						size: '15px',
						lineHeight: '20.46px',
						letter: '0.37px',
						marginTop: '6px',
					}}
					className={classes.primaryText}
				>
					👑 Manager
				</Typography>
				<TextField
					error={addressValidationError}
					id='standard-error-helper-text'
					helperText={addressValidationError ? 'Invalid address': ''}
					value={scholarAddress}
					className={classes.root}
					inputProps={{
						style: {
							color: 'white',
							width: '80%',
							padding: '2px',
							marginLeft: '2px',
						}
					}}
					onChange={(e) => setManagerAddress(e.target.value)}
					style={{
						background: '#151719',
						width: '80%',
						height: '20px',
						left: '12px',
						fontWeight: 'bold',
						fontSize: "15px",
						lineHeight: '20px',
						letterSpacing: '0.374px',
						margin: '0px 16px',
						padding: '12px 4px',
					}}
					placeholder={'Ex: ronin:4b73609c29159effe89fa45fd57c22b4cf9d0e1f'}
				  variant='filled'
				/>
			</div>
		</React.Fragment>
	)
};

export default withStyles(styles)(ManagerWalletInput);
