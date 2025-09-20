function Div_BookMeta({ title, subtitle }) {
	return (
	  <div className="bd-card">
		<div className="bd-row flex items-start">
		  <div>
			<h1 className="bd-title text-2xl font-bold mb-1.5">{title}</h1>
			<p className="bd-sub text-gray-500">{subtitle}</p>
		  </div>
		</div>
	  </div>
	);
}