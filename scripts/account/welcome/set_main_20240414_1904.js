function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center w-full py-16 space-y-2">
				<div class="flex flex-row justify-center items-center space-x-2">
					<img src="https://cdn.jsdelivr.net/gh/statground/statkiss_CDN/images/svg/waving_hand.svg" class="w-16 h-16 mr-2" />
					<span class="text-2xl font-bold">환영합니다.</span>
				</div>

				<span class="text-xl">하단의 Home 버튼을 클릭하여, Web-R을 시작해보세요.</span>

				<br/>

				<button type="button" onClick={() => location.href="/"}
						class="py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-sm w-auto text-center
							   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
					Home
				</button>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}