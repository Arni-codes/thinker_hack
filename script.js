const urgency=["urgent","immediately","now","last chance","final warning","act fast","limited time","don't miss out","urgent action required","time-sensitive","suspended"];

const fear=["legal action","blocked","penalty","suspend","threat","danger","risk","warning","alert"];

const reward=["free","bonus","gift","win","prize","exclusive", "offer","limited","discount","deal","special promotion","claim","cashback"];

const sensitive=["password","account","social security number","credit card","bank account","personal information","confidential","private","sensitive data","otp","bank","verify","pin","upi","aadhar","pan","cvv"];



document.getElementById("analyzeBtn").addEventListener("click", analyze);
document.getElementById("clearBtn").addEventListener("click", clearText);



function count(text,words){
    return words.filter(word => text.includes(word)).length;
}

function speak(text){
    const msg = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(msg);
}

function clearText(){
    document.getElementById("mid").value="";
    document.getElementById("result").innerHTML="";
}
function checkLinks(text){

    let score = 0;
    let reasons = [];

    const urls = text.match(/https?:\/\/[^\s]+/g);
    if(!urls) return {score:0, reasons:[]};

    const safeDomains = [
        "google.com","youtube.com","amazon.in","amazon.com",
        "sbi.co.in","icicibank.com","hdfcbank.com",
        "gov.in","onlinesbi.sbi"
    ];

    urls.forEach(url => {

        const domain = url.replace(/https?:\/\//,'').split('/')[0];

        if(/bit\.ly|tinyurl|t\.co/i.test(url)){
            score+=25;
            reasons.push("Uses shortened link");
        }

        else if(/\.(xyz|top|club|online|site|info|biz|tk|ml|win)/i.test(url)){
            score+=20;
            reasons.push("Suspicious domain extension");
        }

        else if(/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)){
            score+=30;
            reasons.push("Uses IP address instead of domain");
        }

        
        else if(!safeDomains.some(d => domain.includes(d))){
            score+=15;
            reasons.push("Unknown or untrusted website");
        }
    });

    return {score, reasons};
}
