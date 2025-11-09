async function get_main() {
  ReactDOM.render(<Div_main_skeleton />, document.getElementById("div_main"));

  try {
    const data = await fetch("/admin/ajax_get_admin_active_users/").then(r => r.json());

    const mount = document.getElementById("div_main");
    ReactDOM.render(
      <Div_main data={data} />,
      mount,
      // ✅ 렌더가 실제로 DOM에 그려진 다음 첫 차트를 그린다.
      () => requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      })
    );
  } catch (e) {
    console.error(e);
    document.getElementById("div_main").innerHTML =
      '<div class="text-center text-gray-500 py-10">데이터를 불러오는 중 오류가 발생했습니다.</div>';
  }
}