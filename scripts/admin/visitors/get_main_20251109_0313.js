async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_visitors/").then(res => res.json());

  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더가 끝난 뒤 그래프 그리기 (컨테이너 크기 확보)
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
}