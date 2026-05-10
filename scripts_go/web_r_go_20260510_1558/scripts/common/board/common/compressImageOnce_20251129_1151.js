function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          let width = img.width;
          let height = img.height;
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio, 1);
          const targetWidth = Math.round(width * ratio);
          const targetHeight = Math.round(height * ratio);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          let mimeType = blob.type;
          if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
            mimeType = "image/jpeg";
          }
          let dataUrl;
          if (mimeType === "image/png") {
            dataUrl = canvas.toDataURL("image/png");
          } else {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.onerror = function(err) {
          reject(err);
        };
        img.src = e.target.result;
      };
      reader.onerror = function(err) {
        reject(err);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      reject(err);
    }
  });
}
