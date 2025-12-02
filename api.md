GET: /api/history
results:{
"status": true,
"data": {
"links": {
"previous": "http://api.example.org/accounts/?page=2",
"next": "http://api.example.org/accounts/?page=4"
},
"total_items": 100,
"total_pages": 10,
"page_size": 10,
"current_page": 1,
"results": [
{
"id": 0,
"amount": "8782",
"type": "income",
"comment": "string",
"created_at": "2025-12-02T01:05:57.088Z"
}
]
}
}

GET: /api/history/<pk>
results:{
"status": true,
"data": {
"id": 0,
"amount": "-6.95",
"type": "income",
"comment": "string",
"created_at": "2025-12-02T01:06:40.689Z"
}
}
