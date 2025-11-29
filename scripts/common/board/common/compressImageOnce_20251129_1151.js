// 이미지 1회 리사이즈 + 압축해서 dataURL 반환
function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();

                img.onload = function () {
                    let width = img.width;
                    let height = img.height;

                    // 리사이즈 비율 계산
                    const widthRatio = maxWidth / width;
                    const heightRatio = maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio, 1); // 1보다 크면 축소하지 않음

                    const targetWidth = Math.round(width * ratio);
                    const targetHeight = Math.round(height * ratio);

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    ctx.clearRect(0, 0, targetWidth, targetHeight);
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // MIME 타입 결정
                    let mimeType = blob.type;
                    if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
                        // 지원하지 않는 포맷은 JPEG로 통일
                        mimeType = "image/jpeg";
                    }

                    let dataUrl;
                    if (mimeType === "image/png") {
                        // PNG는 quality 옵션이 무시되므로 리사이즈만 적용
                        dataUrl = canvas.toDataURL("image/png");
                    } else {
                        // JPEG는 quality로 용량 줄이기 가능
                        dataUrl = canvas.toDataURL("image/jpeg", quality);
                    }

                    resolve(dataUrl);
                };

                img.onerror = function (err) {
                    reject(err);
                };

                img.src = e.target.result;
            };

            reader.onerror = function (err) {
                reject(err);
            };

            reader.readAsDataURL(blob);
        } catch (err) {
            reject(err);
        }
    });
}