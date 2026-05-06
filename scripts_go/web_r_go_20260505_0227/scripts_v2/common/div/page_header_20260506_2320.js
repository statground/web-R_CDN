(function () {
    function DivPageHeader(props) {
        props = props || {};
        return React.createElement(
            "div",
            { className: "flex flex-row w-full justify-start items-end text-start mb-8" },
            React.createElement(
                "h1",
                { className: "mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl" },
                React.createElement(
                    "span",
                    { className: "underline underline-offset-3 decoration-8 decoration-blue-400" },
                    props.title
                )
            ),
            props.subtitle
                ? React.createElement(
                    "p",
                    { className: "text-lg font-normal text-gray-500 sm:text-md pb-2" },
                    props.subtitle
                )
                : null
        );
    }

    window.WebRComponents = window.WebRComponents || {};
    window.WebRComponents.DivPageHeader = DivPageHeader;
    window.WebRPageHeader = DivPageHeader;
    window.Div_page_header = DivPageHeader;
})();
