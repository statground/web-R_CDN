async function get_main() {
	data = await fetch("/admin/ajax_get_admin_members/")
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

	ReactDOM.render(<Div_main data={data} />, document.getElementById("div_main"))
	draw_chart(data.list_monthly, "graph_tab_monthly", "graph_tab_yearly")
}