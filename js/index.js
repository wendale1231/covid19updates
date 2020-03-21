var all_data;
var countries_data;
var countries_loaded = false;
var id = -1;
var chart;
var circle = [];

$("#data").hide();
$(document).ready(function(){
  $.ajax({
    url: "https://corona.lmao.ninja/countries",
    method: "GET",
    success: function(data){
      if(!countries_loaded){
        for(var i = 0; i < data.length; i++){
          $("#country").append("<option value='" + i + "'>" + data[i]["country"] + "</option>");
        }
        countries_loaded = true;
      }
    }
  });
});


function update_data(){
  // console.log("updating data..");
  $.ajax({
    url: "https://corona.lmao.ninja/all",
    method: "GET",
    success: function(data){
      $("#total_cases").html("<center><h5>Total Cases: " + data["cases"] + "</h5></center>");
      $("#total_deaths").html("<center><h5>Total Deaths: " + data["deaths"] + "</h5></center>");
      $("#total_recovered").html("<center><h5>Total Recovered: " + data["recovered"] + "</h5></center>");
      $("#total").html("<center><h5>Date Updated: " + Date(data["updated"]) + "</h5></center>");
    }
  });
}

$("#country").change(function(){
  if(id != -1){
    chart.destroy();
  }
  id = $("#country").val();
  $.ajax({
    url: "https://corona.lmao.ninja/countries",
    method: "GET",
    success: function(data){
      $("#data").show();
      var ctx = document.getElementById('myChart').getContext('2d');
      chart = new Chart(ctx, 
      {
        type: 'bar',
        data: 
          {
            labels: ['Cases', 'Deaths', 'Recovered', 'Active', 'Critical'],
            datasets: 
            [{
              label: 'Total Cases',
              data: [data[id]['cases'], data[id]['deaths'], data[id]['recovered'], data[id]['Active'], data[id]['critical']],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }],
        }
      });
      $("#cases").html("<p>Cases: " + data[id]['cases'] + "</p>");
      $("#deaths").html("<p>Deaths: " + data[id]['deaths'] + "</p>");
      $("#recovered").html("<p>Recovered: " + data[id]['recovered'] + "</p>");
      $("#active").html("<p>Active: " + data[id]['active'] + "</p>");
      $("#critical").html("<p>Critical: " + data[id]['critical'] + "</p>");
      $("#today_case").html("<h3>Todays Total Case: " + data[id]['todayCases'] + "</h3>");
    }
  });
  
});


function update_charts(){
}

function update_map(){
  $.ajax({
    url: "https://corona.lmao.ninja/jhucsse",
    method: "GET",
    success: function(data){
      // console.log(data);
      for(var i = 0; i < data.length; i++){
        try{
          // console.log(data[i]['coordinates']);
          // console.log(parseFloat(data[i]['coordinates']['latitude']) + "----" + parseFloat(data[i]['coordinates']['longitude']));
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: {lat: parseFloat(data[i]['coordinates']['latitude']), lng: parseFloat(data[i]['coordinates']['longitude'])},
            radius: parseFloat(data[i]['stats']['confirmed']) * 5
          });
          circle.push(cityCircle);
        }catch(e){
          continue;
        }
      }
    }
  })
}
update_map();
update_data();

setInterval(function(){
  update_data();
}, 1000);


setInterval(function(){
  for (var i = 0; i < circle.length; i++) {
    circle[i].setMap(null);
  }
  update_map();
  update_charts();
}, 10000)

