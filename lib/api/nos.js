module.exports = {
  metadata: {
    serviceAbbreviation: 'NOS',
    serviceFullName: 'Netease Object Storage'
  },
  operations: {

    PutObject: {
      http: {
        method: 'PUT',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}',
        _signature: '/${Bucket}/${Key}'
      },
      input: {
        _required: [
          'Bucket',
          'Key'
        ],
        members: {
          Body: {
            type: 'blob',
            streaming: true,
            shape: 'Payload'
          },
          Bucket: {
            location: 'uri',
            locationName: 'Bucket'
          },
          ContentLength: {
            type: 'integer',
            location: 'header',
            locationName: 'Content-Length'
          },
          ContentMD5: {
            location: 'header',
            locationName: 'Content-MD5'
          },
          ContentType: {
            location: 'header',
            locationName: 'Content-Type'
          },
          Key: {
            location: 'uri',
            locationName: 'Key'
          },
          StorageClass: {
            location: 'header',
            locationName: 'x-nos-storage-class'
          }
        },
        payload: 'Body'
      }
    }

  }
};
