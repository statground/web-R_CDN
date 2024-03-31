async function insert_visit_log() {
	//const hostdata = JSON.stringify({host: window.location.href.toString()})
	const data = new FormData();
	data.append('host', window.location.href.toString());
	let _navigator = {};
	for (var i in navigator) _navigator[i] = navigator[i];
	data.append('navigator', JSON.stringify(_navigator));

	await fetch("/blank/ajax_insert_visit_log/", {
					method: "post", 
					headers: {
						"X-CSRFToken": getCookie("csrftoken"),
					},
					body: data
				})
		.then(res=> { return res.json(); })
		.then(res=> { return res; });
}

insert_visit_log()