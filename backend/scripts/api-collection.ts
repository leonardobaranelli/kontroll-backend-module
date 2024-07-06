import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface Endpoint {
  name: string;
  method: string;
  path: string;
}

interface PostmanCollection {
  info: {
    name: string;
    schema: string;
  };
  item: any[];
  variable: {
    key: string;
    value: string;
    type: string;
  }[];
}

function createPostmanCollection(): void {
  const collection: PostmanCollection = {
    info: {
      name: 'API Endpoints',
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [],
    variable: [
      {
        key: 'base_url',
        value: process.env.BASE_URL || 'http://localhost:3001',
        type: 'string',
      },
    ],
  };

  const baseUrl = '{{base_url}}';

  const endpoints: Record<string, Endpoint[]> = {
    Shipments: [
      { name: 'Get All Shipments', method: 'GET', path: '/shipments' },
      {
        name: 'Get Shipment by Name',
        method: 'GET',
        path: '/shipments/name/{{name}}',
      },
      {
        name: 'Get Shipment by Tracking Number',
        method: 'GET',
        path: '/shipments/trackingNumber/{{trackingNumber}}',
      },
      {
        name: 'Get Shipment by ID',
        method: 'GET',
        path: '/shipments/id/{{id}}',
      },
      { name: 'Create Shipment', method: 'POST', path: '/shipments' },
      {
        name: 'Update Shipment by Name',
        method: 'PUT',
        path: '/shipments/name/{{name}}',
      },
      {
        name: 'Update Shipment by Tracking Number',
        method: 'PUT',
        path: '/shipments/trackingNumber/{{trackingNumber}}',
      },
      {
        name: 'Update Shipment by ID',
        method: 'PUT',
        path: '/shipments/id/{{id}}',
      },
      {
        name: 'Delete All Shipments',
        method: 'DELETE',
        path: '/shipments/all',
      },
      {
        name: 'Delete Shipment by Name',
        method: 'DELETE',
        path: '/shipments/name/{{name}}',
      },
      {
        name: 'Delete Shipment by Tracking Number',
        method: 'DELETE',
        path: '/shipments/trackingNumber/{{trackingNumber}}',
      },
      {
        name: 'Delete Shipment by ID',
        method: 'DELETE',
        path: '/shipments/id/{{id}}',
      },
    ],
    Connectors: [
      { name: 'Get All Connectors', method: 'GET', path: '/connectors' },
      {
        name: 'Get Connector by Name',
        method: 'GET',
        path: '/connectors/name/{{name}}',
      },
      {
        name: 'Get Connector by ID',
        method: 'GET',
        path: '/connectors/id/{{id}}',
      },
      { name: 'Create Connector', method: 'POST', path: '/connectors' },
      {
        name: 'Update Connector by Name',
        method: 'PUT',
        path: '/connectors/name/{{name}}',
      },
      {
        name: 'Update Connector by ID',
        method: 'PUT',
        path: '/connectors/id/{{id}}',
      },
      {
        name: 'Delete All Connectors',
        method: 'DELETE',
        path: '/connectors/all',
      },
      {
        name: 'Delete Connector by Name',
        method: 'DELETE',
        path: '/connectors/name/{{name}}',
      },
      {
        name: 'Delete Connector by ID',
        method: 'DELETE',
        path: '/connectors/id/{{id}}',
      },
    ],
    Users: [
      { name: 'Get All Users', method: 'GET', path: '/users' },
      {
        name: 'Get User by Username',
        method: 'GET',
        path: '/users/username/{{username}}',
      },
      { name: 'Get User by ID', method: 'GET', path: '/users/id/{{id}}' },
      { name: 'Register User', method: 'POST', path: '/users/register' },
      { name: 'Login User', method: 'POST', path: '/users/login' },
      {
        name: 'Update User by Username',
        method: 'PUT',
        path: '/users/username/{{username}}',
      },
      { name: 'Update User by ID', method: 'PUT', path: '/users/id/{{id}}' },
      { name: 'Delete All Users', method: 'DELETE', path: '/users/all' },
      {
        name: 'Delete User by Username',
        method: 'DELETE',
        path: '/users/username/{{username}}',
      },
      { name: 'Delete User by ID', method: 'DELETE', path: '/users/id/{{id}}' },
    ],
  };

  for (const [folderName, folderEndpoints] of Object.entries(endpoints)) {
    const folder = {
      name: folderName,
      item: folderEndpoints.map((endpoint) => ({
        name: endpoint.name,
        request: {
          method: endpoint.method,
          header: [],
          url: {
            raw: `${baseUrl}${endpoint.path}`,
            host: ['{{base_url}}'],
            path: endpoint.path.split('/').slice(1),
          },
        },
        response: [],
      })),
    };
    collection.item.push(folder);
  }

  const outputPath = path.join(__dirname, 'api-collection.json');
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
}

createPostmanCollection();
