async function get_app_list(url_tag) {
	let tag = ""
	if (url_tag == "None") {tag = "Free"}
	if (url_tag == "member") {tag = "Advance"}


	function Div_app_list(props) {
		const app_list = Object.keys(props.data).map((btn_data) =>  
			<div class="flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2">
				<img class="w-full rounded-lg" src={props.data[btn_data].url_image} />
				<h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
					{props.data[btn_data].name}
				</h3>
				{
					gv_username == ""
					?   <p class="text-sm text-red-500">로그인이 필요합니다.</p>
					:   <button type="button" onClick={() => click_btn_app_connect(props.data[btn_data].name, props.data[btn_data].tag)}
								class="text-gray-900 font-extrabold bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 rounded-lg text-sm px-5 py-1.5 text-center
									hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300">
							접속하기
						</button>
				}
				
			</div> 
		)

		return (
			<div class="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
				{app_list}
			</div>
		)
	}

	
	const request_data = new FormData();
	request_data.append('tag', tag);
	
	const data = await fetch("/webr/ajax_get_shinyapp_list/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_app_list data={data} />, document.getElementById("div_app_list"))
}