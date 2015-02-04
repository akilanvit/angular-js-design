define(['angularAMD'], function (angularAMD, restapi) {
		angularAMD.factory('$constants', function() {
			var constants = {};

			constants.baseUrl = "";

			constants.productTemplateXlsx = "content/Product Template v7.0.xlsx";
		    
		    constants.productTemplateCsv = "content/Product Template v5.0.csv";
            
            constants.shipmentTemplateXlsx = "content/Shipment Template v7.0.xlsx";
		    
		    constants.shipmentTemplateCsv = "content/Shipment Template v5.0.csv";
            
            constants.orderTemplateXlsx = "content/Order Template v8.0.xlsx";
		    
		    constants.orderTemplateCsv = "content/Order Template v5.0.csv";

		    constants.idleTimeout = 60000;
            
            constants.developerMode = true;

		    constants.notAvailable = "---";
            
            constants.notAvailableText = "NA";
            
            constants.skuNotAvailableText = "SKU not found";
            
            constants.unidentified = "Unidentified";
            
            constants.uploadproductsocket = "http://ezycommerce.spek-tek.com:8012";
            
            constants.internationalInsuranceCost = 7.50;
            
            constants.domesticInsuranceCost = 5.00;
            
            constants.uploadproductsocketkey = "56afv5l0l155ikcc82yt418582zaxzukuq5o8nt1-1";
            
            constants.currentLocation = "SG";

		    constants.validationMessages = {
		    	required : "This field is required",
		    	invalidnumber : "This field requires number",
		    	invalidweight : "Weight should be less than 30 kg and maximum of 2 decimals",
		    	invalidhscode : "Minimum 6 digit number required",
		    	invalidemail : "Invalid Email",
                invalidphone : "Invalid Phone Number",
                EAN : "8 or 13 digits required",
                JAN : "7 or 9 digits required",
                UPC : "12 digits required",
                ISBN : "13 digits required"
		    }

		    constants.productFilterOptions = [{name:"All", value:"all", ticked: true },{name:"EZY-SKU", value:"fbspsku"},{name:"Merchant SKU", value:"mercsku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"}];
            
            constants.productSortingOptions = [{name:"EZY-Sku", value:"fbspSkuId" },{name:"Created Date", value:"createdDate"},{name:"Merchant SKU", value:"sku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"},{name: "Alert Level", value:"inventoryAlertLevel"},{name: "Inbound", value:"qtyInShipment"},{name: "Damaged", value:"qtyDamaged"},{name: "Fulfillable", value:"qtyFulfillable"},{name: "Date Since Inactive", value:"dateInActive"},{name: "Product Name", value:"productName"},{name: "Category", value:"mainProductCategory"},{name: "Modified Date", value:"modifiedDate"}];
            
            constants.shipmentSortingOptions = [{name:"Date Created", value:"createdDate" },{name:"Shipment ID", value:"inboundCode"},{name:"Plan Name", value:"planName"}, {name:"Who Labels?", value:"labelBy"}, {name: "Remarks", value:"remarks"}];

            //constants.ordersSortingOptions = [{name:"EZY-Sku", value:"fbspSkuId" },{name:"Created Date", value:"createdDate"},{name:"Merchant SKU", value:"sku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"},{name: "Alert Level", value:"inventoryAlertLevel"},{name: "Inbound", value:"qtyInShipment"},{name: "Damaged", value:"qtyDamaged"},{name: "Fulfillable", value:"qtyFulfillable"},{name: "Date Since Inactive", value:"dateInActive"},{name: "Product Name", value:"productName"},{name: "Category", value:"mainProductCategory"}];
            
            constants.ordersSortingOptions = [{name:"Merchant Order Id",value:"merchantOrderId"},{name:"Fulfillable Order Id",value:"ezcOrderNumber"},{name:"Created Date",value:"createdDate"}]
            
            constants.shipmentFilterOptions = [{name:"All", value:"all", ticked: true },{name:"Shipment ID", value:"inbound_code"},{name:"Plan Name", value:"plan_name"},{name:"EZY-SKU", value:"sku"},{name:"Merchant SKU", value:"merchant_sku"}, {name:"Product ID", value:"product_id"}];
            
            constants.orderFilterOptions = [{name:"All", value:"all", ticked: true },{name:"EZY Order ID", value:"ezcOrderId"},{name:"Merchant Order ID", value:"merchOrderId"},{name:"Customer Name", value:"custName"}, {name:"Merchant SKU", value:"merchSku"},{name:"EZY SKU", value:"ezcSku"}, {name:"Product Code", value:"prodCode"}];
            
		    constants.productStatus = [{name:"all", value:"-1"},{name:"active", value:"1"},{name:"inactive", value:"2"},{name:"archived", value:"3"}];
            
            constants.shipmentStatus = [{name:"all", value:"-1", display:"All"},{name:"pending", value:"1", display:"Pending"},{name:"intransit", value:"2", display:"In Transit"},{name:"received", value:"3", display:"Received"},{name:"closed", value:"4", display:"Closed"},{name:"cancelled", value:"5", display:"Cancelled"}];
            
            constants.orderStatus = [{name:"all", value:"ALL", display:"All"},{name:"returns", value:"RETURN", display:"Order Return"},{name:"removal", value:"REMOVAL", display:"Removal Order"},{name:"pending", value:"PENDING", display:"Pending"},{name:"hasissues", value:"HAS_ISSUES", display:"Has Issues"},{name:"unapproved", value:"UNAPPROVED", display:"Unapproved"},{name:"inprocess", value:"IN_PROCESS", display:"In Process"},{name:"fulfillment", value:"FULFILLMENT", display:"Fulfillment"},{name:"shipped", value:"SHIPPED", display:"Shipped"},{name:"delivered", value:"DELIVERED", display:"Delivered"},{name:"drafts", value:"DRAFT", display:"Drafts"},{name:"cancelled", value:"CANCELLED", display:"Cancelled"}];
            
            constants.orderTypeOptions = [{name:"Order Type", value:"none", label:true},{name:"All", value:"all"},{name:"Domestic", value:"1"},{name:"International", value:"0"}];
            
            constants.orderSortingMapping = [{name:"merchantId", value:"merchId"},{name:"ezcOrderNumber", value:"ezcOrderId"},{name:"merchantOrderId", value:"merchOrderId"},{name:"displayableDate", value:"displayableDate"},{name:"processOrderDate", value:"processOrderDate"},{name:"shipping.methodName", value:"deliveryOption"},{name:"channel", value:"channel"},{name:"customerFirstname", value:"custName"},{name:"modifiedDate", value:"modifiedDate"},{name:"createdDate", value:"createdDate"},{name:"customer.shippingAddress.address1", value:"address"},{name:"remark", value:"remark"},{name:"lineItems", value:"lineCount"},{name:"lineItemsUnits", value:"itemCount"},{name:"cancelledDate", value:"cancelledDate"},{name:"merchSku", value:"merchSku"},{name:"ezcSku", value:"ezcSku"},{name:"prodCode", value:"prodCode"}, {name:"shipping.methodCode", value:"methodCode"}];
            
            constants.orderInventoryOptions = [{name:"Inventory Type", value:"none", label:true},{name:"All", value:"all"},{name:"Inventory", value:"1"},{name:"Out of Stock", value:"0"}];
            
            constants.orderChannelOptions = [{name:"Order Channel", value:"none", label:true},{name:"All", value:"all"},{name:"File", value:"FILE"},{name:"GUI", value:"GUI"},{name:"EBAY", value:"EBAY"}];
            
            constants.domesticShippingOptions = [{name:"Domestic Standard", value:"IWPPSD", leadTime:"1-2 Days", cost: "7.50", currency: "$", ticked: true, carrier : "EZY2SHIP" },{name:"Domestic Economy", value:"IWPPSD", leadTime:"3-4 Days", cost: "4.50", currency: "$", ticked: false, carrier : "EZY2SHIP" }];
            
            constants.internationalShippingOptions = [{name:"International Standard", value:"IWPPSD", leadTime:"5-7 Days", cost: "35.00", currency: "$", ticked: true, carrier : "EZY2SHIP" },{name:"International Priority", value:"IWPPSD", leadTime:"1-2 Days", cost: "89.50", currency: "$", ticked: false, carrier : "EZY2SHIP" },{name:"International Economy", value:"IWPPSD", leadTime:"3-4 Days", cost: "60.50", currency: "$", ticked: false, carrier : "EZY2SHIP" }];
            
            constants.orderShipCategory = [{name:"Document", value:"D"},{name:"Merchandise", value:"M"},{name:"Sample", value:"S"},{name:"Others", value:"O"}];
            
            constants.orderDeliveryInstruction = [{name:"Treat as Abandoned", value:"T"},{name:"Return to Sender", value:"R"}];
            
            constants.fileStatus = [{name:"Processing", value:"0"},{name:"Success", value:"1"},{name:"Error", value:"2"}];
            
		    constants.codeType = [{name:"EAN", value:"EAN",validationlength:[8,13]},{name:"JAN", value:"JAN",validationlength:[7,9]},{name:"UPC", value:"UPC",validationlength:[12]},{name:"ISBN", value:"ISBN",validationlength:[13]}];

		    constants.dateOptions = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"1d"},{name:"Yesterday", value:"-1d"},{name:"Last 7 Days", value:"-7d"}, {name:"Last 30 Days", value:"-30d"}, {name: "This Month", value:"1m"}, {name: "Last Month", value:"-1m"}, {name: "Custom Range", value:"custom"}];
            
            constants.orderDateOptions = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"0d"},{name:"Yesterday", value:"1d"},{name:"Last 7 Days", value:"7d"}, {name:"Last 30 Days", value:"30d"}, {name: "This Month", value:"0m"}, {name: "Last Month", value:"1m"}, {name: "Custom Range", value:"custom"}]; 


	        constants.inventoryOptions = [{name:"Inventory", value:"none", label:true},{name:"All", value:"all"},{name:"Out of Stock", value:"1"},{name:"Below Alert Level", value:"2"},{name:"Damaged", value:"3"}]; 

	        constants.categoryOptions = [{name:"Electronics", value:"A" },{name:"Apparel", value:"B"},{name:"Baby", value:"C"},{name:"Toys", value:"D"},{name:"Home and Life Style", value:"E" },{name:"Kitchen", value:"F"},{name:"Sports", value:"G"},{name:"Fashion", value:"H"},{name:"Shoes", value:"I"},{name:"Footwear", value:"J"},{name:"Beauty and health", value:"K" },{name:"Travel", value:"L"},{name:"Accessories", value:"M"},{name:"Others", value:"N"}]; 
            
            constants.labelList = [{name:"Merchant", value:"M" },{name:"Warehouse", value:"W"}];
            
            constants.productLabelList = [{name:"21.2mm x 45.7mm, 48 labels/sheet on A4, Avery®6102", value:"6102"},{name:"25.4mm x 66.6mm, 30 labels/sheet on US Letter, Avery®5160", value:"5160"},{name:"29.6mm x 63.5mm, 27 labels/sheet on A4, Avery®6104", value:"6104"},{name:"38.1mm x 63.5mm, 21 labels/sheet on A4, Avery®J8160", value:"J8160"},{name:"21.2mm x 45.7mm, 1 label/sheet on Plain paper", value:"1"}];
            
            constants.boxLabelList = [{name:"3.33” x 4”, 6 labels/sheet on US Letter, Avery®5164", value:"5164"},{name:"3.66” x 3.9”, 6 labels/sheet on A4, Avery®J8166", value:"J8166"},{name:"6” x 4”, 1 label/sheet on Plain paper", value:"2"}];

		    return constants;
		});
});