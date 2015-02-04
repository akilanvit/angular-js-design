define([], function () {
		return restapi  = {
            //Common
            login : {url:'/auth/login', method:'post'},
            logout : {url:'/auth/logout', method:'post'},
            country : {url:'content/country.json', method:'get'},
			currency : {url:'content/currency.json', method:'get'},
            //Dashboard
			dashboard : {url:'content/dashboard.json', method:'get'},
            //Products
			products : {url:'products', method:'get'},
			productscount : {url:'products/status', method:'get'},
			createproducts : {url:'products', method:'post'},
			editproducts : {url:'products', method:'put'},
			importproducts : {url:'products/data-import', method:'get'},
			uploadproducts : {url:'products/data-import', method:'post'},
            suggestproducts : {url:'products/suggest', method:'get'},
            //Shipments
            shipments : {url:'inbounds', method:'get'},
			shipmentscount : {url:'inbounds/status', method:'get'},
            createshipments : {url:'inbounds', method:'post'},
			editshipments : {url:'inbounds', method:'put'},
			importshipments : {url:'inbounds/data-import', method:'get'},
			uploadshipments : {url:'inbounds/data-import', method:'post'},
            suggestshipments : {url:'inbounds/suggest', method:'get'},
            productlabelshipment: {url:'inbounds/print-product-label', method:'get'},
            boxlabelshipment: {url:'inbounds/print-box-label', method:'get'},
            //Orders
			orders : {url:'orders', method:'get'},
			orderscount : {url:'orders/counts', method:'get'},
            createorders : {url:'orders', method:'post'},
			editorders : {url:'orders', method:'put'},
			importorders : {url:'orders/data-import', method:'get'},
			uploadorders : {url:'orders/data-import', method:'post'},
            suggestorders : {url:'orders/suggest', method:'get'},
            orderexists : {url:'orders/exists', method:'get'},
            ordercarriers : {url:'trans/estimate', method:'post'},
            productlabelorder: {url:'orders/print-product-label', method:'get'},
            boxlabelorder: {url:'orders/print-box-label', method:'get'},
		}
});