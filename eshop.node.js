import { Client, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('67cb61590038ed360241') // Replace with your Appwrite project ID

const databases = new Databases(client);
const databaseId = '67cb79870023b3161cf0'; // Replace with your Appwrite database ID
const API_KEY = 'standard_8342c84ac4400d086ac23fb34586ac62235079349c9b21d246e7fbc0af3815200472f54f0a91714be1d385294650741e1707d41704fa2d1268fa3b036f8ea75870cfad120223d4ef45860b2da2adfa19e97121bb29b7fcefe1b02e3a076ec9a4ca9847d25970752e9a6c01dbb767f84a39917a94875bc6579bf23bdc0522f374';


// Include the API Key in the headers when making requests
client.setKey = function (key) {
    client.headers['standard_8342c84ac4400d086ac23fb34586ac62235079349c9b21d246e7fbc0af3815200472f54f0a91714be1d385294650741e1707d41704fa2d1268fa3b036f8ea75870cfad120223d4ef45860b2da2adfa19e97121bb29b7fcefe1b02e3a076ec9a4ca9847d25970752e9a6c01dbb767f84a39917a94875bc6579bf23bdc0522f374'] = key;
};
client.setKey(API_KEY);

async function createCollections() {

        const collections = [
          {
              name: 'Admins',
              id: 'admins',
              attributes: [
                  { key: 'admin_name', type: 'string', size: 255 },
                  { key: 'admin_email', type: 'email' },
                  { key: 'admin_pass', type: 'string', size: 255 },
                  { key: 'admin_image', type: 'url' },
                  { key: 'admin_contact', type: 'string', size: 255 },
                  { key: 'admin_country', type: 'string' },
                  { key: 'admin_job', type: 'string', size: 255 },
                  { key: 'admin_about', type: 'string' }
              ]
          },
          {
              name: 'Customers',
              id: 'customers',
              attributes: [
                  { key: 'customer_name', type: 'string', size: 255 },
                  { key: 'customer_email', type: 'email' }, //  Create a Unique index seperately for customer_email to prevent duplicates.
                  { key: 'password', type: 'string', size: 255 },
                  { key: 'customer_country', type: 'string' },
                  { key: 'customer_city', type: 'string' },
                  { key: 'customer_contact', type: 'string', size: 255 },
                  { key: 'customer_address', type: 'string' },
                  { key: 'customer_image', type: 'url' },
                  { key: 'customer_ip', type: 'string' },
                  { key: 'customer_confirm_code', type: 'string' }
              ]
          },
          {
              name: 'Customer Orders',
              id: 'customer_orders',
              attributes: [
                  { key: 'customer_id', type: 'relationship', relatedCollection: 'customers' }, // Relationship (One-to-Many) → customers
                  { key: 'due_amount', type: 'integer' },
                  { key: 'invoice_no', type: 'integer' },
                  { key: 'qty', type: 'integer' },
                  { key: 'size', type: 'string' },
                  { key: 'order_date', type: 'datetime' },
                  { key: 'order_status', type: 'string' }
              ]
          },
          {
              name: 'Products',
              id: 'products',
              attributes: [
                  { key: 'product_title', type: 'string', size: 255 },
                  { key: 'product_price', type: 'integer' },
                  { key: 'product_psp_price', type: 'integer' },
                  { key: 'product_desc', type: 'string' },
                  { key: 'product_keywords', type: 'string' },
                  { key: 'product_label', type: 'string' },
                  { key: 'status', type: 'string' },
                  { key: 'product_img1', type: 'url' },
                  { key: 'product_img2', type: 'url' },
                  { key: 'product_img3', type: 'url' },
                  { key: 'product_url', type: 'url' },
                  { key: 'p_cat_id', type: 'relationship', relatedCollection: 'product_categories' }, //Relationship (One-to-Many) → product_categories
                  { key: 'cat_id', type: 'relationship', relatedCollection: 'categories' }, //Relationship (One-to-Many) → categories
                  { key: 'manufacturer_id', type: 'relationship', relatedCollection: 'manufacturers' } //Relationship (One-to-Many) → manufacturers
              ]
          },
          {
              name: 'Categories',
              id: 'categories',
              attributes: [
                  { key: 'cat_title', type: 'string', size: 255 },
                  { key: 'cat_top', type: 'boolean', default: false }
              ]
          },
          {
              name: 'Manufacturers',
              id: 'manufacturers',
              attributes: [
                  { key: 'manufacturer_title', type: 'string', size: 255 },
                  { key: 'manufacturer_top', type: 'boolean', default: true },
                  { key: 'manufacturer_image', type: 'url' }
              ]
          },
          {
              name: 'Cart',
              id: 'cart',
              attributes: [
                  { key: 'ip_add', type: 'string' },
                  { key: 'p_price', type: 'string' },
                  { key: 'size', type: 'string' },
                  { key: 'p_id', type: 'relationship', relatedCollection: 'products' }, // Relationship (One-to-Many) → products
                  { key: 'qty', type: 'integer' }
              ]
          },
          {
              name: 'Bundles',
              id: 'bundles',
              attributes: [
                  { key: 'bundle_id', type: 'string' },
              ]
          },
          {
              name: 'Bundle Product Relation',
              id: 'bundle_product_relation',
              attributes: [
                  { key: 'bundle_id', type: 'relationship', relatedCollection: 'bundles' }, // Relationship (many-to-Many) → bundles
                  { key: 'product_id', type: 'relationship', relatedCollection: 'products' } // Relationship (many-to-Many) → products
              ]
          },
          {
              name: 'Contact',
              id: 'contact',
              attributes: [
                  { key: 'contact_email', type: 'email' },
                  { key: 'contact_subject', type: 'string' },
                  { key: 'contact_message', type: 'string' }
              ]
          },
          {
              name: 'Coupons',
              id: 'coupons',
              attributes: [
                  { key: 'product_id', type: 'relationship', relatedCollection: 'products' }, // Relationship (one-to-Many) → products
                  { key: 'coupon_title', type: 'string', size: 255 },
                  { key: 'coupon_price', type: 'string', size: 255 },
                  { key: 'coupon_code', type: 'string', size: 255 },
                  { key: 'coupon_limit', type: 'integer' },
                  { key: 'coupon_used', type: 'integer' }
              ]
          },
          {
              name: 'Payments',
              id: 'payments',
              attributes: [
                  { key: 'amount', type: 'integer' },
                  { key: 'invoice_no', type: 'integer' },
                  { key: 'ref_no', type: 'integer' },
                  { key: 'code', type: 'integer' },
                  { key: 'payment_date', type: 'datetime' },
                  { key: 'payment_mode', type: 'string' }
              ]
          },
          {
              name: 'Pending Orders',
              id: 'pending_orders',
              attributes: [
                  { key: 'customer_id', type: 'relationship', relatedCollection: 'customers' },
                  { key: 'order_id', type: 'relationship', relatedCollection: 'customer_orders' },
                  { key: 'invoice_no', type: 'integer' },
                  { key: 'qty', type: 'integer' },
                  { key: 'size', type: 'string' },
                  { key: 'order_status', type: 'string' }
              ]
          },
          {
              name: 'Product Categories',
              id: 'product_categories',
              attributes: [
                  { key: 'p_cat_title', type: 'string' },
                  { key: 'p_cat_top', type: 'string' },
                  { key: 'p_cat_image', type: 'url' }
              ]
          },
          {
              name: 'Wishlist',
              id: 'wishlist',
              attributes: [
                  { key: 'customer_id', type: 'relationship', relatedCollection: 'customers' }, // Relationship (One-to-Many) → customers
                  { key: 'product_id', type: 'relationship', relatedCollection: 'products' } // Relationship (one-to-Many) → products
              ]
          }
      ];

        for (const collection of collections) {
            try {
                await databases.createCollection(databaseId, collection.id, collection.name, {
                    documentSecurity: true,
                });
                console.log(`✅ Created collection: ${collection.name}`);

                for (const attr of collection.attributes) {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(databaseId, collection.id, attr.key, attr.size, false);
                    } else if (attr.type === 'email') {
                        await databases.createEmailAttribute(databaseId, collection.id, attr.key, false);
                    } else if (attr.type === 'integer') {
                        await databases.createIntegerAttribute(databaseId, collection.id, attr.key, false);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(databaseId, collection.id, attr.key, false);
                    } else if (attr.type === 'relationship') {
                        await databases.createRelationshipAttribute(databaseId, collection.id, attr.key, attr.relatedCollection, 'oneToMany');
                    }
                    console.log(`  Added attribute: ${attr.key}`);
                }
            } catch (err) {
                console.error(`❌ Error creating collection ${collection.name}:`, err.message);
            }
        }
}

// Run the function
createCollections();