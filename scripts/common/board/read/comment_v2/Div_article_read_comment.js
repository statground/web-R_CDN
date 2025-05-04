// Component: Main comment section (list of comments and new comment form)
function Div_article_read_comment(props) {
    const commentCount = props.data.length || Object.keys(props.data).length;
    const commentList = Object.keys(props.data).map(key => 
        <Div_comment data={props.data[key]} depth={1} />
    );
    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg lg:text-2xl font-bold text-gray-900">댓글 ({commentCount})</h2>
                </div>
                <form class="mb-6">
                    <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
                        {/* Placeholder for new comment content editor (ToastUI Editor will mount here) */}
                        <div id="div_comment_new" class="w-full"></div>
                    </div>
                </form>
                <div class="flex flex-col justify-center items-end w-full space-y-2">
                    {commentList}
                </div>
                {/* New comment form (visible only if user is logged in) */}
                { gv_username !== '' &&
                    <div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" id="div_community_read_comment_new">
                        <Div_comment_form title={"댓글 쓰기"} class={"w-full space-y-2"} uuid_comment={null} />
                    </div>
                }
            </div>
        </section>
    );
}
