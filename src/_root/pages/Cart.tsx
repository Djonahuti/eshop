let categoryIds: string[] = [];
if (doc.cat_id && Array.isArray(doc.cat_id)) {
  categoryIds = doc.cat_id;
} else if (doc.cat_id && typeof doc.cat_id === "string") {
  categoryIds = [doc.cat_id];
} else {
  console.warn("Missing category ID for product:", doc.product_title); // Debugging
}
