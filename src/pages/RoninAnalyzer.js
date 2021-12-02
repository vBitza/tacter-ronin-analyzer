import React from 'react';
import axios from 'axios';
import styles from '../styles';
import { withStyles } from '@mui/styles';
import {
	TextField,
	Typography,
	Box,
	SvgIcon,
	CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import ManagerWalletInput from '../components/ManagerWalletInput';
import ScholarWalletInput from '../components/ScholarWalletInput';
import SearchBarHeader from '../components/SearchBarHeader';
import SearchButton from '../components/SearchButton';
import TransactionsHeatMap from '../components/TransactionsHeatMap';
import TransactionTable from '../components/TransactionsTable';
import { ReactComponent as SlpIcon } from '../assets/slp.svg';

const placeHolder = theme => ({
  input: {
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: "blue",
      fontSize: 14
    }
  }
});

function RoninAnalyzer (props) {
	const { classes } = props;
	const [addressValidationError, setAddressValidationError] = useState(false);
	const [scholarAddress, setScholarAddress] = useState('');
	const [managerAddress, setManagerAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isAddressVerified, setIsAddressVerified] = useState(false);
	const [currentData, setCurrentData] = useState([]);
	const [data, setData] = useState([]);

	useEffect(() => {
		console.log(managerAddress)
		setManagerAddress(managerAddress);
	}, [managerAddress]);

	const verifyScholarAddress = (scholarAddress) => {
		if (scholarAddress.length !== 42 && scholarAddress.length !== 46) {
			setAddressValidationError(true);
			return;
		}

		const address = scholarAddress.includes('ronin:') ? scholarAddress.replace('ronin:', '0x') : scholarAddress;
		const explorerApi = `https://explorer.roninchain.com/api/address/${address}`

		axios.get(explorerApi).then(async (response) => {
			if (response && response.status === 200) {
				loadWalletInfo(address);
				setAddressValidationError(false);
				setIsAddressVerified(true);
				setIsLoading(true);
			}
		}).catch((error) => {
			setAddressValidationError(false);
		});
	};

	const loadWalletInfo = (address) => {
		const walletDataApi = `https://explorer.roninchain.com/api/tokentxs?addr=${address}&from=0&size=100&token=ERC20`

		axios.get(walletDataApi).then(async (response) => {
			const transactions = response.data.results.map((item) => ({
				...item,
				shortName: item.from.substring(0, 7) + '...' + item.from.substring(item.from.length - 5, item.from.length),
				shortTo: item.to.substring(0, 7) + '...' + item.to.substring(item.to.length - 5, item.to.length),
			}));
			const tMap = {};

			for (let item of transactions) {
				if (item.token_symbol !== 'SLP') {
					continue;
				}

				if (item.from === address) {
					continue;
				}

				if (!tMap[item.from]) {
					tMap[item.from] = {
						name: item.from,
						shortName: item.shortName,
						children: [],
						value: 0,
					}
				}

				switch (item.from) {
					case '0x0000000000000000000000000000000000000000':
						item.name = 'Ronin Claim';
						tMap[item.from].name = 'Ronin Claim';
						break;
					default:
						item.name = item.from;
				}

				tMap[item.from].children.push(item);
				tMap[item.from].value += Number(item.value);
			}

			const transactionsMap = {
				name: 'transactions',
				children: [...Object.values(tMap)],
			}

			setCurrentData(transactionsMap.children);
			setData(transactionsMap);
		});
	};

	return (
		<React.Fragment>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					padding: '0px',
					width: '816px',
					minHeight: '104px',
					position: 'static',
					left: '24px',
					top: '24px',
				}}
			>
				<SearchBarHeader/>

				<ScholarWalletInput
					scholarAddress={scholarAddress}
					addressValidationError={addressValidationError}
					setScholarAddress={setScholarAddress}
				/>

				{/*{
					scholarAddress
					&& scholarAddress.length
					&& isAddressVerified
					&& <ManagerWalletInput
						managerAddress={managerAddress}
						setManagerAddress={setManagerAddress}
					/>
				}*/}
{/*				<ManagerWalletInput
						managerAddress={managerAddress}
						setManagerAddress={setManagerAddress}
					/>*/}
				{
					!isAddressVerified
					&& <SearchButton
						verifyScholarAddress={verifyScholarAddress}
						scholarAddress={scholarAddress}
					/>
				}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%'
					}}
				>
				{
					isLoading && <div
						style={{
							width: '100%',
							marginTop: '10px',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<CircularProgress/>
					</div>
				}
				{
					data
					&& data.children
					&& <Box
            sx={{
            	marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px',
              width: '100%',
              background: '#151719',
              border: '1px solid #565D64',
              boxSizing: 'border-box',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
            }}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignSelf: 'start',
							}}
						>
							<SvgIcon>
								<SlpIcon/>
							</SvgIcon>
							<Typography
								style={{
									marginLeft: '2px',
									marginBottom: '20px',
									color: 'white',
									alignSelf: 'start',
									fontSize: '23.5px',
									lineHeight: '32px',
								}}
							>
								Transfers received
							</Typography>
						</div>
						<TransactionsHeatMap
							key={managerAddress}
							managerAddress={managerAddress}
							setCurrentData={setCurrentData}
							data={data}
							changeLoaderState={setIsLoading}
						/>
						<TransactionTable
							tableData={currentData}
						/>
					</Box>
				}
				</div>
			</div>
		</React.Fragment>
	);
}

export default withStyles(styles)(RoninAnalyzer);
