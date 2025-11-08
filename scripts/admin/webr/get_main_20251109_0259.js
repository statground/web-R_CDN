async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_webr/").then(r => r.json());
  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더 완료 후 기본: 월 탭
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
}