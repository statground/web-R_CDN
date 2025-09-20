function Div_BookCover({ coverSrc, alt }) {
	return (
	  <aside className="bd-aside">
		<div className="bd-card">
		  <img className="bd-cover w-full rounded-lg" src={coverSrc} alt={alt} />
		</div>
	  </aside>
	);
}