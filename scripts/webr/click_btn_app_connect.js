async function click_btn_app_connect(name, tag) {
	const request_data = new FormData();
	request_data.append('name', name);
	request_data.append('tag', tag);
	
	const data = await fetch("/webr/ajax_connect_shinyapp/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	window.open(data["url"], name)
}