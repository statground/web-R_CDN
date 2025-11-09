async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_members/").then(res => res.json());

  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더 직후 차트 (컨테이너 사이즈 확보)
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
}