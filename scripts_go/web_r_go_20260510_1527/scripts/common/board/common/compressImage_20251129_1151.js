async function compressImage(blob, maxWidth = 1200, maxHeight = 1200, quality = 0.8, maxSizeKB = 500) {
  let currentQuality = quality;
  let dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);
  const calcSizeKB = (base64) => {
    const commaIndex = base64.indexOf(",");
    const base64Str = commaIndex >= 0 ? base64.substring(commaIndex + 1) : base64;
    const byteLength = Math.ceil(base64Str.length * 3 / 4);
    return byteLength / 1024;
  };
  let sizeKB = calcSizeKB(dataUrl);
  while (sizeKB > maxSizeKB && currentQuality > 0.3) {
    currentQuality = parseFloat((currentQuality - 0.1).toFixed(2));
    if (currentQuality <= 0.3) {
      currentQuality = 0.3;
    }
    dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);
    sizeKB = calcSizeKB(dataUrl);
  }
  return dataUrl;
}
