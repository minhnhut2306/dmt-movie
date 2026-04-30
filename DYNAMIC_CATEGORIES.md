# 🎯 Dynamic Categories - 100% từ API

## ✅ ĐÃ HOÀN THÀNH

### 1. **Thể Loại** - 100% từ API
- **API**: `GET https://phimapi.com/the-loai`
- **Hook**: `useDynamicGenres()`
- **Cache**: 1 giờ (React Query)
- **Không có fallback** - Chỉ dùng data từ API

**Response Format**:
```json
[
  {
    "_id": "9822be111d2ccc29c7172c78b8af8ff5",
    "name": "Hành Động",
    "slug": "hanh-dong"
  },
  ...
]
```

**Số lượng**: ~26 thể loại (tùy API)

---

### 2. **Quốc Gia** - 100% từ API
- **API**: `GET https://phimapi.com/quoc-gia`
- **Hook**: `useDynamicCountries()`
- **Cache**: 1 giờ (React Query)
- **Không có fallback** - Chỉ dùng data từ API

**Response Format**:
```json
[
  {
    "_id": "f6ce1ae8b39af9d38d653b8a0890adb8",
    "name": "Việt Nam",
    "slug": "viet-nam"
  },
  ...
]
```

**Số lượng**: ~36 quốc gia (tùy API)

---

### 3. **Năm** - Dynamic Generation
- **Không cần API** - Generate từ code
- **Logic**: Từ 1980 đến năm hiện tại + 1
- **Tự động update** mỗi năm

```javascript
const currentYear = new Date().getFullYear(); // 2026
// Tạo: 2027, 2026, 2025, ..., 1981, 1980
```

**Số lượng**: ~48 năm (tùy năm hiện tại)

---

### 4. **Danh Sách Đặc Biệt** - Static
- **Không cần API** - Hardcode (ít thay đổi)
- Phim Mới Cập Nhật
- Phim Bộ
- Phim Lẻ
- TV Shows
- Hoạt Hình
- Phim Vietsub
- Phim Thuyết Minh
- Phim Lồng Tiếng

**Số lượng**: 8 items

---

## 📊 SO SÁNH

### Trước (Hardcode):
```javascript
// ❌ 100+ dòng hardcode
categories: {
  "hanh-dong": { name: "Hành Động" },
  "co-trang": { name: "Cổ Trang" },
  // ... 100+ items
}
```

### Sau (Dynamic):
```javascript
// ✅ Fetch từ API, cache 1 giờ
const { genres, isLoading, error } = useDynamicGenres();
// Tự động có tất cả thể loại từ API!
```

---

## 🎯 CÁCH DÙNG

### Trong Component:

```javascript
import { 
  useDynamicGenres, 
  useDynamicCountries,
  ALL_YEARS,
  STATIC_SPECIAL_LISTS 
} from '../utils/CategoryConfigDynamic';

function MyComponent() {
  // Fetch thể loại từ API
  const { genres, isLoading: genresLoading, error: genresError } = useDynamicGenres();
  
  // Fetch quốc gia từ API
  const { countries, isLoading: countriesLoading, error: countriesError } = useDynamicCountries();
  
  // Năm - static
  const years = ALL_YEARS;
  
  // Danh sách đặc biệt - static
  const specialLists = STATIC_SPECIAL_LISTS;
  
  if (genresLoading) return <div>Loading genres...</div>;
  if (genresError) return <div>Error loading genres</div>;
  
  return (
    <div>
      {genres.map(genre => (
        <a key={genre.slug} href={genre.fullPath}>
          {genre.name}
        </a>
      ))}
    </div>
  );
}
```

---

## 🔧 FILES

### API Layer:
- `src/api/movieApi.js` - `getAllGenres()`, `getAllCountries()`

### Hooks Layer:
- `src/hooks/useMovies.js` - `useAllGenres()`, `useAllCountries()`

### Config Layer:
- `src/utils/CategoryConfigDynamic.js` - `useDynamicGenres()`, `useDynamicCountries()`

### Components Using:
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/pages/CategoryPage/CategoryPage.jsx`

---

## ⚡ PERFORMANCE

### Cache Strategy:
```
API Call → React Query Cache (1 giờ) → Component
```

### First Load:
- Fetch từ API: ~200-500ms
- Transform data: ~1-5ms
- **Total**: ~200-500ms

### Subsequent Loads (trong 1 giờ):
- Lấy từ cache: ~0ms
- **Instant rendering**

---

## 🚀 LỢI ÍCH

1. ✅ **Không cần update code** khi API thêm thể loại/quốc gia mới
2. ✅ **Cache 1 giờ** - giảm API calls
3. ✅ **Năm tự động** - không cần update mỗi năm
4. ✅ **Giảm ~300 lines** hardcode
5. ✅ **Single source of truth** - API là nguồn duy nhất

---

## 📝 NOTES

- **Không có fallback data** - Nếu API fail, hiển thị error
- **Cache 1 giờ** - Đủ lâu để giảm API calls, đủ ngắn để update nhanh
- **Năm tự động** - Mỗi năm mới tự động có trong list
- **Transform data** - Convert API format sang app format

---

**Updated**: 2026-04-30
**Version**: 2.0 (100% Dynamic)
