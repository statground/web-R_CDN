async function get_main() {
	data = await fetch("/admin/ajax_get_admin_balance_account/?year=" + year + "&month=" + month)
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

	ReactDOM.render(<Div_main data={data} />, document.getElementById("div_main"))

	var years = [];
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