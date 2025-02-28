const GoogleTagManager = () => {
  React.useEffect(() => {
    const initGTM = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        'event': 'gtm.js'
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TKTGRHZV';
      
      document.getElementsByTagName('script')[0].parentNode.insertBefore(
        script,
        document.getElementsByTagName('script')[0]
      );
    };

    initGTM();
  }, []);

  return null;
};

ReactDOM.render(<GoogleTagManager />, document.getElementById('google-tag-manager'));