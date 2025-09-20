function Div_RecommendedBooks({ books }) {
	return (
	  <div className="bd-card">
		<div className="bd-row">
		  <h2 className="font-semibold text-lg">함께 보면 좋은 책</h2>
		</div>
		<div className="grid grid-cols-4 gap-3 mt-3">
		  {books.map((book, idx) => (
			<a className="bd-book" href={book.link} key={idx} style={{textDecoration:'none',color:'inherit'}}>
			  <div className="bd-aspect">
				<img src={book.cover} alt={book.alt} className="w-full rounded-lg" />
			  </div>
			  <div className="mt-2 text-sm font-semibold leading-snug">{book.title}</div>
			  <div className="bd-small mt-0.5 text-gray-400 text-xs">{book.author}</div>
			</a>
		  ))}
		</div>
	  </div>
	);
}