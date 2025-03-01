async function get_div_main_statistics(){
    function Div_sub(props) {
        return (
            <div id="toast-simple" class="flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow" role="alert">
            <img src={props.svg} class="w-6 h-6" />
                <div class="pl-4 text-sm font-normal">
                    <div class="pl-4 text-md font-bold">{props.title}</div>
                    <div class="pl-4 text-sm font-normal">{props.content.toLocaleString()}{props.unit}</div>
                </div>
            </div>
        )
    }

    function Div_result(props) {
        return (
            <div class="grid lg:grid-cols-3 md:grid-cols-1 mx-auto">
                <Div_sub title="총 가입자 수" content={props.data.cnt_member} unit="명" 
                        svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg" />
                <br/>
                <Div_sub title="오늘의 방문자 수" content={props.data.cnt_visitor} unit="명" 
                        svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg" />
                <br/>
                <Div_sub title="오늘의 페이지 뷰" content={props.data.cnt_pageview} unit="건" 
                        svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg" />
            </div>
        )
    }

    const data = await fetch("/ajax_index_statistics/")
                        .then(res=> { return res.json(); })
                        .then(res=> { return res; });

    ReactDOM.render(<Div_result data={data} />, document.getElementById("div_main_statistics"))
}        