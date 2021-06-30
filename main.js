
if(JSON.parse(localStorage.getItem("list"))===null)
{
    let list = [];
    localStorage.setItem("list",JSON.stringify(list));
}
let list = JSON.parse(localStorage.getItem("list"));

let getTime = () =>
{
    let now = new Date();
    let days = now.getDay();
    let day;
    switch (days)
    {
        case 1:
            {
                day = "Mon";
                break;
            }
        case 2:
            {
                day = "Tues";
                break;
            }
            case 3:
                {
                    day = "Wed";
                    break;
                }
            case 4:
            {
                day = "Thur";
                break;
            }
            case 5:
            {
                day = "Fri";
                break;
            }
            case 6:
            {
                day = "Sat";
                break;
            }
            default:
            {
                day = "Sun";
                break;
            }
    }
    let time = now.getHours() + " : " + now.getMinutes() +" : " +now.getSeconds() +" - " + day + ", " + now.getDate()+"/"+(Number(now.getMonth())+1)+"/"+now.getFullYear();
    $(".now .times span").text(time);
    
}
setInterval(function (){getTime()},1000);
//render function
let renderList = () =>
{
    $(".lists").empty();
    
    if(list.length)
    {
        
        list.map(val=>
            {
                let totalTime;
                let distant;
                if(val.deadline!=="")
                {
                    const a = new Date(val.deadline);
                     totalTime = (a-new Date(val.now))/1000;
                    const now = new Date();
                     distant = (a-now)/1000; // seconds
                    const overTime = distant/totalTime;
                } 

                $(
                    `
                    <div class="item" data-id="${val.id}">
                        <input type="checkbox" ${val.checked?"checked":""}>
                        <div class="item-info ${val.checked===true?"active":""}">
                            <h4>${val.name}</h4>
                            <p>${val.deadline}</p>
                            <div class="progress">
                                <span style="width:${(totalTime-distant)/totalTime*100}%;"></span>
                            </div>
                           
                        </div>
                        <span class="delete"><i class="far fa-times-circle"></i></span>
                    </div>
                   
                     </div>
                    `
                    
                ).appendTo(".lists");
            });
    }
    
    let quantity = list.reduce((acc,val)=>{return val.quantity===true?acc+1:acc},0);
    if(quantity>1)
    {
        $(".quantity").text(`are ${quantity}/${list.length} `);
    }
    else if (quantity===0)
    {
        $(".quantity").text("is no ");
    }
    else
    {
        $(".quantity").text(`is 1/${list.length}`);
    }
    localStorage.setItem("list",JSON.stringify(list));
}
renderList();
setInterval(function () {renderList()},1000);

//checked
$(document).on("click",".item input", function () {
    const curId = $(this).parent().data("id");
    let idx = list.findIndex(val=>val.id===curId);
    list[idx].checked = !list[idx].checked;
    list[idx].quantity = !list[idx].quantity;
    renderList();
    
});
//open add box
$("#add").click(function (e) { 
    e.preventDefault();
    $(".add-box").fadeIn("fast");
    $(".add-box").css("display", "flex");
});
//close add box 
$("#close-add-box").click(function (e) { 
    e.preventDefault();
    $(".add-box").fadeOut(500);
    $(".notice").empty();
    $(".notice2").empty();
});

//add new thing to do
$("#add-to-list").click(function (e) { 
    e.preventDefault();
    $(".notice").empty();
    $(".notice2").empty();

    let thing = $("#something").val();
    let deadline = $("#deadline").val();
    let pattern =/^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
    let check = new Date(deadline);
    let now = new Date();
    if(!thing.length)
    {
        $(".notice").text("Enter something, please!");
    }
    else 
    {
        if(deadline==="" || (pattern.test(deadline) && check - now>0) )
        {
            $(".notice").empty();
            let Time = new Date();
            let nowTime = Time.getFullYear()+"/"+(Number(Time.getMonth())+1)+"/"+Time.getDate();
            console.log(nowTime)
            list.unshift({name:thing,deadline:deadline,quantity:true,checked:false,id:randomId(5),now:nowTime});
            renderList();
            $("#something").val("");
        }
    }
    
    if((!pattern.test(deadline) || check - now<0)&&deadline!=="")
    {
        $(".notice2").text("Invalid deadline!");
        
    }
    else 
    {
        $(".notice2").empty();
        
    }
    
    $("#something").val("");
    $("#deadline").val("");

});

//delete item

$(document).on("click",".delete", function () {
    const curId = $(this).parent().data("id");
     let idxs= list.findIndex(val=>val.id === curId);
    $("main").append(
        `
            <div class="notice-delete" data-id="${idxs}">
            <div class="content">
                <h3>Do you want to delete this item?</h3>
                <div class="btn">
                    <button id="delete-item">Delete</button>
                    <button id="cencal-delete">Cencal</button>
                </div>
            </div>
        `
    );
    $(".notice-delete").fadeIn("fast");
    $(".notice-delete").css("display", "flex");    
    
});
$(document).on("click","#delete-item", function () {
    const curId = $(this).parents(".notice-delete").data("id");
    list.splice(curId,1);
    renderList();
    $(".notice-delete").fadeOut(500);
});
$(document).on("click","#cencal-delete", function () {
    $(".notice-delete").fadeOut(500);
    $(".notice-delete").remove();
});

//randomId function
const randomId = (len)=>
{
    let id="";
    for(let i=0;i<len;i++)
    {
        id += rndChar();
    }
    return id;
}
//rndChar() function
const rndChar = () =>
{
    const chars = "abcdefghijklmnopqrstuvwxyz ";
    const idx = Math.floor(Math.random()*chars.length);
    return chars[idx];
}
//weather


function weatherBalloon( cityID ) {
    var key = '89a619a4a6382776c76327928ed9a78e';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
       const mainWeather = [
            {name:"clear", day:"http://openweathermap.org/img/wn/01d@2x.png", night:"http://openweathermap.org/img/wn/01n@2x.png"},
            {name:"clouds",day:"http://openweathermap.org/img/wn/02d@2x.png",night:"http://openweathermap.org/img/wn/02n@2x.png"},
            {name:"shower rain",day:"http://openweathermap.org/img/wn/09d@2x.png",night:"http://openweathermap.org/img/wn/09n@2x.png"},
            {name:"rain",day:"http://openweathermap.org/img/wn/11d@2x.png",night:"http://openweathermap.org/img/wn/11d@2x.png"},
            {name:"thunderstorm",day:"http://openweathermap.org/img/wn/11d@2x.png",night:"http://openweathermap.org/img/wn/11d@2x.png"},
            {name:"	snow",day:"http://openweathermap.org/img/wn/13d@2x.png",night:"http://openweathermap.org/img/wn/13d@2x.png"},
            {name:"mist",day:"http://openweathermap.org/img/wn/50d@2x.png",night:"http://openweathermap.org/img/wn/50d@2x.png"}
        
        ]
        //status
        $(".decription").text(`${data.weather[0].main}`);
        //icon
        let now = new Date();
        if(Number(now.getHours())>=18 || Number(now.getHours())<6)
            {
                $(".icon").html(`
            <img src="${mainWeather.filter(val=>val.name===data.weather[0].main.toLowerCase())[0].night}">`);
            }
            else
            {
                $(".icon").html(`
            <img src="${mainWeather.filter(val=>val.name===data.weather[0].main.toLowerCase())[0].day}">`);
            }
        //temperature
        $(".temperature").text(`${Number((data.main.temp-273.15).toFixed(2))}`);
        //humidity
        $(".humidity").text(`Humidity: ${Number((data.main.humidity).toFixed(2))} %`);
        $(".wind-speed").text(`Wind speed: ${Number((data.wind.speed).toFixed(2))} km/h`);
        $(".wind-deg").text(`Win deg: ${Number((data.wind.deg).toFixed(2))} deg`);

      })
      
    .catch(function() {
      // catch any errors
    });
  }
  setInterval(function (){weatherBalloon( 1566083);},1000)

