const collections = [
    {
        name: 'Saves',
        id: 'saves',
        attributes: [
            { key: 'user', type: 'relationship', relatedCollection: 'Users', attributeKey: 'save' }, // Relationship (Many-to-One) → Users (Two Ways Relationship)
            { key: 'post', type: 'relationship', relatedCollection: 'Posts', attributeKey: 'save' } // Relationship (Many-to-One) → Posts (Two Ways Relationship)
        ]
    },
    {
        name: 'Users',
        id: 'users',
        attributes: [
            { key: 'posts', type: 'relationship', relatedCollection: 'Posts', attributeKey: 'creator' }, // Relationship (Many-to-One) → Posts (Two Ways Relationship)
            { key: 'liked', type: 'relationship', relatedCollection: 'Posts', attributeKey: 'likes' }, // Relationship (Many-to-Many) → Posts (Two Ways Relationship)
            { key: 'name', type: 'string', size: 2200 },
            { key: 'username', type: 'string', size: 2200 },
            { key: 'accountId', type: 'string', size: 2200, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'bio', type: 'string', size: 2200 },
            { key: 'imageId', type: 'string', size: 2200 },
            { key: 'imageUrl', type: 'url', required: true },
            { key: 'save', type: 'relationship', relatedCollection: 'Saves', attributeKey: 'user' } // Relationship (Many-to-One) → Saves (Two Ways Relationship)
        ]
    },
    {
        name: 'Posts',
        id: 'posts',
        attributes: [
            { key: 'creator', type: 'relationship', relatedCollection: 'Users', attributeKey: 'posts' }, // Relationship (Many-to-One) → Users (Two Ways Relationship)
            { key: 'likes', type: 'relationship', relatedCollection: 'Users', attributeKey: 'liked' }, // Relationship (Many-to-Many) → Users (Two Ways Relationship)
            { key: 'save', type: 'relationship', relatedCollection: 'Saves', attributeKey: 'post' }, // Relationship (Many-to-One) → Saves (Two Ways Relationship)
            { key: 'caption', type: 'string', size: 2200 },
            { key: 'tags', type: 'string', size: 2200, array: true },
            { key: 'imageUrl', type: 'url', required: true },
            { key: 'imageId', type: 'string', size: 2200 },
            { key: 'location', type: 'string', size: 2200 }
        ]
    }
];