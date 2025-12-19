// src/utils/htmlUtils.js

/**
 * Làm sạch HTML content - loại bỏ các thẻ nguy hiểm nhưng giữ lại format cơ bản
 */
export const sanitizeHtmlContent = (html) => {
  if (!html) return '';
  
  // Loại bỏ script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Loại bỏ các thuộc tính nguy hiểm
  clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Giữ lại các thẻ an toàn: p, br, strong, em, u, a
  // Loại bỏ các thẻ khác
  clean = clean.replace(/<(?!\/?(?:p|br|strong|em|u|b|i|a)\b)[^>]+>/gi, '');
  
  return clean.trim();
};

/**
 * Chuyển HTML thành plain text (nếu cần)
 */
export const htmlToPlainText = (html) => {
  if (!html) return '';
  
  // Thay thế các thẻ break bằng newline
  let text = html.replace(/<br\s*\/?>/gi, '\n');
  
  // Thay thế các thẻ paragraph bằng newline
  text = text.replace(/<\/p>/gi, '\n\n');
  
  // Loại bỏ tất cả các thẻ HTML còn lại
  text = text.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  
  // Loại bỏ khoảng trắng thừa
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  
  return text;
};

/**
 * Truncate HTML content với độ dài an toàn
 */
export const truncateHtml = (html, maxLength = 200) => {
  const plainText = htmlToPlainText(html);
  
  if (plainText.length <= maxLength) {
    return html;
  }
  
  return plainText.substring(0, maxLength) + '...';
};