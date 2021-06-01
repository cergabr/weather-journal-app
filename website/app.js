const baseURL= 'http://api.openweathermap.org/data/2.5/weather?';
const unitURL= '&units=metric';
const getApiKey = async (url)=>{
  const res = await fetch(url);
  try{
    const apiKeyData = await res.json();
    return '&appid='+apiKeyData.id;
  }catch(error){
    console.log(error);
  }
};

const postData = async (url='', data={})=>{
  const res=await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify(data)
  });
  try {
    const newData=await res.json();
    console.log("postData: ",newData);
    return newData;
  }catch(error){
  console.log('error', error);
  }
}

const getData=async(url, param, key, unit)=>{
  const res=await fetch(url+param+key+unit);
  try{
    const data=await res.json();
    if (res.ok){
      console.log("getData: ",data);
      return data;
    }
    else{
      return unsetUI();
    }
  }catch(error){
    console.log('error', error);
  }
}

const updateUI = async () => {
  const req=await fetch('/all');
  console.log(req);
  try{
    const allData=await req.json();
    console.log("updateUI: ", allData);
    const lastArray=allData.weatherData[allData.weatherData.length - 1];
    document.getElementById('city-name').innerHTML=lastArray['city'] + ',';
    document.getElementById('date').innerHTML=lastArray['date'];
    document.getElementById('temp').innerHTML=lastArray['temperature'] + '° C';
    document.getElementById('icon').firstElementChild.setAttribute('src',lastArray['icon']);
    document.getElementById('weather').innerHTML=lastArray['weather'];
    lastArray['userResponse']==""?"":document.getElementById('userResponse').innerHTML='I\'m feeling ' + lastArray['userResponse'];
    document.getElementById('entryHolder').style='display:flex';
    setTimeout(scrollToBottom(),300);

  }catch(error){
    console.log('error', error);
  }
}

function unsetUI(){
  document.getElementById('error').innerHTML='Something went wrong!<br> There could be an error in the fields or there are no data available for such place';
  const entryHolder = document.getElementById('entryHolder');
  entryHolder.removeAttribute("style");
  const divList = entryHolder.querySelectorAll('div');
  for (const child of divList){
    child.innerHTML="";   
  }
}

function scrollToBottom(){
  window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'});
}

function updateWeatherData(e){
  const zip=document.getElementById('zip').value.trim();
  const feelings=document.getElementById('feelings').value;
  const city=encodeURI(document.getElementById('city').value.trim());
  const country=document.getElementById('country').value.trim();

  let paramType='';
  let newURL=baseURL;

  let dateObj = new Date();
  let currentDate=dateObj.toLocaleDateString(navigator.language,{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'});

  if (city != ''){
    newURL+='q=';
    paramType=city;
    document.getElementById('error').innerHTML="";
    if (country != ''){
      paramType+=','+country;
    }
  }
  else if (zip != ''){
      newURL+='zip=';
      paramType=zip;
      document.getElementById('error').innerHTML="";
  }
  else{
    return document.getElementById('error').innerHTML='Empty fields! Fill at least city or zip field to procede';
  }

  getApiKey('/apiKeyId')
  .then(apiKey=>{
    getData(newURL, paramType, apiKey, unitURL)
    .then((data)=>{
      postData('/add', {
        city: data["name"],
        date: currentDate,
        temp: (data["main"].temp).toFixed(1), 
        icon: 'http://openweathermap.org/img/wn/' + data["weather"][0].icon + '@2x.png',
        weather: data["weather"][0].description, 
        userResponse: feelings
      }).then(updateUI());
    })
  })
}

document.getElementById('generate').addEventListener('click', updateWeatherData);
document.querySelector('#bot-anchor').addEventListener('click', e => {
  window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
});
