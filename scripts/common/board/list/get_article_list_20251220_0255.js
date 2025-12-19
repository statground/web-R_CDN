
// get_article_list_20241230_0537.js (patched)
function handleChangeTab(tab) {
    if (tab === 'all') url = 'all';
    else if (tab === 'free') url = 'free';
    else if (tab === 'rblogger') url = 'rblogger';
    else if (tab === 'notebook') url = 'notebook';
    get_article_list();
}
