/**
 * Integrated admin script for /admin/balance_account/
 * Generated from the current admin index bundle layout.
 * Only functions/components actually used by this menu were kept.
 */
function Div_operation_menu() {
	function Div_menu_button(props) {
		return (
			<button type="button" onClick={() => location.href=props.url}
					class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200
						focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
				{props.name}
			</button>
		)
	}

	var date = new Date();

	return (
		<div class="col-span-2 md:grid-cols-1 justify-center item-center">
			<div class="flex flex-col md:flex-row lg:w-48 md:w-full item-center">
				<Div_menu_button name={"첫 화면"} url={'/admin/'} />
				<Div_menu_button name={"활성 사용자"} url={'/admin/active_users/'} />
				<Div_menu_button name={"Web-R 접속 현황"} url={'/admin/webr/'} />
				<Div_menu_button name={"방문 현황"} url={'/admin/visitors/'} />
				<Div_menu_button name={"회원 현황"} url={'/admin/members/'} />
				<Div_menu_button name={"결제 현황"} url={'/admin/payments/'} />
				<Div_menu_button name={"정산액 조회"} url={'/admin/balance_account/?year=' + date.getFullYear().toString() + "&month=" + (date.getMonth()+1).toString() }/>
			</div>
		</div>
	)
}

function Div_sub_title(props) {
	return (
		<h5 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
			<span class="text-blue-600">
				{props.title}
			</span>
		</h5>            
	)
}

function Div_sub_card(props) {
	return (
		<div class="flex flex-col items-center justify-center p-4">
			<dt class="text-3xl font-extrabold">
				{props.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",") }{props.unit}
			</dt>
			<dd class="font-light text-gray-500">
				{props.title}
			</dd>
			{
				props.subvalue != null
				?   <dd class="font-light text-gray-500">
						({props.subtitle}: {props.subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}
						{
							props.subunit == null
							?   props.unit
							:   props.subunit
						})
					</dd>
				:   null
			}

		</div>
	)
}

function Div_sub_card_skeleton(props) {
	return (
		<div class="flex flex-col items-center justify-center">
			<dt class="text-3xl font-extrabold">
				<div class="h-5 bg-gray-300 rounded-full w-48 mb-4"></div>
			</dt>
			<dd class="font-light text-gray-500">
				{props.title}
			</dd>
		</div>            
	)
}

function Div_table_skeleton() {
	function Div_row() {
		return (
			<div class="flex items-center justify-between w-full">
				<div>
					<div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
			</div>
		)
	}

	return (
		<div role="status" class="w-full p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse md:p-6">
			<Div_row /><Div_row /><Div_row /><Div_row /><Div_row />
		</div>
	)
}

function Div_main_skeleton(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 space-y-4 md:grid-cols-1 justify-center item-center">
				<div class="w-full" id="div_select" name="div_select">
					<div class="flex flex-row justify-start items-center w-full space-x-2 animate-pulse">

						<div class="flex flex-col">
							<label for="small" class="block text-sm font-medium text-gray-900 dark:text-white">Year</label>
							<select id="small" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<div class="flex flex-col">
							<label for="small" class="block text-sm font-medium text-gray-900 dark:text-white">Month</label>
							<select id="small" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<button type="button" 
								class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit
									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
							선택
						</button>
					</div>
				</div>

				<div id="div_statistics_payments" name="div_statistics_payments"
					 class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"결제 현황"} />
						<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 pt-8 mx-auto text-gray-900 md:pt-4">
							<Div_sub_card_skeleton title={"총 회원 업그레이드 결제"} />
							<Div_sub_card_skeleton title={"부가세 (10%)"} />
							<Div_sub_card_skeleton title={"토스페이먼츠 수수료 (3.63%)"} />
							<Div_sub_card_skeleton title={"통계마당 수수료 (10%)"} />
							<Div_sub_card_skeleton title={"기타소득 세금 (8.8%)"} />
							<Div_sub_card_skeleton title={"정산액"} />
						</dl>
					</div>
				</div>

				<div id="div_statistics_table" name="div_statistics_table"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"결제 목록"} />
						<dl class="flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900">
							<Div_table_skeleton />
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

function Div_main(props) {
	const class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium px-2.5 py-0.5 rounded-full"

	const payment_list = Object.keys(props.data.table).map((btn_data) =>  
		<div key={btn_data} class="bg-white border-b w-full">
			<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.table[btn_data].product_name}
					</span>
				</div>
				<div class="flex flex-wrap justify-start items-center w-full space-x-2">
					<span class={class_span_btn_default + " bg-green-100 text-green-800"}>
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
						{props.data.table[btn_data].username}
					</span>

					<span class={class_span_btn_default + " bg-gray-100 text-gray-800"}>
						{props.data.table[btn_data].email}
					</span>

					<span class={class_span_btn_default + " bg-yellow-100 text-yellow-800"}>
						{props.data.table[btn_data].amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}원
					</span>

					<span class={class_span_btn_default + " bg-blue-100 text-blue-800"}>
						<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.data.table[btn_data].updated_at.split("-")[2].substr(0, 2)).toString() + ".svg"} class="w-3 h-3 mr-1" />
						{props.data.table[btn_data].updated_at}
					</span>
				</div>
			</div>
		</div>
	)

	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center space-y-4">
				<div class="w-full" id="div_select" name="div_select">
					<div class="flex flex-row justify-start items-center w-full space-x-2">

						<div class="flex flex-col">
							<label for="sel_year" class="block text-sm font-medium text-gray-900 dark:text-white">Year</label>
							<select id="sel_year" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<div class="flex flex-col">
							<label for="sel_momth" class="block text-sm font-medium text-gray-900 dark:text-white">Month</label>
							<select id="sel_momth" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
							</select>
						</div>

						<button type="button" 
								onClick={() => location.href="/admin/balance_account/?year=" + document.getElementById("sel_year").value + "&month=" + document.getElementById("sel_momth").value}
								class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit
									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
							선택
						</button>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 현황"} />
						<dl class="grid grid-cols-3 w-full gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"총 회원 업그레이드 결제"} value={props.data.count.amt_total['0']} unit={"원"} />
							<Div_sub_card title={"부가세 (10%)"} value={props.data.count.amt_tax['0']} unit={"원"} />
							<Div_sub_card title={"토스페이먼츠 수수료 (3.63%)"} value={props.data.count.amt_toss['0']} unit={"원"} />
							<Div_sub_card title={"통계마당 수수료 (10%)"} value={props.data.count.amt_statground['0']} unit={"원"} />
							<Div_sub_card title={"기타소득 세금 (8.8%)"} value={props.data.count.amt_benefit_tax['0']} unit={"원"} />
							<Div_sub_card title={"정산액"} value={props.data.count.amt_result['0']} unit={"원"} />
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 목록"} />

						<dl class="flex flex-col justify-center items-center w-full p-4 mx-auto text-gray-900">
							{payment_list}
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

async function get_main() {
	const data = await fetch("/admin/ajax_get_admin_balance_account/?year=" + year + "&month=" + month)
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

	ReactDOM.render(<Div_main data={data} />, document.getElementById("div_main"))

	var currentYear = new Date().getFullYear(); // 현재 연도를 가져옵니다.
	for (var tempyear = 2015; tempyear <= currentYear; tempyear++) {
		var option = document.createElement("option");
		option.text = tempyear; option.value = tempyear;
		document.getElementById("sel_year").appendChild(option);;
	}


	// 현재 년도 선택
	var select_year = document.getElementById("sel_year");
	for (var i = 0; i < select_year.options.length; i++) {
		if (select_year.options[i].value == year) {
			select_year.selectedIndex = i;
			break;
		}
	}

	// 현재 월 선택
	var select_month = document.getElementById("sel_momth");
	for (var i = 0; i < select_month.options.length; i++) {
		if (select_month.options[i].value == month) {
			select_month.selectedIndex = i;
			break;
		}
	}
}

async function set_main() {
	function Div_check_admin() {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<p>관리자 여부를 확인하고 있습니다.</p>
				</div>
			</div>
		)
	}

	function Div_main_stop() {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
					<p>관리자를 위한 메뉴입니다.</p>
					<a href="/"
					   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						첫 화면으로
					</a>
				</div>
			</div>
		)
	}

	const username = window.gv_username || "";
	if (!username) {
		location.href = "/";
		return;
	}

	const mount = document.getElementById("div_main");
	ReactDOM.render(<Div_check_admin />, mount);

	try {
		const headerData = await fetch("/ajax_get_menu_header/").then((res) => res.json());
		const role = (headerData && headerData.role) ? headerData.role : "";
		window.gv_role = role;

		if (role === "관리자") {
			ReactDOM.render(<Div_main_skeleton />, mount);
			await get_main();
		} else {
			ReactDOM.render(<Div_main_stop />, mount);
		}
	} catch (error) {
		console.error(error);
		mount.innerHTML = '<div class="text-center text-gray-500 py-10">관리자 여부를 확인하는 중 오류가 발생했습니다.</div>';
	}
}
