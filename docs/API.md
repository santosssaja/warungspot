# 🔌 API Documentation

## Analyze Shop
Menganalisis foto spanduk toko untuk mengekstrak informasi otomatis.

**Endpoint**: `POST /api/analyze-shop`

### Request
**Content-Type**: `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `bannerImage` | File | Foto spanduk toko (Wajib) |
| `productImage{n}` | File | Foto produk pendukung (Opsional) |

### Response
```json
{
  "shopName": "Warung Makan Sederhana",
  "phoneNumber": "08123456789",
  "address_clue": "Jl. Melati No. 10",
  "category": "Makanan",
  "marketing_desc": "Nikmati masakan rumahan dengan harga terjangkau!"
}
```

### Error Response
- **400**: Missing file.
- **500**: AI processing failed.
