'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

function GetTruckerByID(truckId)
{
  //Get the truck with the id
  var truck = undefined;  
  truck = truckers.find(function(element){
    return truckId === element.id;
  });

  return truck;
}

function GetReducedPrice(volume, pricePerVolume)
{
  
    //Calculate the reduced price with the rising volume
    var reducedPrice = pricePerVolume;
    if(volume > 5 && volume < 10)
    {
      reducedPrice *= 0.1;
    }
    else if(volume > 10 && volume < 25)
    {
      reducedPrice *= 0.3;
    }
    else if(volume > 25)
    {
      reducedPrice *= 0.5;
    }
    else
    {
      reducedPrice = 0;
    }
    return reducedPrice;
}

function GetPrice(deliveries, truck, reducedPrice)
{
    //Calculate the price
    return deliveries.distance * truck.pricePerKm 
            + deliveries.volume * (truck.pricePerVolume - reducedPrice);
}

function GetCommission(price, percentage)
{
  return percentage * price;
}

function GetInsurance(commission, percentage)
{
  return commission * percentage;
}

function GetTreasury(distance, perDistance, eurosPerDistance)
{
  return parseInt((distance / perDistance)+1) * eurosPerDistance;
}

function GetConvargoCommission(commission, insurance, treasury)
{
  return commission - insurance - treasury;
}

function GetAssurancePrice(deductibleReduction)
{
  var deductiblePrice = 1000;
    if(deductibleReduction)
    {
        deductiblePrice = 200;
    }

    return deductiblePrice;
}

function GetDeductibleM3Price(deductibleReduction, volume, pricePerVolumeExtra)
{
  var deductibleM3Price = 0;
  if(deductibleReduction)
    {
        //Deductible price per m3
        deductibleM3Price = volume*pricePerVolumeExtra;
    }
  return deductibleM3Price;
}

function CalculateShippingPrices()
{
  var truck = undefined;
  var truckerId = "";

  deliveries.forEach(element => {
    
    truck = GetTruckerByID(element.truckerId);

    var reducedPrice = GetReducedPrice(element.volume, truck.pricePerVolume);

    var price = GetPrice(element, truck, reducedPrice);

    //Calculate the commission
    var commission = GetCommission(price, 0.3);
    var insurance = GetInsurance(commission, 0.5);
    var treasury = GetTreasury(element.distance , 500, 1);
    var convargo = GetConvargoCommission(commission, insurance, treasury);

    //Price in case of accident or theft
    var deductiblePrice = GetAssurancePrice(element.options.deductibleReduction);
    var deductibleM3Price = GetDeductibleM3Price(element.options.deductibleReduction, element.volume, 1);
    
    price += deductibleM3Price;
    convargo += deductibleM3Price;
    
    element.commission.insurance = insurance;
    element.commission.treasury = treasury;
    element.commission.convargo = convargo;

    element.price = price;

    //Pay the users
    actors.forEach(actorEle => {
        if(actorEle.deliveryId == element.id)
        {
          actorEle.payment.forEach(paymentElement => {
            //Find the correct user for each usertype
            switch(paymentElement.who)
            {
              case "shipper":
                paymentElement.amount = price;
                break;
              case "trucker":
                paymentElement.amount = price -deductibleM3Price- commission;
                break;
              case "insurance":
                paymentElement.amount = insurance;
                break;
              case "treasury":
                paymentElement.amount = treasury;
                break;
              case "convargo":
                paymentElement.amount = convargo;
                break;
            }
          });
        }
    });
  });
}

CalculateShippingPrices();

console.log(truckers);
console.log(deliveries);
console.log(actors);
