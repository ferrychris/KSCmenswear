import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
  schema: {
    [`https://${process.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${process.env.VITE_SHOPIFY_API_VERSION}/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      },
    },
  },
  documents: ['src/lib/shopify/queries.ts'],
  generates: {
    './src/lib/shopify/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;