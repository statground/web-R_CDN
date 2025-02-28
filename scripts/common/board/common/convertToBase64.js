// Base64 변환 함수
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => {
	  resolve(reader.result); // Base64 문자열 반환
	};
	reader.onerror = (error) => {
	  reject(error); // 오류 반환
	};
	reader.readAsDataURL(file); // 파일 읽기 시작
  });
}