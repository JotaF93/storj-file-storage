import { ObjectList } from 'aws-sdk/clients/s3';
import { useState } from 'react';
import { generateUrl, listUploads } from './helper';

function ListUploads({ contract, account }: any) {
	const [loadedFiles, setLoadedFiles] = useState<ObjectList | undefined>([]);
	const [accountFiles, setAccountFiles] = useState([]);

	const handleOnClick = async () => {
		const elementList = await listUploads();
		setLoadedFiles(elementList);
	};

	const handleOnClickAccount = async () => {
		if (account) {
			const loadedAccountFiles = await contract.methods
				.retrieveByAddress(account)
				.call();
			setAccountFiles(loadedAccountFiles);
		}
	};

	const RenderWeb3StorageList = () => (
		<ul
			style={{
				listStyleType: 'none',
				textAlign: 'left',
				margin: 0,
				padding: 0,
			}}>
			{loadedFiles?.map((item, index) => {
				return (
					<li key={item.Key}>
						<p style={{ fontSize: 12, overflow: 'hidden' }}>
							<b>File {index + 1}:</b>
							<br />
							ID:{' '}
							<a style={{ color: 'white' }} href={generateUrl(item.Key || '')}>
								{item.Key}
							</a>
							.
							<br />
						</p>
					</li>
				);
			})}
		</ul>
	);

	const RenderContractFileList = () => (
		<ul
			style={{
				listStyleType: 'none',
				textAlign: 'left',
				margin: 0,
				padding: 0,
			}}>
			{accountFiles.map((item: any, index: number) => {
				return (
					<li key={item}>
						<p style={{ fontSize: 12 }}>
							<b>File {index + 1}:</b>
							<br />
							ID:{' '}
							<a style={{ color: 'white' }} href={generateUrl(item || '')}>
								{item}
							</a>
							<br />
						</p>
					</li>
				);
			})}
		</ul>
	);

	return (
		<div style={{ display: 'flex' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					border: 'solid',
					borderColor: 'white',
					borderRadius: 15,
					borderWidth: 1,
					paddingRight: 10,
					paddingLeft: 10,
					paddingBottom: 10,
					margin: 10,
					width: '500px',
				}}>
				<p style={{ fontSize: 18 }}>List all uploaded files from storj</p>

				{loadedFiles !== undefined && loadedFiles.length > 0 ? (
					<RenderWeb3StorageList />
				) : (
					''
				)}

				<button onClick={handleOnClick}>List Files</button>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					border: 'solid',
					borderColor: 'white',
					borderRadius: 15,
					borderWidth: 1,
					paddingRight: 10,
					paddingLeft: 10,
					paddingBottom: 10,
					margin: 10,
					width: '500px',
				}}>
				<p style={{ fontSize: 18 }}>List Account Files From Contract</p>

				{accountFiles.length > 0 ? <RenderContractFileList /> : ''}

				<button onClick={handleOnClickAccount}>List Files</button>
			</div>
		</div>
	);
}

export default ListUploads;
