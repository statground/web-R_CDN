async function get_div_main_statistics() {
	const Div_sub = ({ svg, title, content, unit }) => (
		<div class="flex items-center w-full p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow">
			<img src={svg} class="w-6 h-6" />
			<div class="pl-4 text-sm">
				<div class="font-bold">{title}</div>
				<div>{content}{unit}</div>
			</div>
		</div>
	);

	const Div_result = ({ data }) => (
		<div class="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mx-auto">
			<Div_sub title="총 가입자 수" content={data.cnt_member} unit="명" 
					 svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg" />
			<Div_sub title="오늘의 방문자 수" content={data.cnt_visitor} unit="명" 
					 svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg" />
			<Div_sub title="오늘의 페이지 뷰" content={data.cnt_pageview} unit="건" 
					 svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg" />
		</div>
	);

	const data = await fetch("/ajax_index_statistics/").then(res => res.json());
	ReactDOM.render(<Div_result data={data} />, document.getElementById("div_main_statistics"));
}