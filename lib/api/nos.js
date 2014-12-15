module.exports = {
  operations: {

    PutObject: {
      resourceType: 'Object',
      http: {
        method: 'PUT',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}'
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
    },

    InitiateMultipartUpload: {
      resourceType: 'Object',
      http: {
        method: 'POST',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}'
      },
      input: {
        _required: [
          'Bucket',
          'Key'
        ],
        members: {
          Bucket: {
            location: 'uri',
            locationName: 'Bucket'
          },
          ContentLength: {
            location: 'header',
            locationName: 'Content-Length'
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
          },
          Uploads: {
            type: 'boolean',
            location: 'query',
            locationName: 'uploads',
            defaultValue: true
          }
        }
      }
    },

    UploadPart: {
      resourceType: 'Object',
      http: {
        method: 'PUT',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}?partNumber=${PartNumber}&uploadId=${UploadId}'
      },
      input: {
        _required: [
          'Bucket',
          'Key',
          'PartNumber',
          'UploadId'
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
            location: 'header',
            locationName: 'Content-Length'
          },
          ContentMD5: {
            location: 'header',
            locationName: 'Content-MD5'
          },
          Expect: {
            location: 'header',
            locationName: 'Expect'
          },
          Key: {
            location: 'uri',
            locationName: 'Key'
          },
          PartNumber: {
            location: 'query',
            locationName: 'partNumber'
          },
          UploadId: {
            location: 'query',
            locationName: 'uploadId'
          }
        },
        payload: 'Body'
      }
    },

    AbortMultipartUpload: {
      resourceType: 'Object',
      http: {
        method: 'DELETE',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}'
      },
      input: {
        _required: [
          'Bucket',
          'Key',
          'UploadId'
        ],
        members: {
          Bucket: {
            location: 'uri',
            locationName: 'Bucket'
          },
          Key: {
            location: 'uri',
            locationName: 'Key'
          },
          UploadId: {
            location: 'query',
            locationName: 'uploadId'
          }
        }
      }
    },

    CompleteMultipartUpload: {
      resourceType: 'Object',
      http: {
        method: 'POST',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}'
      },
      input: {
        _required: [
          'Bucket',
          'Key',
          'UploadId'
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
            location: 'header',
            locationName: 'Content-Length'
          },
          ContentMD5: {
            location: 'header',
            locationName: 'Content-MD5'
          },
          Key: {
            location: 'uri',
            locationName: 'Key'
          },
          ObjectMD5: {
            location: 'header',
            locationName: 'x-nos-Object-md5'
          },
          UploadId: {
            location: 'query',
            locationName: 'uploadId'
          }
        },
        payload: 'Body'
      }
    },

    ListParts: {
      resourceType: 'Object',
      http: {
        method: 'GET',
        hostname: '${Bucket}.nos.netease.com',
        path: '/${Key}'
      },
      input: {
        _required: [
          'Bucket',
          'Key',
          'UploadId'
        ],
        members: {
          Bucket: {
            location: 'uri',
            locationName: 'Bucket'
          },
          Key: {
            location: 'uri',
            locationName: 'Key'
          },
          MaxParts: {
            location: 'query',
            locationName: 'max-parts'
          },
          PartNumberMarker: {
            location: 'query',
            locationName: 'part-number-marker'
          },
          UploadId: {
            location: 'query',
            locationName: 'uploadId'
          }
        }
      }
    }

  }
};
