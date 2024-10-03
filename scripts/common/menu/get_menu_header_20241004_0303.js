async function get_menu_header() {
	function Div_sub_menu_header(props) {
		function Div_sub(props) {
			return (
				<a href={props.url} class="flex flex-row justify-center items-center hover:underline">
					{
						props.url_image != null &&
						<img src={props.url_image} class="size-4 mr-2" />
					}
					{props.name}
				</a>
			)
		}

		return (
			<div onClick={() => click_dropdown()} id="div_menu_sub_head/er"
				 class="flex justify-center items-center w-full h-[35px]">
			{
				gv_username == "" 
				?   <div class="flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]">
						<Div_sub url={"/account/"} name={"로그인"} />
						<span>|</span>
						<Div_sub url={"/account/signup/"} name={"회원 가입"} />
					</div>
				:   <div class="flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]">
						<Div_sub url={"/account/myinfo/"} name={props.data.name} 
								url_image={"https://cdn.jsdelivr.net/gh/statground/statkiss_CDN/images/svg/header_user.svg"} />
						<span>|</span>

						<a href="/intro/membership/" class="flex flex-row justify-center items-center font-extrabold hover:underline">
							{props.data.role}                
							{
								props.data.role == "준회원" &&
									<div class="ml-2 animate-pulse">
										<span class="font-extrabold text-red-500">(정회원 가입하기)</span>
									</div>
							}
						</a>
						<span>|</span>
						
						{
							props.data.role == "관리자" &&
								<Div_sub url={"/admin/"} name={"Admin Page"} />
						}
						{
							props.data.role == "관리자" &&
								<span>|</span>
						}
						
						<Div_sub url={"/account/logout/"} name={"로그아웃"} />
					</div>
			}
			</div>
		)
	}

	const data = await fetch("/ajax_get_menu_header/")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	gv_role = data['role']
	console.log("*** role: " + gv_role);

	// Menu
	ReactDOM.render(<Div_sub_menu_header data={data} />, document.getElementById("div_menu_sub_header")) 
}