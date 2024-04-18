function click_dropdown(id) {
	let class_div_sub_menu_pc = "mt-1 bg-white border-gray-200 shadow-sm border-y block md:hidden"
	let class_div_sub_menu_mobile = "flex flex-col w-full justify-center items-start px-[30px] pt-[10px] pb-[20px] space-y-4 border-b-4"

	if (id == "webr" && !toggle_menu_webr) {
		document.getElementById("div_megamenu_webr").className = class_div_sub_menu_pc
		document.getElementById("div_menu_mobile_webr").className = class_div_sub_menu_mobile
		toggle_menu_webr = true
	} else {
		document.getElementById("div_megamenu_webr").className = "hidden"
		document.getElementById("div_menu_mobile_webr").className = "hidden"
		toggle_menu_webr = false
	}

	if (id == "community" && !toggle_menu_community) {
		document.getElementById("div_megamenu_community").className = class_div_sub_menu_pc
		document.getElementById("div_menu_mobile_community").className = class_div_sub_menu_mobile
		toggle_menu_community = true
	} else {
		document.getElementById("div_megamenu_community").className = "hidden"
		document.getElementById("div_menu_mobile_community").className = "hidden"
		toggle_menu_community = false
	}

	if (id == "book" && !toggle_menu_book) {
		document.getElementById("div_megamenu_book").className = class_div_sub_menu_pc
		document.getElementById("div_menu_mobile_book").className = class_div_sub_menu_mobile
		toggle_menu_book = true
	} else {
		document.getElementById("div_megamenu_book").className = "hidden"
		document.getElementById("div_menu_mobile_book").className = "hidden"
		toggle_menu_book = false
	}

	if (id == "workshop" && !toggle_menu_workshop) {
		document.getElementById("div_megamenu_workshop").className = class_div_sub_menu_pc
		document.getElementById("div_menu_mobile_workshop").className = class_div_sub_menu_mobile
		toggle_menu_workshop = true
	} else {
		document.getElementById("div_megamenu_workshop").className = "hidden"
		document.getElementById("div_menu_mobile_workshop").className = "hidden"
		toggle_menu_workshop = false
	}

	if (id == "intro" && !toggle_menu_intro) {
		document.getElementById("div_megamenu_intro").className = class_div_sub_menu_pc
		document.getElementById("div_menu_mobile_intro").className = class_div_sub_menu_mobile
		toggle_menu_intro = true
	} else {
		document.getElementById("div_megamenu_intro").className = "hidden"
		document.getElementById("div_menu_mobile_intro").className = "hidden"
		toggle_menu_intro = false
	}

}