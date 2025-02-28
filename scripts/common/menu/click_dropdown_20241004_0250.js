function click_dropdown(id) {
	const class_div_sub_menu_pc = "mt-1 bg-white border-gray-200 shadow-sm border-y block md:hidden";
	const class_div_sub_menu_mobile = "flex flex-col w-full justify-center items-start px-[30px] pt-[10px] pb-[20px] space-y-4 border-b-4";
	
	menus.forEach(menu => {
		const toggle_var = `toggle_menu_${menu}`;
		const pc_element = document.getElementById(`div_megamenu_${menu}`);
		const mobile_element = document.getElementById(`div_menu_mobile_${menu}`);
		
		if (id === menu && !window[toggle_var]) {
			pc_element.className = class_div_sub_menu_pc;
			mobile_element.className = class_div_sub_menu_mobile;
			window[toggle_var] = true;
		} else {
			pc_element.className = "hidden";
			mobile_element.className = "hidden";
			window[toggle_var] = false;
		}
	});
}