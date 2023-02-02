import { s3 } from './s3.config';



export const listUploads = async () => {
	const params = {
		Bucket: process.env.REACT_APP_BUCKET || '',
		Delimiter: '',
		EncodingType: 'url',
		MaxKeys: 1000,
		Prefix: '',
	};
	
	const { Contents } = await s3.listObjects(params).promise();
	return Contents;
}

export async function mint(contract: any, account: string, file: File) {

	const fileKey = generateKeyString(file, account);


	contract.methods
		.mint(fileKey)
		.send({ from: account })
		.once('confirmation', () => {
			storeFiles(file, account);
		});
}

	const storeFiles = async (file: File, account: string) => {

		const params = {
			Bucket: process.env.REACT_APP_BUCKET || '',
			Key: generateKeyString(file, account),
			Body: file,
		};

		await s3
			.upload(params, {
				partSize: 64 * 1024 * 1024,
			})
			.promise();
		console.log('success');
	};

export function generateUrl(key: string) {
	const params = {
		Bucket: process.env.REACT_APP_BUCKET,
		Key: key,
	};
	const url = s3.getSignedUrl('getObject', params);

	return url;
}

//Remove spaces from string
export function removeSpaces(string: string) {
	return string.replace(/\s/g, '');
};

//Generate  Key String
export function generateKeyString(file: File, account: string) {
	return `${account}_${file.size}_${removeSpaces(file.name)}`;
}
