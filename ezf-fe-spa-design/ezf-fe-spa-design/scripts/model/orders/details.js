define(['utility/map'], function (map) {
            
        
            
        var model = function () {
            var self = this;
            var arg = arguments[0];
            
        this.Phone = function() {
            this.type="CELL";
            this.number="";
         
            map.apply(this, arguments);
        }  
    
        this.Shipping = function() {
            this.carrier="";
            this.methodCode="";
            this.methodName="";
            this.leadTime="";
            this.fulfillRate=null;
            this.estDeliveryCharge=null;
            this.estDeliveryChargeCode="SGD";
            this.estEnhancedCost=null;
            this.liabilityTaken=false;
            this.orderDeclaredValue=null;
            this.orderRetailValue=null;
            this.otherShipmentCategory="";
            this.liabilityValue=null;
            this.estShippingWeight=null;
            this.weightUnits="kg";
            this.categoryOfGoods="";
            this.nonDeliveryInstr="";
            this.deliveryType="";
            
            map.apply(this, arguments);
        }
        
        this.Address = function() {
            this.firstname="";
            this.lastname="";
            this.address1="";
            this.address2="";
            this.city="";
            this.stateCode="";
            this.countryCode="";
            this.postalCode="";
            this.email="";
            this.saveToBook=true;
            this.phone=arguments[0] ? _.map(arguments[0].phone, function(item){ return new self.Phone(item); }) : [new self.Phone()];
            
            map.apply(this, arguments);
        }
        
        this.Customer = function() {
            this.customerEmail="";
            this.customerFirstname="";
            this.customerLastname="";
            this.shippingAddress = arguments[0] ? new self.Address(arguments[0].shipping_address || null) : new self.Address();
            
            map.apply(this, arguments);
        }
        
        this.AdditionalInfo = function() {
            this.additionalInfo1="";
            this.additionalInfo2="";
            this.additionalInfo3="";
            this.additionalInfo4="";
            this.additionalInfo5="";
            this.additionalInfo6="";
            this.additionalInfo7="";
            this.additionalInfo8="";
            this.additionalInfo9="";
            this.additionalInfo10="";
            this.additionalInfo11="";
            this.additionalInfo12="";
            
            map.apply(this, arguments);
        }
            
            
            this.Customs = function() {
                this.customsDescription="";
                this.hsCode=null;
                this.itemDeclaredValue=null;
                this.dvalueCurrencyCode="SGD";
                this.originCountry=null;

                map.apply(this, arguments);
            }  
            
            this.LineItems = function() {
                this.selected=true;
                this.vendorId=null;
                this.warehouseId=null;
                this.quantity=null;
                this.isActive=null;
                this.isExportable=null;
                this.productWeight=null;
                this.productLength=null;
                this.productWidth=null;
                this.productHeight=null;
                this.itemDeclaredValue=null;
                this.weightUnit=null;
                this.merchantSku="";
                this.ezcSku="";
                this.productCode="";
                this.productCodeType="";
                this.marketplaceId=null;
                this.description="";
                this.retailPrice=null;
                this.retailCurrencyCode=null;
                this.costPrice=null;
                this.costCurrencyCode=null;
                this.declaredValue=null;
                this.declaredValueCurrency=null;
                this.customs = arguments[0]? new self.Customs(arguments[0].customs || null):new self.Customs();
                this.qtyFulfillable=null;
                this.qtyDamaged=null;
                this.qtyInShipment=null;

                map.apply(this, arguments);
            }
            
            this.isRemoval=false;
            this.isApproved=false;
            this.isDraft=false;
            this.orderHeaderId=null;
            this.orderStatus=null;
            this.ezcOrderNumber=null;
            this.merchantOrderId=null;
            this.displayableOrderId=null;
            this.displayableDate=null;
            this.processOrderDate=null;
            this.cancelDate=null;
            this.createdDate=null;
            this.modifiedDate=null;
            this.channel="GUI";
            this.customer = arg ? new self.Customer(arg.customer || null) : new self.Customer();
            this.lineItems = arg ? _.map(arg.lineItems, function(item){ return new self.LineItems(item) }) : [];
            this.shipping = arg ? new self.Shipping(arg.shipping || null) : new self.Shipping();
            this.remark="";
            this.history = null;
            this.additionalInfo = arg ? new self.AdditionalInfo(arg.additionalInfo || null) : new self.AdditionalInfo();
            
            map.apply(this, arguments);
        }
        
        return model;
        
    });