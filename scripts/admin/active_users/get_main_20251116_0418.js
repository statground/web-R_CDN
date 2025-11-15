async function get_main() {
  ReactDOM.render(<Div_main_skeleton />, document.getElementById("div_main"));

  try {
    const data = await fetch("/admin/ajax_get_admin_active_users/").then(function (r) {
      return r.json();
    });

    const mount = document.getElementById("div_main");
    ReactDOM.render(
      <Div_main data={data} />,
      mount
    );
  } catch (e) {
    console.error(e);
    document.getElementById("div_main").innerHTML =
      '<div class="text-center text-gray-500 py-10">데이터를 불러오는 중 오류가 발생했습니다.</div>';
  }
}
