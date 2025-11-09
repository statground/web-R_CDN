async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_payments/").then(res => res.json());

  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더 완료 직후 컨테이너가 보이는 타이밍에 그리기
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
}
