# 🔄 Hướng Dẫn Hệ Thống Kiểm Tra Cập Nhật

## 📋 Tổng Quan

Hệ thống này cho phép người dùng ứng dụng di động tự động kiểm tra và được thông báo khi có phiên bản mới trên GitHub.

## ⚙️ Cách Hoạt Động

1. **Kiểm tra tự động**: Ứng dụng tự động kiểm tra phiên bản mới mỗi 24 giờ
2. **So sánh version**: So sánh phiên bản hiện tại với phiên bản trên GitHub
3. **Thông báo**: Hiển thị popup đẹp mắt khi có bản cập nhật mới
4. **Ghi nhớ**: Không hiện lại thông báo nếu người dùng đã dismiss

## 🚀 Cài Đặt

### Bước 1: Cập nhật GitHub username

Mở file `src/hooks/useUpdateChecker.js` và thay đổi:

```javascript
const VERSION_CHECK_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/dmt-movie/main/public/version.json';
```

Thay `YOUR-USERNAME` bằng username GitHub của bạn.

### Bước 2: Commit file version.json

```bash
git add public/version.json
git commit -m "Add version.json for update checking"
git push origin main
```

## 📦 Khi Phát Hành Phiên Bản Mới

### 1. Cập nhật version trong code

**File: `src/hooks/useUpdateChecker.js`**
```javascript
const CURRENT_VERSION = '1.1.0'; // Thay đổi version mới
```

**File: `package.json`**
```json
{
  "version": "1.1.0"
}
```

### 2. Cập nhật file version.json

**File: `public/version.json`**
```json
{
  "version": "1.1.0",
  "releaseDate": "2026-08-10",
  "changelog": [
    "✨ Thêm tính năng xem offline",
    "🐛 Sửa lỗi video không load",
    "⚡ Tối ưu hiệu suất 50%",
    "🎨 Giao diện mới cho mobile"
  ],
  "updateUrl": "https://github.com/your-username/dmt-movie/releases/tag/v1.1.0"
}
```

### 3. Commit và push

```bash
git add .
git commit -m "Release version 1.1.0"
git push origin main
```

### 4. Tạo GitHub Release (tùy chọn)

```bash
gh release create v1.1.0 --title "Version 1.1.0" --notes "
✨ Tính năng mới:
- Thêm chế độ xem offline
- Tối ưu tốc độ load

🐛 Sửa lỗi:
- Sửa lỗi video không chạy trên một số thiết bị
- Sửa lỗi giao diện trên màn hình nhỏ
"
```

## 🎨 Tùy Chỉnh

### Thay đổi thời gian kiểm tra

Trong file `src/hooks/useUpdateChecker.js`:

```javascript
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 giờ
// Hoặc
const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 giờ
```

### Thay đổi giao diện thông báo

Chỉnh sửa file `src/components/UpdateNotification.jsx` để thay đổi màu sắc, kích thước, hoặc vị trí.

## 🧪 Kiểm Tra

### 1. Test local

```javascript
// Trong useUpdateChecker.js, tạm thời thay đổi:
const CURRENT_VERSION = '0.9.0'; // Version thấp hơn

// Và trong version.json:
{
  "version": "1.0.0" // Version cao hơn
}
```

### 2. Clear localStorage để test lại

```javascript
localStorage.removeItem('last_version_check');
localStorage.removeItem('dismissed_version');
```

### 3. Test với URL thật

Deploy version.json lên GitHub và test với URL thật:
```
https://raw.githubusercontent.com/your-username/dmt-movie/main/public/version.json
```

## 📱 Trải Nghiệm Người Dùng

Khi có phiên bản mới:

1. ✅ Popup hiện ở góc dưới màn hình (mobile-friendly)
2. 📝 Hiển thị changelog với tối đa 3 mục
3. 🔗 Button "Tải phiên bản mới" link đến GitHub releases
4. ⏰ Button "Để sau" - ẩn thông báo nhưng sẽ hiện lại sau 24h
5. ❌ Button đóng - không hiện lại cho version này

## 🔧 Troubleshooting

### Không thấy thông báo cập nhật?

1. Kiểm tra console browser xem có lỗi không
2. Verify URL GitHub có đúng và public không
3. Xóa localStorage và reload trang
4. Kiểm tra version trong code có thấp hơn version.json không

### CORS Error?

GitHub raw content hỗ trợ CORS nên không cần cấu hình gì thêm. Nếu gặp lỗi, kiểm tra:
- Repository phải là public
- URL phải đúng format

## 📚 API Reference

### useUpdateChecker Hook

```javascript
const {
  hasUpdate,       // boolean - có update không
  newVersion,      // string - version mới
  currentVersion,  // string - version hiện tại
  loading,         // boolean - đang kiểm tra
  error,           // string - lỗi nếu có
  changelog,       // array - danh sách thay đổi
  updateUrl,       // string - link download
  dismissUpdate,   // function - ẩn thông báo
  checkForUpdates  // function - check thủ công
} = useUpdateChecker();
```

### version.json Schema

```typescript
{
  version: string;        // Required - "1.0.0"
  releaseDate: string;    // Optional - "2026-08-06"
  changelog: string[];    // Optional - mảng các thay đổi
  updateUrl: string;      // Optional - link download
}
```

## 🎯 Best Practices

1. **Semantic Versioning**: Sử dụng format `MAJOR.MINOR.PATCH`
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes

2. **Changelog rõ ràng**: Sử dụng emoji và mô tả ngắn gọn
   - ✨ Tính năng mới
   - 🐛 Sửa lỗi
   - ⚡ Cải thiện hiệu suất
   - 🎨 Thay đổi UI/UX

3. **Test trước khi release**: Luôn test với version thấp hơn trước

4. **GitHub Releases**: Tạo release trên GitHub để người dùng dễ tải

## 🌟 Ví Dụ Workflow Hoàn Chỉnh

```bash
# 1. Phát triển tính năng mới
git checkout -b feature/offline-mode

# 2. Sau khi hoàn thành, cập nhật version
# - Sửa CURRENT_VERSION trong useUpdateChecker.js
# - Sửa version trong package.json
# - Cập nhật public/version.json

# 3. Commit và merge
git add .
git commit -m "feat: Add offline mode (v1.1.0)"
git checkout main
git merge feature/offline-mode

# 4. Tạo tag
git tag -a v1.1.0 -m "Version 1.1.0 - Offline Mode"
git push origin main --tags

# 5. Tạo GitHub Release
gh release create v1.1.0 --title "v1.1.0 - Offline Mode" --notes "..."

# 6. Build và deploy
npm run build
```

Sau khi push lên GitHub, người dùng sẽ tự động nhận được thông báo cập nhật trong vòng 24 giờ! 🎉
