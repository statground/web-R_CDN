// 개별 데이터에서 min/max 날짜 가져오기
function getRangeFromData(data) {
    if (!data || data.length === 0) return null;

    let minDate = data[0][0];
    let maxDate = data[0][0];

    for (let i = 0; i < data.length; i++) {
        const d = data[i][0];   // 'YYYY-MM-DD'
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
    }
    return { minDate, maxDate };
}

// 두 차트(Shiny, 방문)의 전체 날짜 범위(공통 범위) 계산
function getGlobalRange() {
    const rangeShiny = getRangeFromData(data_cnt_table_shinyapp);
    const rangeVisit = getRangeFromData(data_cnt_table_visit);

    if (!rangeShiny && !rangeVisit) return null;
    if (rangeShiny && !rangeVisit) return rangeShiny;
    if (!rangeShiny && rangeVisit) return rangeVisit;

    const minDate = (rangeShiny.minDate < rangeVisit.minDate)
        ? rangeShiny.minDate
        : rangeVisit.minDate;

    const maxDate = (rangeShiny.maxDate > rangeVisit.maxDate)
        ? rangeShiny.maxDate
        : rangeVisit.maxDate;

    return { minDate, maxDate };
}

function buildCalendarOption(title, data, globalRange) {
    // 데이터가 없을 때
    if (!data || data.length === 0) {
        return {
            title: {
                text: title,
                left: 'center',
                top: 16,
                textStyle: { fontSize: 13, fontWeight: 'bold' }
            },
            graphic: {
                type: 'text',
                left: 'center',
                top: 'middle',
                style: {
                    text: '표시할 데이터가 없습니다.',
                    fontSize: 12,
                    fill: '#9ca3af'
                }
            }
        };
    }

    // 최대 cnt
    let maxCnt = 0;
    for (let i = 0; i < data.length; i++) {
        const c = Number(data[i][1] || 0);
        if (c > maxCnt) maxCnt = c;
    }

    // 범위: 되도록 둘 다 같은 범위(globalRange), 없으면 자기 데이터 기준
    let minDate, maxDate;
    if (globalRange) {
        minDate = globalRange.minDate;
        maxDate = globalRange.maxDate;
    } else {
        const ownRange = getRangeFromData(data);
        minDate = ownRange.minDate;
        maxDate = ownRange.maxDate;
    }

    return {
        title: {
            text: title,
            left: 'center',
            top: 16,
            textStyle: { fontSize: 13, fontWeight: 'bold' }
        },
        tooltip: {
            position: 'top',
            formatter: function (p) {
                const value = p.value;
                return value[0] + '<br/>횟수: ' + value[1] + '회';
            }
        },
        // 🔹 레전드(visualMap)를 위로 올리고
        // 🔹 캘린더는 더 아래에서 시작해서 서로 안 겹치게
        visualMap: {
            min: 0,
            max: maxCnt || 1,
            calculable: false,
            orient: 'horizontal',
            left: 'center',
            top: 26   // 이전보다 위로
        },
        calendar: {
            top: 95,   // 이전보다 많이 아래에서 시작
            left: 40,
            right: 20,
            cellSize: ['auto', 16],
            range: [minDate, maxDate],
            itemStyle: {
                borderWidth: 0.5,
                borderColor: '#e5e7eb'
            },
            yearLabel: { show: false },
            monthLabel: { nameMap: 'en', margin: 18 },
            dayLabel: { firstDay: 0, nameMap: ['일','월','화','수','목','금','토'] }
        },
        series: [
            {
                name: title,
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: data
            }
        ]
    };
}

function drawCalendarChart(domId, title, data, globalRange) {
    const dom = document.getElementById(domId);
    if (!dom || typeof echarts === 'undefined') {
        return;
    }
    const chart = echarts.init(dom);
    const option = buildCalendarOption(title, data, globalRange);
    chart.setOption(option);
    window.addEventListener('resize', function () {
        chart.resize();
    });
}

// Shiny 앱 실행 기록
function drawChart_data_cnt_table_shinyapp() {
    const globalRange = getGlobalRange();
    drawCalendarChart(
        'div_tab_connection_content_cnt_table_shinyapps',
        'Shiny 앱 실행 기록',
        data_cnt_table_shinyapp,
        globalRange
    );
}

// 웹사이트 접속 기록
function drawChart_data_cnt_table_visit() {
    const globalRange = getGlobalRange();
    drawCalendarChart(
        'div_tab_connection_content_cnt_table_visit',
        '웹사이트 접속 기록',
        data_cnt_table_visit,
        globalRange
    );
}