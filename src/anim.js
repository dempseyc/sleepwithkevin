

// console.log(animType1);
// animType1.html('knknk');

export function typeAnim (JQel)
{
    let cursor = '<span class="cursor">|</span>';
    let anim = [
    {text: "" ,
    delay: 0 },
    {text: "M" ,
    delay: 0 },
    {text: "ME" ,
    delay: 0 },
    {text: "MEE" ,
    delay: 0 },
    {text: "MEET" ,
    delay: 0 },
    {text: "MEET " ,
    delay: 0 },
    {text: "MEET K" ,
    delay: 0 },
    {text: "MEET KE" ,
    delay: 0 },
    {text: "MEET KEV" ,
    delay: 0 },
    {text: "MEET KEVI" ,
    delay: 0 },
    {text: "MEET KEVIN" ,
    delay: 0 },
    {text: "MEET KEVIN " ,
    delay: 0 },
    {text: "MEET KEVIN B" ,
    delay: 0 },
    {text: "MEET KEVIN BE" ,
    delay: 0 },
    {text: "MEET KEVIN BER" ,
    delay: 0 },
    {text: "MEET KEVIN BERR" ,
    delay: 2 },
    {text: "MEET KEVIN BERRY" ,
    delay: 2 },
    {text: "MEET KEVIN BERR" ,
    delay: 3 },
    {text: "MEET KEVIN BERRE" ,
    delay: 8 },
    {text: "MEET KEVIN BERREY" ,
    delay: 4 }
    ];
    console.log('typeanim');
    let d = 0;
    let t = 0;

    let stepAnimForward = function () {
        console.log("fired");
        d = anim[t].delay;
        if (d>0) {
        d--;
        anim[t].delay = d;
        } else {
        JQel.html(anim[t].text+cursor);
        t++;
        }
        if (t>anim.length-1) {
        clearInterval(timer);
        }
    }

    let timer = setInterval(function(){
        stepAnimForward();
    }, 150);

}

export function fadeIn(JQel) 
{
    let timeout = function() {
        clearTimeout(timer6sec);
    }

    let timer6sec = setTimeout(function() {

        JQel.css({"opacity": "1"});
        timeout();

    }, 2000);
}

export function squeezeIn(JQel)
{

    JQel.html('MEET KEVIN BERRY');

    let timeout1 = function() {
        clearTimeout(timer1sec);
    }

    let timer1sec = setTimeout(function() {
        JQel.html('MEET KEVIN BERR<span class="e-span">E</span>Y');
        timeout1();
    }, 1000);

}


