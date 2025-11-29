/**
 * compressImage
 * - blob 이미지를 최대 가로/세로 제한 + JPEG 품질로 압축
 * - 결과 dataURL의 예상 용량이 maxSizeKB를 넘으면 quality를 조금씩 낮추며 재시도
 *
 * @param {Blob} blob
 * @param {number} maxWidth   최대 가로(px)
 * @param {number} maxHeight  최대 세로(px)
 * @param {number} quality    초기 JPEG 압축률 (0 ~ 1)
 * @param {number} maxSizeKB  목표 최대 용량(KB) (대략적인 기준)
 *
 * @returns {Promise<string>} dataURL (data:image/...;base64,...)
 */
async function compressImage(
    blob,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeKB = 500
) {
    let currentQuality = quality;
    let dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);

    // base64 길이로 대략적인 byte 수 추정 (4/3 배)
    const calcSizeKB = (base64) => {
        const commaIndex = base64.indexOf(",");
        const base64Str = commaIndex >= 0 ? base64.substring(commaIndex + 1) : base64;
        const byteLength = Math.ceil(base64Str.length * 3 / 4);
        return byteLength / 1024;
    };

    let sizeKB = calcSizeKB(dataUrl);

    // 용량이 너무 크면 품질을 조금씩 낮추면서 재시도 (하한선 0.3)
    while (sizeKB > maxSizeKB && currentQuality > 0.3) {
        currentQuality = parseFloat((currentQuality - 0.1).toFixed(2)); // 0.1씩 감소
        if (currentQuality <= 0.3) {
            currentQuality = 0.3;
        }

        dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);
        sizeKB = calcSizeKB(dataUrl);
    }

    return dataUrl;
}