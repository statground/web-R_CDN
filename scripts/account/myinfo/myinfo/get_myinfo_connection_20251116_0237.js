async function get_myinfo_connection() {
    function Div_tab_connection_content() {
        return (
            <div class="flex flex-col justify-center items-center w-full space-y-4 p-4 md:space-y-0 md:p-0">
                <div id="div_tab_connection_content_cnt_table_shinyapps"
                     class="flex flex-row justify-center items-center w-full h-[260px] md:h-[220px]"></div>
                <div id="div_tab_connection_content_cnt_table_visit"
                     class="flex flex-row justify-center items-center w-full h-[260px] md:h-[220px]"></div>
            </div>
        );
    }

    const tempdata = await fetch("/account/ajax_get_myinfo_connection/")
        .then(res => res.json());

    // Shiny 앱 실행 기록
    data_cnt_table_shinyapp = [];
    const tempdata_cnt_table_shinyapp = tempdata.cnt_table_shinyapp || {};
    for (let i = 0; i < Object.keys(tempdata_cnt_table_shinyapp).length; i++) {
        const obj = tempdata_cnt_table_shinyapp[Object.keys(tempdata_cnt_table_shinyapp)[i]];
        const var_date = obj.date;   // 'YYYY-MM-DD'
        const var_cnt = obj.cnt;
        data_cnt_table_shinyapp.push([var_date, Number(var_cnt)]);
    }

    // 웹사이트 접속 기록
    data_cnt_table_visit = [];
    const tempdata_cnt_table_visit = tempdata.cnt_table_visit || {};
    for (let i = 0; i < Object.keys(tempdata_cnt_table_visit).length; i++) {
        const obj = tempdata_cnt_table_visit[Object.keys(tempdata_cnt_table_visit)[i]];
        const var_date = obj.date;
        const var_cnt = obj.cnt;
        data_cnt_table_visit.push([var_date, Number(var_cnt)]);
    }

    ReactDOM.render(
        <Div_tab_connection_content />,
        document.getElementById("div_tab_connection_content")
    );

    // ECharts 차트 그리기
    if (typeof drawChart_data_cnt_table_shinyapp === "function") {
        drawChart_data_cnt_table_shinyapp();
    }
    if (typeof drawChart_data_cnt_table_visit === "function") {
        drawChart_data_cnt_table_visit();
    }
}
