import S3 from 'aws-sdk/clients/s3';

export const s3 = new S3({
	accessKeyId: process.env.REACT_APP_ACCESS_KEY || '',
	secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY || '',
	endpoint: process.env.REACT_APP_STORJ_ENDPOINT || '',
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
	httpOptions: { timeout: 0 },
});
