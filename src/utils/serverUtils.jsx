/**
 * Xử lý và format tên server
 * @param {string} serverName - Tên server gốc
 * @returns {string} - Tên server đã được format
 */
export const formatServerName = (serverName) => {
  if (!serverName) return '';

  // Loại bỏ # và tên địa điểm (Hà Nội, TP.HCM, etc.)
  let formatted = serverName.replace(/^#[^(]*\(/, '').replace(/\)$/, '');
  
  // Nếu không có dấu ngoặc, kiểm tra pattern khác
  if (formatted === serverName) {
    // Pattern: #Hà Nội - Vietsub -> Vietsub
    formatted = serverName.replace(/^#[^-]*-\s*/, '');
    
    // Pattern: #Server1 Vietsub -> Vietsub
    if (formatted === serverName) {
      formatted = serverName.replace(/^#\w+\s+/, '');
    }
  }

  // Làm sạch và chuẩn hóa
  formatted = formatted.trim();
  
  // Chuẩn hóa các từ khóa phổ biến
  if (formatted.toLowerCase().includes('vietsub')) {
    formatted = 'Vietsub';
  } else if (formatted.toLowerCase().includes('lồng tiếng') || formatted.toLowerCase().includes('thuyết minh')) {
    formatted = 'Lồng Tiếng';
  } else if (formatted.toLowerCase().includes('engsub') || formatted.toLowerCase().includes('english')) {
    formatted = 'English Sub';
  } else if (formatted.toLowerCase().includes('raw')) {
    formatted = 'RAW';
  }

  return formatted || 'Server';
};

/**
 * Lọc và sắp xếp servers theo độ ưu tiên
 * @param {Array} servers - Danh sách servers
 * @returns {Array} - Danh sách servers đã được lọc và sắp xếp
 */
export const prioritizeServers = (servers) => {
  if (!servers || !Array.isArray(servers)) return [];

  // Độ ưu tiên server (số càng thấp càng ưu tiên)
  const serverPriority = {
    'Vietsub': 1,
    'Lồng Tiếng': 2,
    'English Sub': 3,
    'RAW': 4,
    'Server': 5
  };

  return servers
    .map(server => ({
      ...server,
      server_name: formatServerName(server.server_name)
    }))
    .sort((a, b) => {
      const priorityA = serverPriority[a.server_name] || 99;
      const priorityB = serverPriority[b.server_name] || 99;
      return priorityA - priorityB;
    });
};

/**
 * Lấy server mặc định (Vietsub nếu có, không thì server đầu tiên)
 * @param {Array} servers - Danh sách servers
 * @returns {number} - Index của server mặc định
 */
export const getDefaultServerIndex = (servers) => {
  if (!servers || !Array.isArray(servers) || servers.length === 0) return 0;

  const vietsubIndex = servers.findIndex(server => 
    formatServerName(server.server_name) === 'Vietsub'
  );

  return vietsubIndex !== -1 ? vietsubIndex : 0;
};