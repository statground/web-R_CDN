// 이미지를 압축하는 함수
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
	const img = new Image();
	const reader = new FileReader();

	reader.onload = () => {
	  img.src = reader.result;
	};

	reader.onerror = (error) => {
	  //console.error("이미지 파일 읽기 실패:", error);
	  reject(error);
	};

	img.onload = () => {
	  const canvas = document.createElement("canvas");
	  const ctx = canvas.getContext("2d");

	  let width = img.width;
	  let height = img.height;

	  // 이미지 크기 조정
	  if (width > maxWidth || height > maxHeight) {
		if (width > height) {
		  height = (maxHeight * height) / width;
		  width = maxWidth;
		} else {
		  width = (maxWidth * width) / height;
		  height = maxHeight;
		}
	  }

	  canvas.width = width;
	  canvas.height = height;

	  // 이미지를 캔버스에 그리기
	  ctx.drawImage(img, 0, 0, width, height);

	  // 압축된 이미지 생성 (JPEG 포맷)
	  canvas.toDataURL("image/jpeg", quality)
		? resolve(canvas.toDataURL("image/jpeg", quality))
		: reject(new Error("Canvas 이미지 압축 실패"));
	};

	reader.readAsDataURL(file);
  });
}