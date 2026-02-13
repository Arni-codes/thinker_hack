const urgency=["urgennt","immediately","now","last chance","final warning","act fast","limited time","don't miss out","urgent action required","time-sensitive","suspended"];
const fear=["legal action","blocked","penalty","suspend","threat","danger","risk","warning","alert"];
const reward=["free","bonus","gift","win","prize","exclusive offer","limited time offer","discount","deal","special promotion","claim","cashback"];
const sensitive=["password","account","social security number","credit card","bank account","personal information","confidential","private","sensitive data","otp","bank","verify","pin","upi","aadhar","pan","cvv"];

document.getElementById("analyzeBtn").addEventListener("click", analyze);
document.getElementById("clearBtn").addEventListener("click", clearText);

function count(text,words){
    return words.filter(word => text.includes(word)).length;
}
function speak(text){
    const msg=new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(msg);
}
function clearText(){
    document.getElementById("mid").value="";
    document.getElementById("result").innerHTML="";
}
function checkLinks(text){
    let score=0;
    let reasons=[];
    const urlRegex=/https?:\/\/[^\s]+/g;
    const urls=text.match(urlRegex);
    if(!urls){
        return {score:0,reasons:[]};
        urls.forEach(url=>{
            if(/bit\.ly|tinyurl\.com|goo\.gl/.test(url)){
                score+=25;
                reasons.push("Contains suspicious shortened URL: "+url);
            }
            if(/\.(xyz|top|club|online|site|info|biz|ru|cn|click|tk|ml|win)$/i.test(url)){
                score+=20;
                reasons.push("Contains URL with risky domain: "+url);
            }
            if(/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)){
                score+=30;
                reasons.push("Contains URL with IP address instead of domain: "+url);
             }
             if((url.match(/-/g)||[]).length>3){
                score+=10;
                reasons.push("Contains URL with excessive hyphens: "+url);
             }
     });
    }
    

    return {score,reasons};
}
function analyze(){
    let text=document.getElementById("mid").value.toLowerCase();
    if(text.trim()===""){
        alert("Please paste a message first.");
        return;
    }
    let score=0;
    let reason=[];
    if(count(text,sensitive)>0){
        score+=30;
        reason.push("Request confidential information ");
    }
    if(count(text,urgency)>0){
        score+=15;
        reason.push("Uses urgency language");
    }
    if(count(text,fear)>0){
        score+=20;
        reason.push("Uses fear or threats");
    }
    if(count(text,reward)>0){
        score+=10;
        reason.push("Offers suspicious rewards");
    }
    let linkCheck = checkLinks(text);
    score += linkCheck.score;
    reasons.push(...linkCheck.reasons);
    let level="LOW";
    let css="low";
    if(score>=60){
        level="HIGH";
    }
    else if(score>30){
        level="MEDIUM";
        css="medium";
    }
    let resultHTML=`<h2 class="${css}">Risk Level: ${level}</h2>
    <p>Score: ${score}/100</p>;

    <ul>${reasons.map(r=>'<li>'+r+'</li>').join("")}</ul>`;

    document.getElementById("result").innerHTML=resultHTML;

    speak(`This message has ${level} scam risk.`);
}
