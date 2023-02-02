import React, { useEffect, useState } from 'react';
import './App.css';
import FileUploader from './FileUploader';
import ListUploads from './ListUploads';
import Web3 from 'web3';
import FileStorage from './abis/FileStorage.json';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

const App = () => {
	const [account, setAccount] = useState('');
	const [contract, setContract] = useState(null);
	const [totalSupply, setTotalSupply] = useState(0);
	const [files, setFiles] = useState([{}]);
	const loadWeb3 = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Considera usar Metamask!');
		}
	};

	const loadBlockchainData = async () => {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);

		const networkData = FileStorage.networks[5777];

		if (networkData) {
			const abi = FileStorage.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);
			setContract(contract);

			const totalSupply = await contract.methods.totalSupply().call();
			setTotalSupply(totalSupply);

			// Get all files in contract
			const files = await contract.methods.getFiles().call();
			setFiles(files);
			setTotalSupply(files.length);
		} else {
			window.alert('Contrato no desplegado en la red');
		}
	};

	useEffect(() => {
		loadWeb3();
		loadBlockchainData();
	}, []);

	const navItems = [
		{ name: 'List', to: '/' },
		{ name: 'Upload', to: '/upload' },
	];

	return (
		<BrowserRouter>
			<div className='App'>
				<AppBar component='nav' color='inherit'>
					<Toolbar>
						<Typography
							variant='h6'
							component='div'
							sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
							Storj - File storage
						</Typography>
						<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
							{navItems.map((item) => (
								<Link to={item.to} style={{ textDecoration: 'none' }}>
									<Button key={item.name} sx={{ color: '#000' }}>
										{item.name}
									</Button>
								</Link>
							))}
						</Box>
					</Toolbar>
				</AppBar>
				<div className='App-header'>
					<Routes>
						<Route
							path='/upload'
							element={<FileUploader contract={contract} account={account} />}
						/>
						<Route
							path='/'
							element={
								<ListUploads
									files={files}
									contract={contract}
									account={account}
								/>
							}
						/>
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
