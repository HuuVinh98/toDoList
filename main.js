
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
                    </div> `
                    
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
            list.push({name:thing,deadline:deadline,quantity:true,checked:false,id:randomId(5),now:nowTime});
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
    let idx = list.findIndex(val=>val.id === curId);
    list.splice(idx,1);
    renderList();
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