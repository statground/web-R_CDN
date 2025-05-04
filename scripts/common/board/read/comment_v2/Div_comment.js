// Component: Single Comment (depth1 or depth2)
function Div_comment(props) {
    const isDepth2 = props.depth === 2;
    // Highlight background if comment author is the article writer
    const bgColorClass = (props.data.user_writer == 1)
        ? (isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50")
        : (isDepth2 ? "bg-gray-200 border border-gray-700" : "bg-gray-100");
    // Nested replies list (if any, only for depth1 comments)
    const replyList = !isDepth2 && Object.keys(props.data.rereply || {}).map(key => 
        <Div_comment data={props.data.rereply[key]} depth={2} />
    );
    return (
        <article class={"p-6 " + (isDepth2 ? "ml-4" : "") + " text-base " + bgColorClass + " rounded-xl w-full space-y-2"}>
            {/* Comment header */}
            <div class="flex justify-between items-center space-x-2">
                <Div_comment_header data={props.data} />
            </div>
            {/* Comment content (rendered by ToastUI Editor in viewer mode) */}
            <div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>
            {/* Attached file link, if any */}
            { props.data.file_url &&
                <div class="flex flex-row justify-start items-center space-x-2 text-sm hover:underline">
                    <p>
                        <svg class="w-4 h-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
                            <path d="M41 4H7C5.34315 4 4 5.34315 4 7V41C4 42.6569 5.34315 44 7 44H41C42.6569 44 44 42.6569 44 41V7C44 5.34315 42.6569 4 41 4Z" fill="#2F88FF" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
                            <path d="M34 4V22H15V4H34Z" fill="#43CCF8" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
                            <path d="M29 11V15" stroke="#000" stroke-width="4" stroke-linecap="round"/>
                            <path d="M11.9969 4H36.9985" stroke="#000" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </p>
                    <a href={window.location.protocol + "//" + window.location.host + "/" + props.data.file_url} target="_blank" rel="noopener">{props.data.file_name}</a>
                </div>
            }
            {/* Action buttons (Reply/Edit/Delete) */}
            <div class="w-full" id={"div_comment_footer_" + props.data.uuid}>
                <Div_comment_button_list data={props.data} depth={props.depth} />
            </div>
            {/* Render nested replies (depth2) if any */}
            { replyList }
            {/* Hidden reply form container for depth1 comments */}
            { !isDepth2 &&
                <div id={"div_community_read_comment_new_" + props.data.uuid} class="hidden">
                    <Div_comment_form title={"대댓글 쓰기"} class={"mt-4 p-4 bg-white rounded-lg w-full space-y-2"} uuid_comment={props.data.uuid} />
                </div>
            }
        </article>
    );
}
