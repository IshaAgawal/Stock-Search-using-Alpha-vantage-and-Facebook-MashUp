var app = angular.module('stockModule',['ngAnimate']);



app.controller('stockCtrl',['$scope','$q', '$http', '$filter' , 'stockService', function($scope,$q, $http, $filter, stockService){


	app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});
    
 
    
    
    $scope.init = function() {
        
        $scope.error = false;
        $scope.loading = false;
        $scope.stockSymbol = "";
        $scope.hideTable = true;  
        $scope.stockSuggestions = "";
        $scope.parameter = 'default';
        $scope.sortedOrder = 'ascending';
        $scope.whichAreaToShow = 'fav';
        
        $scope.firstTime = true;
        
        $scope.chartDetail = "";
        
        $scope.autocompleteValues = [];
        
//         var localDate = new moment();
//            
//              console.log('After hAPPY Today');
//            
//             console.log(localDate);
//        
        
   //     $scope.favShow = true;
        //$scope.items = localStorage.getItem;
        
         $scope.result= {};
        
    for (var i = 0; i < localStorage.length; i++){
    
    details=JSON.parse(localStorage.getItem(localStorage.key(i)))
        
     $scope.result[localStorage.key(i)]={symbol :details[0],stockPrice: details[1],change:details[2],changePercent1:details[3], color:details[4], imageURL:details[5], volume:details[6], volume1:details[7], changePercent: details[8]}
        
         //$scope.result[localStorage.key(i)] = [details[0],details[1],details[2],details[3], details[4], details[5], details[6]] ;
    }
     
      
  }
    
   
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '136344850464256',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
    
    
    
    $scope.fbshare = function(url,name){
  	//alert(url)
  	//alert(name)
    FB.ui({
      app_id: '136344850464256',
      method:'feed',
      display:'popup',
      link: window.location.href,
      picture: url,
      name: name,
      caption: "FB POST FROM USC CSCI571",
      }, function(response){
      if (response && !response.error_message)
        alert("Posted Successfully");
      else 
        alert("Not Posted");
      });

    }


    
 $scope.setStockValue = function(val) {
     
        val = val.split(' ');
        
        $scope.stockSymbol = val[0];
    }
    
    $scope.toshowSuggesstions = function() {
        
        
        if($scope.stockSymbol != null && $scope.stockSymbol.length > 0 && $scope.autocompleteValues[$scope.stockSymbol].length > 0) { 
            
            var k = 0;
            
            $scope.suggestions = [];
            
            var l = $scope.autocompleteValues[$scope.stockSymbol.charAt(0)].length;
            
            for(k = 0 ; k < 5 && k < l; k++) {
                
                 $scope.suggestions.push($scope.autocompleteValues[$scope.stockSymbol.charAt(0)][k]);
                
            }
            
            $scope.suggestions = $scope.autocompleteValues[$scope.stockSymbol];
            return true;
            
        }
        else
            return false;
    }
    
    $scope.clear = function() {
        
        $scope.clearFlag = true;
        
        $scope.init();
    }
    
    $scope.resultAreaClick = function() {
        
        $scope.whichAreaToShow='fav';
       //  $scope.favShow = true;
    }
    
    
      $scope.favAreaClick = function() {
        
        $scope.whichAreaToShow='resultArea';
         //  $scope.favShow = false;
    }


	$scope.validateInput = function() {
	
		if($scope.firstTime == false && ($scope.stockSymbol == "" ||  ($scope.stockSymbol).length == 0)){
           $scope.error = true;
            
        }
        
           $scope.firstTime = false;
        
           if($scope.clearFlag == true){
            $scope.clearFlag = false;
        }
    }
    
$scope.fetchNewsData = function(response) {
    
     $scope.newsItems = Object.values(response.data.rss.channel)[0]["item"];
       
        var len =  $scope.newsItems.length;
        var count = 0;
          
           var newsData = new Array(5);
          for(i = 0 ; i < len && count < 5; i++) {
              
              var link = $scope.newsItems[i]["link"][0];
              
              if ((link).includes("article") == true) {
                  
              
              
            var title = $scope.newsItems[i]["title"][0];
              
            var authorName = $scope.newsItems[i]["sa:author_name"];
              
            var pubDate = $scope.newsItems[i]["pubDate"];
              
              
              
              var info = [title, link, authorName, pubDate];
              console.log(info);
                  
              newsData[count] = info;
              count++;
              }
          }
          
          console.log(newsData);
          
          $scope.newsList = newsData;
    
}

$scope.createHistoricalChart = function() {
    
    
 var processed_json = new Array();
   
    var symbol = Object.values($scope.priceChartData["Meta Data"])[1];

   
    var indicatorData =Object.values($scope.priceChartData)[1];
    
    
    var data = Object.values(Object.values(indicatorData));
    var dates = Object.keys(indicatorData);
   
    var stock_price = new Array();
   
    
    var k = 0;

 
    for (i = 0; i < data.length && k < 200; i++) {
        var j = Object.values(data[i])[3];
        stock_price.push(parseFloat((j).substring(0,5))); 
        
         }
  
   
    var titleData = symbol.concat(" Stock Value");
        
  //  titleDate = titleDate.concat((mm.concat("/")).concat((dd.concat("/")).concat(yy)).concat(")")) ;
    
     Highcharts.stockChart('historicalChart', {
         
       rangeSelector: {
			buttons: [{
				type: 'month',
				count: 1,
				text: '1m',
				
			}, {
				type: 'month',
				count: 3,
				text: '3m'
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'all',
				text: 'All'
			}]
},

        title: {
            text: titleData
        },
          subtitle: {
                text: '<a href="https://www.alphavantage.co/" style="color: blue" target="_blank">Source: Alpha Vantage</a>',
                useHTML: true
            },
         
         xAxis: {
                categories: dates,
               
                reversed: true,
            },

            yAxis: [{ //Primary yAxis
                title: {
                    text: 'Stock Value'
                },
                  opposite: true

            }],
        
        series: [{
           type: 'area',
                name: symbol,
               
                data: stock_price,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
         
        
        });
    
}

$scope.createStockPriceChart = function() {
    
    
    
    var processed_json = new Array();
   
    var symbol = Object.values($scope.priceChartData["Meta Data"])[1];
    
  
    
   var companysymbolVol = symbol.concat(" Volume");
   
    var indicatorData =Object.values($scope.priceChartData)[1];
    
    
    var data = Object.values(Object.values(indicatorData));
    var dates = Object.keys(indicatorData);
    var processed_dates = new Array();
    var stock_price = new Array();
    var stock_volume = new Array();
    
    var k = 0;

   for (i = 0; i < dates.length && k < 200; i++) {  
       
      var datestring = dates[i];
      var mm = datestring.substring(5,7);
      var dd = datestring.substring(8,10);
      var dateInMMDD = (mm.concat("/")).concat(dd);
      processed_dates.push(dateInMMDD);
      k++;
    }
    
     k = 0;
  
    var maxY = 0;
    for (i = 0; i < data.length && k < 200; i++) {
        var j = Object.values(data[i])[3];
        stock_price.push(parseFloat((j).substring(0,5))); 
        
        var v = parseInt(j);
        
        j = parseInt(Object.values(data[i])[4]);
        
        
        if(j > maxY)
            maxY = j;
        
        stock_volume.push(j);
        k++;
    }
  
      maxY = maxY * 3;
      var datestring = dates[0];
      var yy = datestring.substring(0,4);
      var mm = datestring.substring(5,7);
      var dd = datestring.substring(8,10);
    
    
    var titleData = symbol.concat(" Stock Price and Volume");
        
  //  titleDate = titleDate.concat((mm.concat("/")).concat((dd.concat("/")).concat(yy)).concat(")")) ;
    
     Highcharts.chart('chartContainer', {
         
          
            chart: {
                
                zoomType: 'x',
                
                panning: true,
                panKey: 'shift'
            },
            title: {
                text: titleData
            },

            subtitle: {
                text: '<a href="https://www.alphavantage.co/" style="color: blue" target="_blank">Source: Alpha Vantage</a>',
                useHTML: true
            },
        plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1
                    },
                }
            },
   

            xAxis: {
                categories: processed_dates,
                tickInterval : 5,
                label: {
                    step: 1
                 },
                reversed: true,
            },

            yAxis: [{ //Primary yAxis
                title: {
                    text: 'Stock Price',
                }

            },{ //Secondary yAxis
                title: {
                    text: 'Volume',
                },
                opposite: true,
                max: maxY
            }],

          legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
            series: [{
                type: 'area',
                name: symbol,
                color: '#8A2BE2',
                data: stock_price
            },
            {
                type: 'column',
                name: companysymbolVol,
                yAxis: 1,
                color: '#FF0000',
                data: stock_volume
            }]

        });
    
    
    
    
    
}

$scope.fetchIndicatorData = function(yVal, response) {
    
     $scope.processed_json = new Array();
     $scope.indicatorData = response;
     $scope.indicator = $scope.indicatorData["Meta Data"]["2: Indicator"];
     var indicatorData = Object.values($scope.indicatorData)[1];
     $scope.yaxisData = yVal;
     
     
    var data = Object.values(Object.values(indicatorData));
    var dates = Object.keys(indicatorData);
    $scope.processed_dates = new Array();
  
    
    var k = 0;

   for (i = 0; i < dates.length && k < 126; i++) {       
      
      var datestring = dates[i];
      var mm = datestring.substring(5,7);
      var dd = datestring.substring(8,10);
      var dateInMMDD = (mm.concat("/")).concat(dd);
      $scope.processed_dates.push(dateInMMDD);
      k++;
    }
    
    k = 0;

    for (i = 0; i < data.length && k < 126; i++) {
        var j = Object.values(data[i])[0];
        $scope.processed_json.push(parseFloat((j).substring(0,5))); 
        
       
        k++;
    }
     
     
        Highcharts.chart('chartContainer', {
            
            chart: {
                
                zoomType: 'x',
                
                panning: true,
                panKey: 'shift'
            },
        
      
plotOptions: {


    series: {
     marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2.5
            },
        color: '#ef2400'
  }
            
},
   
        title: {
            text: $scope.indicator
        },
        subtitle: {
            
            text: '<a href="https://www.alphavantage.co/" style="color: blue" target="_blank">Source: Alpha Vantage</a>',
             useHTML: true
        },
          xAxis: {      
         categories: $scope.processed_dates,
               reversed: true,
              tickInterval: 5
        },
        yAxis: {
            title: {
                text: $scope.yaxisData
            }
        },
        legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
       
        series: [{
            name:  $scope.stockSymbol,
            type: 'line',
            color: '#FF0000',
            data: $scope.processed_json,
             marker: {
            enabled: true
        }

           
        }
    ]
    });

}



 $scope.fetchSMAData = function() {
     
     $scope.fetchIndicatorData("SMA", $scope.smaChartData);
     
 }
 
 $scope.fetchEMAData = function() {
     
     $scope.fetchIndicatorData("EMA", $scope.emaChartData);
     
 }
 
 $scope.fetchRSIData = function(response) {
     
     $scope.fetchIndicatorData("RSI", $scope.rsiChartData);
   
 }
 
 $scope.fetchADXData = function(response) {
     
     $scope.fetchIndicatorData("ADX", $scope.adxChartData);
   
 }
 
 $scope.fetchCCIData = function(response) {
     
     $scope.fetchIndicatorData("CCI", $scope.cciChartData);
   
 }
 
 $scope.createStochChart = function() {
     
    var stochData = $scope.stochChartData;
    var processed_json_slowK = new Array();
    var processed_json_slowD = new Array();    
    var symbol = stochData["Meta Data"]["1: Symbol"];   // MSFT, etc.
    var indicator = stochData["Meta Data"]["2: Indicator"]; 
    
    var indicatorSplitBySpace = indicator.split(" ");
    var symbolKey = indicatorSplitBySpace[indicatorSplitBySpace.length-1];
    
    var yaxisData = symbolKey.slice(1,-1);
    
    
    var indicatorData =Object.values(stochData)[1];
    var data = Object.values(Object.values(indicatorData));
    var dates = Object.keys(indicatorData);
    var processed_dates = new Array();
    var k = 0;

   for (i = 0; i < dates.length && k < 126; i++) {       
      var datestring = dates[i];
      var mm = datestring.substring(5,7);
      var dd = datestring.substring(8,10);
      var dateInMMDD = (mm.concat("/")).concat(dd);
      processed_dates.push(dateInMMDD);
       k++;
  }
    
    k = 0;

    for (i = 0; i < data.length && k < 126; i++) {
        var j = Object.values(data[i])[0];
        processed_json_slowK.push(parseFloat((j).substring(0,5))); 
        j = Object.values(data[i])[1];
        processed_json_slowD.push(parseFloat((j).substring(0,5))); 
        k++;
    }
        
        var symbol1 = symbol.concat(" ").concat("SlowK");
        var symbol2 = symbol.concat(" ").concat("SlowD");

       
Highcharts.chart('chartContainer', {
    
     
            chart: {
                
                zoomType: 'x',
                
                panning: true,
                panKey: 'shift'
            },
        
      
plotOptions: {


    series: {
     marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2.5
            },
        color: '#ef2400'
  }
            
},
   
        title: {
            text: indicator
        },
        subtitle: {
            text: '<a href="https://www.alphavantage.co/" style="color: blue" target="_blank">Source: Alpha Vantage</a>',
            useHTML: true
        },
          xAxis: {      
         categories: processed_dates,
               reversed: true,
              tickInterval: 5
        },
        yAxis: {
            title: {
                text: yaxisData
            }
        },
        legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
       
        series: [{
            name:  symbol1,
            type: 'line',
            color: '#FF0000',
            data: processed_json_slowK,
             marker: {
            enabled: true
        }

           
        },
       {
            name:  symbol2,
            type: 'line',
            color: '#ADDFFF',
            data: processed_json_slowD,
            marker: {
            enabled: true
        }

        }
    ]
    });
     
 }
 
 $scope.createChartWithThreeSeries = function(containerName) {
     
       var jsonObj;
     
     if(containerName == "BBANDS")
         jsonObj = $scope.bbandsChartData;
     else
         jsonObj = $scope.macdChartData;
     
    var first = new Array();
    var second = new Array();   
    var third = new Array();  
        
    var symbol = jsonObj["Meta Data"]["1: Symbol"];   // MSFT, etc.
    var indicator = jsonObj["Meta Data"]["2: Indicator"]; 
    
    var indicatorSplitBySpace = indicator.split(" ");
    var symbolKey = indicatorSplitBySpace[indicatorSplitBySpace.length-1];
    
    var yaxisData = symbolKey.slice(1,-1);
    
    var indicatorData =Object.values(jsonObj)[1];
    
    var data = Object.values(Object.values(indicatorData));
    var dates = Object.keys(indicatorData);
    var processed_dates = new Array();
  
    
    var k = 0;

   for (i = 0; i < dates.length && k < 126; i++) {       
      var datestring = dates[i];
      var mm = datestring.substring(5,7);
      var dd = datestring.substring(8,10);
       var dateInMMDD = (mm.concat("/")).concat(dd);
      processed_dates.push(dateInMMDD);
       k++;
    }
    k = 0;
    
    

    for (i = 0; i < data.length && k < 126; i++) {
        var j = Object.values(data[i])[2];
        first.push(parseFloat((j).substring(0,5))); 
        j = Object.values(data[i])[1];
        second.push(parseFloat((j).substring(0,5))); 
        j = Object.values(data[i])[0];
        third.push(parseFloat((j).substring(0,5))); 
        k++;
    }
        
    
        var indicator1 =  Object.keys(data[0])[0];
        var indicator2 =   Object.keys(data[0])[1];
        var indicator3 =   Object.keys(data[0])[2];
     
        var symbol1 = symbol.concat(" ").concat(indicator1);
        var symbol2 = symbol.concat(" ").concat(indicator2);
        var symbol3 = symbol.concat(" ").concat(indicator3);
    
        var color1 = '#ADDFFF';
        var color2 = '#000000';
        var color3 = '#008000';
    
       
Highcharts.chart('chartContainer', {
    
     
            chart: {
                
                zoomType: 'x',
                
                panning: true,
                panKey: 'shift'
            },
        
        credits: {
        enabled: false
    },
    
    plotOptions: {


    series: {
     marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2.5
            },
        color: '#ef2400'
  },
        
        line: {
                    marker: {
                        enabled: false
                    }
                }
            
},
   
  
        title: {
            text: indicator
        },
        subtitle: {
            text: '<a href="https://www.alphavantage.co/" style="color: blue" target="_blank">Source: Alpha Vantage</a>'
        },
          xAxis: {      
         categories: processed_dates,
               reversed: true,
              tickInterval: 5
        },
        yAxis: {
            title: {
                text: yaxisData
            }
        },
        legend: {
       
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
       
        series: [{
            name:  symbol1,
            type: 'line',
            color: color1,
            data: first,
             marker: {
            enabled: true
        }

           
        },
                 
                 {
            name:  symbol2,
            type: 'line',
            color: color2,
            data: second,
                      marker: {
            enabled: true
        }

           
        },
                    {
            name:  symbol3,
            type: 'line',
            color: color3,
            data: third,
                         marker: {
            enabled: true
        }

            
        }
                
    ]
    });  
     
 }
  $scope.AddFav= function(id,stockPrice,change,volume){
    	//alert(type)


    	if (localStorage.getItem(id) === null) {
    		//$scope.items[id]["fav"]=1;
            //;
    		var details=[id,$scope.lastPrice,$scope.change,$scope.changePercent,$scope.color,$scope.imageURL, $scope.volume1,$scope.volume,$scope.changePercentVal]
            
         
            
            localStorage.setItem(id, JSON.stringify(details));
            

             $scope.result[id]={symbol :details[0],stockPrice: details[1],change:details[2],changePercent1:details[3],  color:details[4], imageURL:details[5], volume:details[6], volume1:details[7], changePercent: details[8] }
            
         //   $scope.result[id] = [details[0],details[1],details[2],details[3], details[4], details[5], details[6] ] ;
        

}
    	else
    	{
    		//alert($scope.items[id]["fav"])
          //  $scope.items[id] = null;
    		//$scope.items[id]["fav"]=0
    		localStorage.removeItem(id);
            
    $scope.result[id] = null;

    }
}
  
  $scope.DeleteFav = function(id) {
      
      localStorage.removeItem(id);
      
    
       $scope.result[id] = null;

     console.log($scope.result[id]);
  }
  
  
  $scope.toShowRow = function(val) {
      
      if(val != null)
          return true; 
      else
          return false;
      
  }
  
 $scope.sortMe = function() {
       return function(object) {
            return object[1].value.symbol;
       }
 }
  
//  $scope.filterPaging = function(items) {
//    var result = {};
//    angular.forEach(items, function(value, key) {
//        if (value.hasOwnProperty('next') ) {
//            $scope.next_link=value;
//           
//
//        }
//        else if(value.hasOwnProperty('prev'))
//        {
//        	//alert("found")
//        	 $scope.prev_link=value;
//        }
//        else
//        {
//        
//        result[key] = value;
//       
//    }
//    });
//    return result;
// 
//}
  
  
  $scope.getQuoteFromSymbol = function(sym) {
      
      $scope.stockSymbol = sym;
      $scope.loading = true;
      
      
        $scope.hideTable = true;
      
      $scope.getQuote();
  }
  
  $scope.getQuote = function() {
      
        $scope.loading = true;
      
        $scope.hideTable = true;
      
        $scope.whichAreaToShow = 'resultArea';
         $scope.firstTime = false;
      
      //  $scope.favShow = false;
     
      $scope.getQuoteOriginal();
}
  
  
  
  
  $scope.getSuggestions = function() {
      
     
 if(($scope.stockSymbol).length >= 1  && $scope.autocompleteValues[$scope.stockSymbol.charAt(0)] == null)
      {
          
        stockService.getSuggestions($scope.stockSymbol.charAt(0)).then(function(response) {
            
            var array = [];
            var data = response.data;
            
  
            angular.forEach(data, function(value, key) {
                
               var dropdownvalue = (value.Symbol).concat(' - ').concat(value.Name).concat(' (').concat(value.Exchange).concat(')');
                
                  array.push(dropdownvalue);
                
            
            })
          
          $scope.autocompleteValues[$scope.stockSymbol] = array;
            
            
            console.log(response.data);
      
      });
    }
      
     //$scope.toshowSuggesstions();
      
 }
  
  $scope.getQuoteOriginal = function() {
      
     
      
    
      $scope.getStockTableData();
        
   
      // News Data
      
      stockService.getNewsData($scope.stockSymbol).then(function(response) {     
      $scope.fetchNewsData(response);
      
      });
      
     
      
      stockService.getIndicatorData($scope.stockSymbol , "SMA").then(function(response) {  
           $scope.smaChartData = response.data; 
          
          
      });
      
      stockService.getIndicatorData($scope.stockSymbol , "EMA").then(function(response) {  
           $scope.emaChartData = response.data; 
          
          
      });
      stockService.getIndicatorData($scope.stockSymbol , "RSI").then(function(response) {  
           $scope.rsiChartData = response.data;  
         
      });
      stockService.getIndicatorData($scope.stockSymbol , "ADX").then(function(response) {  
           $scope.adxChartData = response.data; 
         
          
      });
      stockService.getIndicatorData($scope.stockSymbol , "CCI").then(function(response) {  
          $scope.cciChartData = response.data; 
        
          
      });
      
    
      stockService.getIndicatorData($scope.stockSymbol , "STOCH").then(function(response) {  
           $scope.stochChartData = response.data; 
           
          
      });
      
        stockService.getIndicatorData($scope.stockSymbol , "BBANDS").then(function(response) {  
           $scope.bbandsChartData = response.data; 
          
         
      });
      
        stockService.getIndicatorData($scope.stockSymbol , "MACD").then(function(response) {  
          $scope.macdChartData = response.data; 
          
          
      });
       
    }
	
  
  $scope.getStockTableData = function() {
      
    
        
        stockService.getStockData($scope.stockSymbol).then(function(response) {
        $scope.stockDetails = response.data;  
         
       
        $scope.symbol = $scope.stockDetails["Meta Data"]["2. Symbol"];
        var timeSeriesKeys = Object.keys($scope.stockDetails["Time Series (Daily)"]);        
        var timeSeriesValues = Object.values($scope.stockDetails["Time Series (Daily)"]);
            
        var todayHour = $filter('date')(new Date(), 'HH');
        var firstDateGot = timeSeriesKeys[0]; 
            
         $scope.currentclose =parseFloat(timeSeriesValues[0]["4. close"]).toFixed(2);
     
        if(todayHour >= 16) {
       
        $scope.low =  (parseFloat(timeSeriesValues[0]["3. low"]).toFixed(2)).toString();
       
        $scope.high = (parseFloat(timeSeriesValues[0]["2. high"]).toFixed(2)).toString();
       
        $scope.lowHighString = ($scope.low).concat("-").concat($scope.high); 
       
        $scope.volume1 =  parseFloat(timeSeriesValues[0]["5. volume"]);
            
            console.log('vol is');
             console.log($scope.volume1);
            $scope.volume =  parseFloat(timeSeriesValues[0]["5. volume"]).toLocaleString();
           
        $scope.open = parseFloat(timeSeriesValues[0]["1. open"]).toFixed(2);
        $scope.close =parseFloat(timeSeriesValues[0]["4. close"]).toFixed(2);
       
        $scope.prevClose = parseFloat(timeSeriesValues[1]["4. close"]).toFixed(2);
    
        $scope.change = $scope.close - $scope.prevClose;
       
        $scope.changePercentVal = (((Math.abs($scope.change)/$scope.prevClose) * 100).toFixed(2));
      
        $scope.changePercent = $scope.changePercentVal.toString();
       
        $scope.change= ($scope.change).toFixed(2);
       
     
        console.log('total date');
            
            
        var today = $filter('date')(new Date(),'yyyy-MM-dd');
            
            var todaydate = new Date();
            
            console.log('hAPPY Today');
            
             console.log(todaydate);
            
            
           
            
       
       console.log(firstDateGot);
        
       
       console.log(today);
      //  weekend
           
           $scope.lastPrice = $scope.close;
       
       
    }
    
    else {
             
        $scope.low =  (parseFloat(timeSeriesValues[1]["3. low"]).toFixed(2)).toString();
       
        $scope.high = (parseFloat(timeSeriesValues[1]["2. high"]).toFixed(2)).toString();
       
        $scope.lowHighString = ($scope.low).concat("-").concat($scope.high); 
       
        $scope.volume =  parseFloat(timeSeriesValues[1]["5. volume"]).toLocaleString();
           
        $scope.open = parseFloat(timeSeriesValues[1]["1. open"]).toFixed(2);
        $scope.close =parseFloat(timeSeriesValues[1]["4. close"]).toFixed(2);
       
        $scope.prevClose = parseFloat(timeSeriesValues[2]["4. close"]).toFixed(2);
       
        $scope.change = $scope.close - $scope.prevClose;
       
      
        $scope.changePercent = (((Math.abs($scope.change)/$scope.prevClose) * 100).toFixed(2)).toString();
       
        $scope.change= ($scope.change).toFixed(2);
       
     
        console.log('total date');
            
            
        var today = $filter('date')(new Date(),'yyyy-MM-dd');
       
       console.log(firstDateGot);
        
       
       console.log(today);
        
        $scope.timeStampVal = firstDateGot;
       if(firstDateGot == today) {  // week day, 
           
           var compare = (firstDateGot == today);
           
           
           
           $scope.lastPrice =  $scope.prevClose ;
           
           
           
           
           console.log(compare);
           
       }
       else {   //  weekend
           
           $scope.lastPrice = $scope.close;
           
       }
        
        
                
    }
    
       
       if($scope.change < 0) {  // decrease
           
           $scope.change = ($scope.change).toString();
           
           $scope.changePercentVal = -$scope.changePercentVal;
        
            $scope.changePercent = "-" +  $scope.changePercent;
           
           $scope.imageURL = "http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png";
   
           $scope.color = "red";
       }
       
       else {  // increase
           
            $scope.change = ($scope.change).toString();
            $scope.imageURL = "http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png";
            $scope.color = "#00ff01";
         
       }
      
       // $scope.changePercent  = ("(").concat($scope.changePercent).concat("%\)");
            
        $scope.changeString =($scope.change).concat(" ").concat("(").concat($scope.changePercent).concat("%\)");
            $scope.loading = false;
           $scope.hideTable = false;
            
            $scope.priceChartData = response.data;
            
           $scope.createStockPriceChart();
            
              $scope.createHistoricalChart();
  });
  }

 
  
}]);

app.filter('orderObjectBy', function() {
 return function(input, attribute) {
     
   
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        if(input[objectKey] != null)
        array.push(input[objectKey]);
    }
     
     if(attribute[0] == "default")
        return array;
     
     
     if(attribute[0] == "symbol") {
         
    array.sort(function(a, b){
       
    if(attribute[1] == "ascending")
     
        return a[attribute[0]] >= b[attribute[0]];
    
    else
        return a[attribute[0]]  <= b[attribute[0]];
        
    });

         
         
     }
     
//     else if (attribute[0] == "changePercent") {
//         
//    array.sort(function(a, b){
//       
//    if(attribute[1] == "ascending")
//     
//        return parseFloat(a[attribute[0]].slice(1,-1)) >= parseFloat(b[attribute[0]].slice(1,-1));
//    
//    else {
//        console.log('percent');
//         console.log(a[attribute[0]].slice(1,-1));
//           console.log(b[attribute[0]].slice(1,-1));
//        return parseFloat(a[attribute[0]].slice(1,-1)) <= parseFloat(b[attribute[0]].slice(1,-1));
//        
//        
//    }
//        
//    });
//                          
//}
     
else {
array.sort(function(a, b){
       
    if(attribute[1] == "ascending")
     
        return parseFloat(a[attribute[0]]) - parseFloat(b[attribute[0]]);
    
    else
        return parseFloat(b[attribute[0]]) - parseFloat(a[attribute[0]]);
        
    });

}
   
    return array;
 }
});

app.service("stockService", function( $http) {
    
    this.getStockData = function(symbol) {
  
     return $http({
        method : "GET",
        url : 'http://csci571hw8-env.us-east-2.elasticbeanstalk.com/symbolData?symbol='+symbol
       
    })};
    
    
    
    
    this.getNewsData = function(symbol) {
   
     return $http({
        method : "GET",
        url : 'http://csci571hw8-env.us-east-2.elasticbeanstalk.com/newsFeed?symbol='+symbol
       
    })}; 
    
    this.getIndicatorData = function(symbol ,indicator) {
    
     return $http({
        method : "GET",
       url : 'http://csci571hw8-env.us-east-2.elasticbeanstalk.com/indicatorData?symbol='+symbol + '&indicator='+indicator
     
    })}; 
    
    
    this.getSuggestions = function(stockPrefix) {
        
     return $http({
        method : "GET",
        url : 'http://csci571hw8-env.us-east-2.elasticbeanstalk.com/stockSuggestions?stockPrefix='+stockPrefix
       
    })}; 
    
    
   
    
})