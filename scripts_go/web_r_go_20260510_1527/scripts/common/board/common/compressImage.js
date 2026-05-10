function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = maxHeight * height / width;
          width = maxWidth;
        } else {
          width = maxWidth * width / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toDataURL("image/jpeg", quality) ? resolve(canvas.toDataURL("image/jpeg", quality)) : reject(new Error("Canvas \uC774\uBBF8\uC9C0 \uC555\uCD95 \uC2E4\uD328"));
    };
    reader.readAsDataURL(file);
  });
}
