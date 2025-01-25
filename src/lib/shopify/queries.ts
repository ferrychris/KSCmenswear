import { gql } from 'graphql-request';

// Optimized query fragments
const PRODUCT_CORE_FIELDS = gql`
  fragment ProductCore on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const PRODUCT_MEDIA_FIELDS = gql`
  fragment ProductMedia on Product {
    images(first: 4) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const PRODUCT_VARIANT_FIELDS = gql`
  fragment ProductVariant on Product {
    variants(first: 100) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          availableForSale
        }
      }
    }
  }
`;

// Main queries using fragments
export const GET_PRODUCTS = gql`
  ${PRODUCT_CORE_FIELDS}
  ${PRODUCT_MEDIA_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}
  
  query GetProducts($query: String!) {
    products(first: 100, query: $query) {
      edges {
        node {
          ...ProductCore
          ...ProductMedia
          ...ProductVariant
          tags
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_CORE_FIELDS}
  ${PRODUCT_MEDIA_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}
  
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductCore
      ...ProductMedia
      ...ProductVariant
      tags
    }
  }
`;