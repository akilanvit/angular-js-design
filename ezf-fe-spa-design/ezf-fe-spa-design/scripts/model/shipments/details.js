define(['utility/map'], function (map) {
            
            var header = function() {
                this.inboundId=0;
                this.inboundCode="";
                this.vendorId=0;
                this.whId=0;
                this.planName="";
                this.fromName="";
                this.address1="";
                this.address2="";
                this.addressCity="";
                this.addressState="";
                this.addressCountry="";
                this.addressPostalCode="";
                this.phone="";
                this.labelBy="";
                this.remarks="";
                this.estShipDate=null;
                this.estArrivalDate=null;
                this.palletsCount=null;
                this.cartonsCount=null;
                this.carrierName="";
                this.trackingNumber="";
                this.status=0;
                this.cancelledDate=null;
                this.transitDate=null;
                this.receivedDate=null;
                this.closedDate=null;
                this.createdBy=0;
                this.createdDate=null;
                this.modifiedBy=null;
                this.modifiedDate=null;
                this.numberOfProducts=0;
                this.numberOfUnits=0;

                map.apply(this, arguments);
        }
            
        var model = function () {
            var self = this;
            var arg = arguments[0];
            this._products = function() {
                this.inboundProductId=0;
                this.inboundId=0;
                this.sku="";
                this.productDesc="";
                this.quantity=null;
                this.labelQuantity=null;
                this.fulFilQty=0;
                this.receivedQty=0;
                this.quarantinedQty=0;
                this.category=null;

                map.apply(this, arguments);
            }
            this.products = arg ? _.map(arg.products, function(product){ return new self._products(product); }) : [];
            this.header= arg ? new header(arg.header || null) : new header();
        }
        
        return model;
        
    });