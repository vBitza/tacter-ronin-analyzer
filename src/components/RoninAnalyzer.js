import React from 'react';
import axios from 'axios';
import styles from '../styles';
import { withStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import ManagerWalletInput from './ManagerWalletInput';
import ScholarWalletInput from './ScholarWalletInput';
import SearchBarHeader from './SearchBarHeader';
import SearchButton from './SearchButton';
import TransactionsHeatMap from './TransactionsHeatMap';

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
	const [data, setData] = useState([]);
	const [currentData, setCurrentData] = useState([]);
	console.log(currentData)
	const verifyScholarAddress = (scholarAddress) => {
		if (scholarAddress.length !== 42 && scholarAddress.length !== 46) {
			setAddressValidationError(false);
			return;
		}
		const address = scholarAddress.includes('ronin:') ? scholarAddress.replace('ronin:', '0x') : scholarAddress;
		const explorerApi = `https://explorer.roninchain.com/api/address/${address}`

		axios.get(explorerApi).then(async (response) => {
			if (response && response.status === 200) {
				loadWalletInfo(address);
				setIsAddressVerified(true);
				setIsLoading(true);
			}
		}).catch((error) => {
			setAddressValidationError(false);
		});
	}

	const loadWalletInfo = (address) => {
		const walletDataApi = `https://explorer.roninchain.com/api/tokentxs?addr=${address}&from=0&size=100&token=ERC20`

		axios.get(walletDataApi).then(async (response) => {
			const transactions = response.data;
			const tMap = {};

			for (let item of transactions.results) {
				if (item.token_symbol !== 'SLP') {
					continue;
				}

				if (item.from === address) {
					continue;
				}

				if (!tMap[item.from]) {
					tMap[item.from] = {
						name: item.from,
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

			console.log(tMap)
			const transactionsMap = {
				name: 'transactions',
				children: [...Object.values(tMap)],
			}

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

				{
					scholarAddress
					&& scholarAddress.length
					&& isAddressVerified
					&& <ManagerWalletInput
						managerAddress={managerAddress}
						setManagerAddress={setManagerAddress}
					/>
				}
				{
					!isAddressVerified
					&& <SearchButton
						verifyScholarAddress={verifyScholarAddress}
						scholarAddress={scholarAddress}
					/>
				}
				{
					data
					&& data.children
					&& <TransactionsHeatMap
						setCurrentData={setCurrentData}
						data={data}
					/>
				}
			</div>
		</React.Fragment>
	);
}

export default withStyles(styles)(RoninAnalyzer);
